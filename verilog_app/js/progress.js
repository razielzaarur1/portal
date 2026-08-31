/* ==========================================================================
   VeriLearn Progress Management System (Multi-Device Live Cloud Sync)
   Handles LocalStorage state persistence, user code, streaks, stats,
   bidirectional server sync (REST / SSE), multi-device progress merge,
   cross-tab synchronization (BroadcastChannel), and incognito resilience.
   ========================================================================== */

class ProgressManager {
  constructor() {
    this.broadcastChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('verilearn_sync_channel') : null;
    this.eventSource = null;
    this.syncInProgress = false;
    this.lastSyncTimestamp = 0;

    // Load initial state immediately from localStorage
    this.data = this.loadLocal();

    // Setup cross-tab broadcast listener
    if (this.broadcastChannel) {
      this.broadcastChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'progress_update') {
          this.data = this.mergeProgress(this.data, event.data.progress);
          this.saveLocal();
          window.dispatchEvent(new CustomEvent('progressUpdated', { detail: this.data }));
        }
      };
    }

    // Setup storage event listener for cross-window sync
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === this.getStorageKey() && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.data = this.mergeProgress(this.data, parsed);
            window.dispatchEvent(new CustomEvent('progressUpdated', { detail: this.data }));
          } catch(err) {}
        } else if (e.key === 'student_tz') {
          // User logged in or switched account in another tab
          this.initSync();
        }
      });

      // Sync with server on tab focus and visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.syncWithServer();
        }
      });
      window.addEventListener('focus', () => this.syncWithServer());
    }

    // Start background sync & SSE connection
    this.initSync();

    // Periodic heartbeat sync every 15 seconds
    if (typeof setInterval !== 'undefined') {
      setInterval(() => {
        this.syncWithServer();
      }, 15000);
    }
  }

  getStudentTz() {
    if (typeof window === 'undefined') return null;

    // 1. Check URL search parameters (e.g. ?tz=123456789)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTz = urlParams.get('tz') || urlParams.get('student_tz');
      if (urlTz) {
        if (typeof localStorage !== 'undefined') localStorage.setItem('student_tz', urlTz);
        return urlTz;
      }
    } catch(e) {}

    // 2. Check LocalStorage
    try {
      const storedTz = localStorage.getItem('student_tz');
      if (storedTz) return storedTz;
    } catch(e) {}

    // 3. Check SessionStorage
    try {
      const sessTz = sessionStorage.getItem('student_tz');
      if (sessTz) return sessTz;
    } catch(e) {}

    // 4. Check Parent window if loaded inside an iframe
    try {
      if (window.parent && window.parent !== window && window.parent.localStorage) {
        const parentTz = window.parent.localStorage.getItem('student_tz');
        if (parentTz) {
          localStorage.setItem('student_tz', parentTz);
          return parentTz;
        }
      }
    } catch(e) {}

    return null;
  }

  getStorageKey() {
    const tz = this.getStudentTz();
    return tz ? `verilearn_user_progress_master_${tz}` : 'verilearn_user_progress_master_v1';
  }

  getDefaultData() {
    return {
      completedLessons: [],
      savedCode: {},
      attempts: {},
      lastActiveDate: null,
      streakCount: 0,
      totalPracticeSeconds: 0,
      lastLessonId: 1
    };
  }

  loadLocal() {
    const key = this.getStorageKey();
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
            savedCode: parsed.savedCode || {},
            attempts: parsed.attempts || {},
            lastActiveDate: parsed.lastActiveDate || null,
            streakCount: parsed.streakCount || 0,
            totalPracticeSeconds: parsed.totalPracticeSeconds || 0,
            lastLessonId: parsed.lastLessonId || 1
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load progress from LocalStorage', e);
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('progressError', { detail: { action: 'load', error: e } }));
      }
    }
    return this.getDefaultData();
  }

  saveLocal() {
    const key = this.getStorageKey();
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(this.data));
      }
    } catch (e) {
      console.warn('Failed to save progress to LocalStorage', e);
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('progressError', { detail: { action: 'save', error: e } }));
      }
    }
  }

  mergeProgress(local, remote) {
    if (!remote) return local;
    if (!local) return remote;

    const localList = Array.isArray(local.completedLessons) ? local.completedLessons : [];
    const remoteList = Array.isArray(remote.completedLessons) ? remote.completedLessons : [];
    const mergedCompleted = Array.from(new Set([...localList, ...remoteList])).sort((a, b) => a - b);

    const mergedSavedCode = Object.assign({}, remote.savedCode || {}, local.savedCode || {});
    // If local has empty/null and remote has code, keep remote code
    if (remote.savedCode) {
      for (const [k, code] of Object.entries(remote.savedCode)) {
        if (!mergedSavedCode[k] || mergedSavedCode[k].trim() === '') {
          mergedSavedCode[k] = code;
        }
      }
    }

    const mergedAttempts = Object.assign({}, remote.attempts || {}, local.attempts || {});

    return {
      completedLessons: mergedCompleted,
      savedCode: mergedSavedCode,
      attempts: mergedAttempts,
      lastActiveDate: local.lastActiveDate || remote.lastActiveDate || new Date().toISOString().split('T')[0],
      streakCount: Math.max(local.streakCount || 0, remote.streakCount || 0),
      totalPracticeSeconds: Math.max(local.totalPracticeSeconds || 0, remote.totalPracticeSeconds || 0),
      lastLessonId: local.lastLessonId || remote.lastLessonId || (mergedCompleted.length > 0 ? mergedCompleted[mergedCompleted.length - 1] : 1)
    };
  }

  initSync() {
    const tz = this.getStudentTz();
    if (!tz) return;

    this.connectSSE(tz);
    this.syncWithServer();
  }

  connectSSE(tz) {
    if (typeof EventSource === 'undefined' || !tz) return;
    if (this.eventSource) {
      try { this.eventSource.close(); } catch(e) {}
    }

    try {
      this.eventSource = new EventSource(`/api/events/${tz}`);
      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'verilearn_progress_updated' && data.progress) {
            console.log('[VeriLearn] Received real-time live progress update from server:', data.progress);
            this.data = this.mergeProgress(this.data, data.progress);
            this.saveLocal();
            window.dispatchEvent(new CustomEvent('progressUpdated', { detail: this.data }));
          }
        } catch(err) {}
      };
      this.eventSource.onerror = () => {
        // SSE reconnects automatically
      };
    } catch(e) {
      console.warn('[VeriLearn] SSE connect error:', e);
    }
  }

  async syncWithServer() {
    const tz = this.getStudentTz();
    if (!tz || typeof fetch === 'undefined' || this.syncInProgress) return;

    this.syncInProgress = true;
    try {
      const res = await fetch(`/api/students/${tz}/verilearn?_t=${Date.now()}`);
      if (res.ok) {
        const remoteData = await res.json();
        const prevCompletedCount = this.data.completedLessons.length;
        
        // Merge server and local
        const merged = this.mergeProgress(this.data, remoteData);
        this.data = merged;
        this.saveLocal();

        // If local had more lessons than remote or differed, push merged data back to server
        const remoteList = Array.isArray(remoteData.completedLessons) ? remoteData.completedLessons : [];
        if (merged.completedLessons.length > remoteList.length) {
          await this.pushToServer(tz, merged);
        }

        if (this.data.completedLessons.length !== prevCompletedCount) {
          window.dispatchEvent(new CustomEvent('progressUpdated', { detail: this.data }));
        }
      }
    } catch (e) {
      console.warn('[VeriLearn] Sync with server error:', e);
    } finally {
      this.syncInProgress = false;
      this.lastSyncTimestamp = Date.now();
    }
  }

  async pushToServer(tz, data) {
    if (!tz || typeof fetch === 'undefined') return;
    try {
      const res = await fetch(`/api/students/${tz}/verilearn`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data || this.data)
      });
      if (res.ok) {
        const respJson = await res.json();
        if (respJson && respJson.progress) {
          this.data = this.mergeProgress(this.data, respJson.progress);
          this.saveLocal();
        }
      }
    } catch(e) {
      console.warn('[VeriLearn] Push to server error:', e);
    }
  }

  save() {
    this.saveLocal();

    // Broadcast across tabs
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'progress_update', progress: this.data });
      } catch(e) {}
    }

    // Push to server
    const tz = this.getStudentTz();
    if (tz) {
      this.pushToServer(tz, this.data);
    }
  }

  isCompleted(lessonId) {
    return this.data.completedLessons.includes(lessonId);
  }

  completeLesson(lessonId) {
    if (!this.data.completedLessons.includes(lessonId)) {
      this.data.completedLessons.push(lessonId);
      this.data.completedLessons.sort((a, b) => a - b);
      this.data.lastLessonId = lessonId;
      this.updateStreak();
      this.save();
      window.dispatchEvent(new CustomEvent('progressUpdated', { detail: this.data }));
    }
  }

  saveUserCode(lessonId, code) {
    this.data.savedCode[lessonId] = code;
    this.data.lastLessonId = lessonId;
    this.save();
  }

  getUserCode(lessonId) {
    return this.data.savedCode[lessonId] || null;
  }

  recordAttempt(lessonId) {
    this.data.attempts[lessonId] = (this.data.attempts[lessonId] || 0) + 1;
    this.save();
  }

  updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (!this.data.lastActiveDate) {
      this.data.streakCount = 1;
      this.data.lastActiveDate = today;
    } else if (this.data.lastActiveDate !== today) {
      const last = new Date(this.data.lastActiveDate);
      const current = new Date(today);
      const diffDays = Math.round((current - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        this.data.streakCount += 1;
      } else if (diffDays > 1) {
        this.data.streakCount = 1;
      }
      this.data.lastActiveDate = today;
    }
  }

  getStats() {
    const totalLessons = window.CURRICULUM ? window.CURRICULUM.length : 100;
    const completedCount = this.data.completedLessons.length;
    const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return {
      completedCount,
      totalLessons,
      percentage,
      streakCount: this.data.streakCount || 0,
      lastLessonId: this.data.lastLessonId || 1,
      studentTz: this.getStudentTz()
    };
  }

  reset() {
    this.data = this.getDefaultData();
    this.save();
    window.dispatchEvent(new CustomEvent('progressUpdated', { detail: this.data }));
  }
}

window.Progress = new ProgressManager();
