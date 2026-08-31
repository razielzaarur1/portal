/* ==========================================================================
   VeriLearn Core Application Engine & Router
   ========================================================================== */

class AppRouter {
  constructor() {
    this.currentView = 'home';
    this.currentParams = null;
    this.editorInstance = null;
  }

  init() {
    // Check global scope dependencies
    if (!window.CURRICULUM || !window.Progress || !window.i18n || !window.Simulator) {
      console.warn('VeriLearn Dependency Guard: Some global components are still loading or missing.', {
        curriculum: !!window.CURRICULUM,
        progress: !!window.Progress,
        i18n: !!window.i18n,
        simulator: !!window.Simulator
      });
    }

    // Initialize i18n
    if (window.i18n) window.i18n.init();

    // Listen for LocalStorage progress errors (e.g. Incognito or QuotaExceeded)
    window.addEventListener('progressError', (e) => {
      const isHe = window.i18n ? window.i18n.lang === 'he' : true;
      const msg = isHe ? 
        'אזהרה: לא ניתן לשמור התקדמות (LocalStorage חסום או מלא).' : 
        'Warning: Unable to save progress (LocalStorage blocked or full).';
      console.warn(msg, e.detail);
    });

    // Listen to hash changes and dynamic curriculum loading
    window.addEventListener('hashchange', () => this.handleHashChange());
    window.addEventListener('languageChange', () => this.renderCurrentView());
    window.addEventListener('curriculumReady', () => this.renderCurrentView());

    // Initial route handle
    this.handleHashChange();
  }

  handleHashChange() {
    const hash = window.location.hash.slice(1) || 'home';
    const parts = hash.split('/');
    const viewName = parts[0] || 'home';
    const param = parts[1] || null;

    this.currentView = viewName;
    this.currentParams = param;

    this.updateActiveNav(viewName);
    this.renderCurrentView();
  }

  updateActiveNav(viewName) {
    document.querySelectorAll('#bottom-nav .nav-item').forEach(item => {
      const targetView = item.getAttribute('data-view');
      if (targetView === viewName || (viewName === 'lesson' && targetView === 'lessons')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  renderCurrentView() {
    const container = document.getElementById('view-container');
    if (!container) return;

    // Show loading state if curriculum not ready
    if (!window.CURRICULUM || window.CURRICULUM.length === 0) {
      if (this.currentView !== 'home') {
        container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">טוען תכנית לימודים...</div>';
        return;
      }
    }

    switch (this.currentView) {
      case 'home':
        container.innerHTML = this.renderHomeView();
        break;
      case 'lessons':
        container.innerHTML = this.renderLessonsView();
        break;
      case 'lesson':
        this.renderLessonView(container, parseInt(this.currentParams || 1, 10));
        return;
      case 'progress':
        container.innerHTML = this.renderProgressView();
        break;
      case 'settings':
        container.innerHTML = this.renderSettingsView();
        this.bindSettingsEvents();
        break;
      default:
        container.innerHTML = this.renderHomeView();
    }
  }

  // --- Home View ---
  renderHomeView() {
    const stats = window.Progress ? window.Progress.getStats() : { completedCount: 0, percentage: 0, streakCount: 0, lastLessonId: 1 };
    const t = (k) => window.i18n ? window.i18n.t(k) : k;

    return `
      <div class="view-home">
        <!-- Hero Card -->
        <div class="card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.1)); border-color: rgba(99, 102, 241, 0.3);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
            <span class="badge badge-accent">PWA Ready ⚡</span>
            <span style="font-size: 0.85rem; color: var(--text-secondary);">🔥 ${stats.streakCount} ${t('dayStreak')}</span>
          </div>
          <h2 style="font-size: 1.4rem; font-weight: 700; margin-bottom: var(--space-xs);">${t('welcomeTitle')}</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: var(--space-lg);">${t('welcomeSubtitle')}</p>
          
          <a href="#lesson/${stats.lastLessonId}" class="btn btn-primary btn-full">
            ${stats.completedCount > 0 ? t('continueBtn') : t('startCurriculum')} →
          </a>
        </div>

        <!-- Progress Overview -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
            <span style="font-weight: 600; font-size: 0.95rem;">${t('overallProgress')}</span>
            <span style="font-weight: 700; color: var(--accent-primary);">${stats.percentage}%</span>
          </div>
          <div class="progress-container" style="margin-bottom: var(--space-md);">
            <div class="progress-fill" style="width: ${stats.percentage}%;"></div>
          </div>
          <div style="display: flex; justify-content: space-around; text-align: center; margin-top: var(--space-sm);">
            <div>
              <div style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary);">${stats.completedCount}/${stats.totalLessons}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${t('lessonsCompleted')}</div>
            </div>
            <div>
              <div style="font-size: 1.2rem; font-weight: 700; color: var(--accent-secondary);">${stats.streakCount}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${t('dayStreak')}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Lessons List View ---
  renderLessonsView() {
    const t = (k) => window.i18n ? window.i18n.t(k) : k;
    const curriculum = window.CURRICULUM || [];
    const isHe = window.i18n ? window.i18n.lang === 'he' : true;

    // Group lessons by chapter
    const chapters = curriculum.reduce((acc, lesson) => {
      const chapterId = lesson.chapter;
      if (!acc[chapterId]) {
        acc[chapterId] = {
          titleHe: lesson.chapterTitleHe,
          titleEn: lesson.chapterTitleEn,
          lessons: []
        };
      }
      acc[chapterId].lessons.push(lesson);
      return acc;
    }, {});

    // Sort chapters by ID
    const sortedChapters = Object.values(chapters).sort((a, b) => {
      const chapterIdA = a.lessons[0].chapter;
      const chapterIdB = b.lessons[0].chapter;
      return chapterIdA - chapterIdB;
    });

    const lastLessonId = window.Progress ? window.Progress.data.lastLessonId : 1;

    return `
      <div class="view-lessons">
        <h2 style="font-size: 1.3rem; margin-bottom: var(--space-lg);">${t('chaptersTitle')}</h2>
        
        <div class="chapters-list">
          ${sortedChapters.map(chapter => {
            const chapterTitle = isHe ? chapter.titleHe : chapter.titleEn;
            const isCurrentChapter = chapter.lessons.some(l => l.id === lastLessonId);
            const completedInChapter = chapter.lessons.filter(l => window.Progress && window.Progress.isCompleted(l.id)).length;
            return `
              <div class="card" style="margin-bottom: var(--space-md);">
                <details ${isCurrentChapter ? 'open' : ''}>
                  <summary style="font-weight: 700; font-size: 1.1rem; padding: var(--space-sm) 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                    <span>${chapterTitle}</span>
                    <span style="font-size: 0.8rem; font-weight: 500; color: var(--accent-primary);">${completedInChapter}/${chapter.lessons.length}</span>
                  </summary>
                  <div class="lessons-in-chapter" style="margin-top: var(--space-sm);">
                    ${chapter.lessons.map(lesson => {
                      const isCompleted = window.Progress ? window.Progress.isCompleted(lesson.id) : false;
                      const title = isHe ? lesson.titleHe : lesson.titleEn;
                      return `
                        <div class="card card-interactive" style="margin-bottom: var(--space-xs);" onclick="window.location.hash='#lesson/${lesson.id}'">
                          <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                              <div style="font-weight: 600; font-size: 1rem;">#${lesson.id} ${title}</div>
                            </div>
                            <div>
                              ${isCompleted ? `<span class="badge badge-success">✅ ${t('lessonCompleted')}</span>` : `<span class="badge badge-accent">⏳ ${t('lessonOpen')}</span>`}
                            </div>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </details>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // --- Lesson View ---
  renderLessonView(container, lessonId) {
    const curriculum = window.CURRICULUM || [];
    const lesson = curriculum.find(l => l.id === lessonId) || curriculum[0];
    if (!lesson) {
      container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);"><p>שיעור לא נמצא / Lesson not found</p><a href="#lessons" class="btn btn-secondary" style="margin-top: 1rem;">← חזרה לשיעורים</a></div>';
      return;
    }
    const isHe = window.i18n ? window.i18n.lang === 'he' : true;
    const t = (k) => window.i18n ? window.i18n.t(k) : k;

    const title = isHe ? lesson.titleHe : lesson.titleEn;
    const explanation = isHe ? lesson.explanationHe : lesson.explanationEn;
    const task = isHe ? lesson.taskHe : lesson.taskEn;
    const initialCode = window.Progress.getUserCode(lesson.id) || lesson.starterCode;

    container.innerHTML = `
      <div class="view-lesson">
        <!-- Lesson Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
          <a href="#lessons" style="color: var(--text-secondary); font-size: 0.9rem; display: flex; align-items: center; gap: 4px;">
            ← ${t('navLessons')}
          </a>
          <span style="font-weight: 700; font-size: 0.9rem; color: var(--accent-primary);">#${lesson.id} ${title}</span>
        </div>

        <!-- Explanation Card -->
        <div class="card" style="margin-bottom: var(--space-md);">
          <details open style="cursor: pointer;">
            <summary style="font-weight: 600; font-size: 1rem; color: var(--text-primary); margin-bottom: var(--space-xs);">
              ${t('explanationTab')}
            </summary>
            <div style="margin-top: var(--space-md); font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
              ${explanation}
            </div>
          </details>
        </div>

        <!-- Task Card -->
        <div class="card" style="border-inline-start: 4px solid var(--accent-primary); margin-bottom: var(--space-md);">
          <div style="font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">${t('taskTab')}</div>
          <div style="font-size: 0.9rem; color: var(--text-secondary);">${task}</div>
        </div>

        <!-- Code Editor Component Container -->
        <div class="card" style="padding: var(--space-xs); margin-bottom: var(--space-md);">
          <div id="verilog-editor-mount"></div>
        </div>

        <!-- Action Bar -->
        <div style="display: flex; gap: var(--space-sm); margin-bottom: var(--space-lg);">
          <button id="run-btn" class="btn btn-primary" style="flex: 3; padding: var(--space-md); font-size: 1.05rem;">${t('runBtn')}</button>
          <button id="hint-btn" class="btn btn-secondary" style="flex: 1;">${t('hintBtn')}</button>
        </div>
        <div id="hint-box" style="display:none; margin-bottom: var(--space-md);" class="card">
          <div style="font-weight: 600; color: var(--accent-secondary); margin-bottom: 4px;">${t('hintTitle')}</div>
          <div id="hint-text" style="font-size: 0.9rem; color: var(--text-secondary);"></div>
        </div>

        <!-- HDLBits Style Simulation Results Area -->
        <div class="card" id="output-container" style="display: none; padding: var(--space-md);">
          <!-- 1. ModelSim Console Terminal Box -->
          <div class="modelsim-console" id="modelsim-log"></div>

          <!-- 2. Status Banner -->
          <div id="status-banner" style="margin-bottom: var(--space-md);"></div>

          <!-- 3. Timing Diagrams (Yours, Ref, Mismatch) -->
          <div id="waveform-mount" style="margin-bottom: var(--space-md);"></div>

          <!-- 4. Circuit Diagram -->
          <div id="circuit-mount"></div>
        </div>
      </div>
    `;

    // Mount Code Editor
    if (window.VerilogEditor) {
      this.editorInstance = new window.VerilogEditor('verilog-editor-mount', {
        initialCode: initialCode,
        onChange: (code) => {
          window.Progress.saveUserCode(lesson.id, code);
        }
      });
    }

    // Mount Renderers
    const waveformRenderer = window.WaveformRenderer ? new window.WaveformRenderer('waveform-mount') : null;
    const circuitRenderer = window.CircuitRenderer ? new window.CircuitRenderer('circuit-mount') : null;

    // Handle Run / Submit Simulation
    const handleSimulate = async () => {
      const runBtn = document.getElementById('run-btn');
      if (runBtn) runBtn.disabled = true;

      const userCode = this.editorInstance ? this.editorInstance.getValue() : '';
      const outCard = document.getElementById('output-container');
      const logBox = document.getElementById('modelsim-log');
      const statusBanner = document.getElementById('status-banner');

      if (outCard) outCard.style.display = 'block';
      if (logBox) logBox.textContent = '# Compiling top_module.v with Icarus Verilog...\n# Running simulation...';
      if (statusBanner) statusBanner.innerHTML = '';

      // Clear previous timing diagram & schematic before run
      if (waveformRenderer) waveformRenderer.clear();
      if (circuitRenderer) circuitRenderer.clear();

      // Run Simulation with live progress tracking
      const result = await (window.Simulator ? window.Simulator.testSolution(userCode, lesson, (statusMsg) => {
        if (logBox) logBox.textContent = `# ${statusMsg}\n`;
      }) : { passed: false, log: 'Simulator not loaded' });

      if (runBtn) runBtn.disabled = false;

      // 1. Render ModelSim / Icarus Verilog Console Output
      if (logBox) logBox.textContent = result.log || '(no console output)';

      // 2. Render Engine Badge & HDLBits Status Banner
      const engineBadge = `
        <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; background: ${result.isWasm ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)'}; color: ${result.isWasm ? '#10b981' : '#f59e0b'}; margin-bottom: 12px; border: 1px solid ${result.isWasm ? '#10b981' : '#f59e0b'};">
          ${result.isWasm ? '⚡ מנוע: Icarus Verilog WebAssembly (WASM — 100% Client-Side)' : '⚠️ מנוע: Local JavaScript Evaluator (Fallback)'}
        </div>
      `;

      if (result.passed) {
        window.Progress.completeLesson(lesson.id);
        const nextLessonId = lesson.id + 1;
        const nextLesson = (window.CURRICULUM || []).find(l => l.id === nextLessonId);
        const nextTarget = nextLesson ? `#lesson/${nextLessonId}` : '#lessons';
        statusBanner.innerHTML = `
          <div style="margin-bottom: var(--space-md);">
            ${engineBadge}
            <h2 style="font-size: 1.5rem; font-weight: 800; color: #10b981; margin-bottom: 4px;">Status: Success! ✅</h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-md);">
              ${t('successMsg')}
            </p>
            <button onclick="window.location.hash='${nextTarget}'" class="btn btn-primary btn-sm">${nextLesson ? t('nextLessonBtn') : t('navLessons')}</button>
          </div>
        `;
      } else if (result.status === 'Compile Error') {
        statusBanner.innerHTML = `
          <div style="margin-bottom: var(--space-md);">
            ${engineBadge}
            <h2 style="font-size: 1.5rem; font-weight: 800; color: #ef4444; margin-bottom: 4px;">Status: Compile Error! ⚠️</h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              Please check the syntax errors reported in the compiler log above.
            </p>
          </div>
        `;
      } else {
        statusBanner.innerHTML = `
          <div style="margin-bottom: var(--space-md);">
            ${engineBadge}
            <h2 style="font-size: 1.5rem; font-weight: 800; color: #ef4444; margin-bottom: 4px;">Status: Incorrect! ❌</h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              Output has <strong>${result.mismatches !== undefined ? result.mismatches : 'some'}</strong> mismatches out of ${result.totalSamples || (lesson.expectedOutputs || []).length} samples. Check the timing diagram comparison below.
            </p>
          </div>
        `;
      }

      // 3. Render VCD Waveforms or HDLBits Timing Diagram
      if (waveformRenderer) {
        if (result.status !== 'Compile Error' && result.vcd) {
          waveformRenderer.render(result.vcd);
        } else if (result.status !== 'Compile Error' && result.comparisons && result.comparisons.length > 0) {
          waveformRenderer.render(result.comparisons);
        } else {
          waveformRenderer.clear();
        }
      }

      // 4. Render Dynamic Circuit Schematic Matching User Code
      if (circuitRenderer) {
        if (result.status !== 'Compile Error') {
          circuitRenderer.render(userCode);
        } else {
          circuitRenderer.clear(true);
        }
      }

      // Smooth scroll into output container
      outCard?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    document.getElementById('run-btn')?.addEventListener('click', handleSimulate);

    // Hint button toggle
    const hintBtn = document.getElementById('hint-btn');
    const hintBox = document.getElementById('hint-box');
    const hintText = document.getElementById('hint-text');
    if (hintBtn && hintBox && hintText) {
      hintBtn.addEventListener('click', () => {
        const isHeLang = window.i18n ? window.i18n.lang === 'he' : true;
        const hint = lesson.hints ? (isHeLang ? lesson.hints.he : lesson.hints.en) : null;
        hintText.textContent = hint || t('noHint');
        hintBox.style.display = hintBox.style.display === 'none' ? 'block' : 'none';
      });
    }
  }

  // --- Progress View ---
  renderProgressView() {
    const stats = window.Progress ? window.Progress.getStats() : { completedCount: 0, totalLessons: 0, percentage: 0, streakCount: 0 };
    const t = (k) => window.i18n ? window.i18n.t(k) : k;
    const curriculum = window.CURRICULUM || [];
    const isHe = window.i18n ? window.i18n.lang === 'he' : true;

    // Build per-chapter breakdown
    const chapters = {};
    curriculum.forEach(lesson => {
      const cid = lesson.chapter;
      if (!chapters[cid]) {
        chapters[cid] = {
          titleHe: lesson.chapterTitleHe || `פרק ${cid}`,
          titleEn: lesson.chapterTitleEn || `Chapter ${cid}`,
          total: 0,
          completed: 0
        };
      }
      chapters[cid].total++;
      if (window.Progress && window.Progress.isCompleted(lesson.id)) {
        chapters[cid].completed++;
      }
    });

    const chapterRows = Object.values(chapters).map(ch => {
      const title = isHe ? ch.titleHe : ch.titleEn;
      const pct = ch.total > 0 ? Math.round((ch.completed / ch.total) * 100) : 0;
      return `
        <div style="margin-bottom: var(--space-md);">
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 4px;">
            <span style="color: var(--text-secondary);">${title}</span>
            <span style="color: var(--accent-primary); font-weight: 600;">${ch.completed}/${ch.total}</span>
          </div>
          <div class="progress-container" style="height: 8px;">
            <div class="progress-fill" style="width: ${pct}%; height: 8px;"></div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="view-progress">
        <h2 style="font-size: 1.3rem; margin-bottom: var(--space-lg);">${t('navProgress')}</h2>
        
        <div class="card" style="text-align: center; padding: var(--space-xl); margin-bottom: var(--space-md);">
          <div style="font-size: 2.5rem; font-weight: 800; color: var(--accent-primary);">${stats.percentage}%</div>
          <div style="color: var(--text-secondary); margin-bottom: var(--space-lg);">${t('overallProgress')}</div>
          
          <div style="display: flex; justify-content: space-around;">
            <div>
              <div style="font-size: 1.3rem; font-weight: 700;">${stats.completedCount}/${stats.totalLessons}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${t('lessonsCompleted')}</div>
            </div>
            <div>
              <div style="font-size: 1.3rem; font-weight: 700; color: var(--color-warning);">🔥 ${stats.streakCount}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${t('dayStreak')}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div style="font-weight: 600; margin-bottom: var(--space-md);">${t('chapterProgress')}</div>
          ${chapterRows || `<p style="color: var(--text-muted); font-size: 0.9rem;">טוען נתונים...</p>`}
        </div>
      </div>
    `;
  }

  // --- Settings View ---
  renderSettingsView() {
    const t = (k) => window.i18n ? window.i18n.t(k) : k;
    const isHe = window.i18n ? window.i18n.lang === 'he' : true;

    return `
      <div class="view-settings">
        <h2 style="font-size: 1.3rem; margin-bottom: var(--space-lg);">${t('settingsTitle')}</h2>
        
        <div class="card">
          <div style="font-weight: 600; margin-bottom: var(--space-md);">${t('languageSetting')}</div>
          <div style="display: flex; gap: var(--space-md);">
            <button id="set-he-btn" class="btn ${isHe ? 'btn-primary' : 'btn-secondary'}" style="flex: 1;">🇮🇱 עברית</button>
            <button id="set-en-btn" class="btn ${!isHe ? 'btn-primary' : 'btn-secondary'}" style="flex: 1;">EN English</button>
          </div>
        </div>

        <div class="card">
          <div style="font-weight: 600; margin-bottom: var(--space-md);">${t('resetProgressSetting')}</div>
          <button id="reset-progress-btn" class="btn btn-secondary" style="color: var(--color-error); border-color: rgba(239, 68, 68, 0.3); width: 100%;">
            ${t('resetProgressBtn')}
          </button>
        </div>
      </div>
    `;
  }

  bindSettingsEvents() {
    document.getElementById('set-he-btn')?.addEventListener('click', () => {
      if (window.i18n) window.i18n.setLanguage('he');
    });
    document.getElementById('set-en-btn')?.addEventListener('click', () => {
      if (window.i18n) window.i18n.setLanguage('en');
    });
    document.getElementById('reset-progress-btn')?.addEventListener('click', () => {
      const t = (k) => window.i18n ? window.i18n.t(k) : k;
      if (confirm(t('confirmReset'))) {
        if (window.Progress) window.Progress.reset();
        this.renderCurrentView();
      }
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppRouter();
  window.app.init();
});
