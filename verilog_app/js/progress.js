/* ==========================================================================
   VeriLearn Progress Management System
   Handles LocalStorage state persistence, user code, streaks, and stats.
   ========================================================================== */

  getStorageKey() {
    const tz = typeof localStorage !== 'undefined' ? localStorage.getItem('student_tz') : null;
    return tz ? `verilearn_user_progress_master_${tz}` : 'verilearn_user_progress_master_v1';
  }

  load() {
    const key = this.getStorageKey();
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load progress from LocalStorage', e);
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('progressError', { detail: { action: 'load', error: e } }));
      }
    }

    // Attempt restoring progress from Portal API if student_tz exists
    const tz = typeof localStorage !== 'undefined' ? localStorage.getItem('student_tz') : null;
    if (tz && typeof fetch !== 'undefined') {
      fetch(`/api/students/${tz}/verilearn`)
        .then(res => res.ok ? res.json() : null)
        .then(remoteData => {
          if (remoteData && remoteData.completedLessons && remoteData.completedLessons.length > 0) {
            this.data = remoteData;
            this.saveLocal();
            if (typeof window !== 'undefined' && window.dispatchEvent) {
              window.dispatchEvent(new CustomEvent('progressUpdated', { detail: this.data }));
            }
          }
        }).catch(e => console.warn('Portal progress sync load error:', e));
    }

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

  saveLocal() {
    const key = this.getStorageKey();
    try {
      localStorage.setItem(key, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save progress to LocalStorage', e);
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('progressError', { detail: { action: 'save', error: e } }));
      }
    }
  }

  save() {
    this.saveLocal();

    // Sync to Portal backend if student_tz exists
    const tz = typeof localStorage !== 'undefined' ? localStorage.getItem('student_tz') : null;
    if (tz && typeof fetch !== 'undefined') {
      fetch(`/api/students/${tz}/verilearn`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.data)
      }).catch(e => console.warn('Portal progress sync save error:', e));
    }
  }

  isCompleted(lessonId) {
    return this.data.completedLessons.includes(lessonId);
  }

  completeLesson(lessonId) {
    if (!this.data.completedLessons.includes(lessonId)) {
      this.data.completedLessons.push(lessonId);
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
    const totalLessons = window.CURRICULUM ? window.CURRICULUM.length : 0;
    const completedCount = this.data.completedLessons.length;
    const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return {
      completedCount,
      totalLessons,
      percentage,
      streakCount: this.data.streakCount || 0,
      lastLessonId: this.data.lastLessonId || 1
    };
  }

  reset() {
    this.data = {
      completedLessons: [],
      savedCode: {},
      attempts: {},
      lastActiveDate: null,
      streakCount: 0,
      totalPracticeSeconds: 0,
      lastLessonId: 1
    };
    this.save();
    window.dispatchEvent(new CustomEvent('progressUpdated', { detail: this.data }));
  }
}

window.Progress = new ProgressManager();
