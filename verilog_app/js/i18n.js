/* ==========================================================================
   VeriLearn Internationalization (i18n) System
   Supports: Hebrew (RTL) & English (LTR)
   ========================================================================== */

const translations = {
  he: {
    // Navigation
    navHome: "בית",
    navLessons: "שיעורים",
    navProgress: "התקדמות",
    navSettings: "הגדרות",

    // Home View
    welcomeTitle: "למוד Verilog בכל מקום",
    welcomeSubtitle: "התרגול האינטראקטיבי המלא מותאם במיוחד לטלפון",
    continueBtn: "המשך מאיפה שעצרתי",
    startCurriculum: "התחל בלמידה",
    overallProgress: "התקדמות כללית",
    chaptersTitle: "פרקי הלימוד",
    lessonsCompleted: "שיעורים הושלמו",
    dayStreak: "ימי רצף",
    totalTime: "זמן תרגול",

    // Lesson View
    explanationTab: "📖 הסבר",
    taskTab: "🎯 המשימה",
    codeTab: "💻 עורך קוד",
    waveformTab: "📊 גלים (Waveform)",
    circuitTab: "🔌 מעגל (Circuit)",
    consoleTab: "🖥️ פלט (Console)",
    
    runBtn: "▶ הרץ ובדוק פתרון",
    hintBtn: "💡 רמז",
    resetCodeBtn: "איפוס קוד",
    clearCodeBtn: "ניקוי",

    // Feedback
    successTitle: "Status: Success!",
    successMsg: "עברת את התרגיל בהצלחה. מוכן לשלב הבא?",
    nextLessonBtn: "לשיעור הבא ←",
    errorTitle: "Status: Incorrect!",
    errorMsg: "הפלט שהתקבל אינו תואם לפלט הצפוי. בדוק את טבלת השגיאות.",

    // Settings
    settingsTitle: "הגדרות",
    languageSetting: "שפת ממשק והסברים",
    themeSetting: "ערכת נושא",
    darkTheme: "כהה (Dark)",
    lightTheme: "בהיר (Light)",
    resetProgressSetting: "איפוס התקדמות",
    resetProgressBtn: "אפס את כל הנתונים",
    confirmReset: "האם אתה בטוח שברצונך לאפס את כל ההתקדמות?",

    // General
    loading: "מריץ סימולציה...",
    chapter: "פרק",
    lesson: "שיעור",
    lessonCompleted: "הושלם",
    lessonOpen: "פתוח",
    hintBtn: "💡 רמז",
    hintTitle: "רמז",
    noHint: "אין רמז זמין",
    chapterProgress: "התקדמות לפי פרקים"
  },

  en: {
    // Navigation
    navHome: "Home",
    navLessons: "Lessons",
    navProgress: "Progress",
    navSettings: "Settings",

    // Home View
    welcomeTitle: "Learn Verilog Anywhere",
    welcomeSubtitle: "Interactive HDL design drills optimized for mobile",
    continueBtn: "Continue Learning",
    startCurriculum: "Start Learning",
    overallProgress: "Overall Progress",
    chaptersTitle: "Curriculum Chapters",
    lessonsCompleted: "Lessons Completed",
    dayStreak: "Day Streak",
    totalTime: "Practice Time",

    // Lesson View
    explanationTab: "📖 Learn",
    taskTab: "🎯 Task",
    codeTab: "💻 Editor",
    waveformTab: "📊 Waveform",
    circuitTab: "🔌 Circuit",
    consoleTab: "🖥️ Console",
    
    runBtn: "▶ Run & Submit",
    hintBtn: "💡 Hint",
    resetCodeBtn: "Reset Code",
    clearCodeBtn: "Clear",

    // Feedback
    successTitle: "Status: Success!",
    successMsg: "You passed this exercise successfully. Ready for the next one?",
    nextLessonBtn: "Next Lesson →",
    errorTitle: "Status: Incorrect!",
    errorMsg: "Output does not match expected reference. Check timing diagram.",

    // Settings
    settingsTitle: "Settings",
    languageSetting: "Interface & Explanation Language",
    themeSetting: "Theme",
    darkTheme: "Dark",
    lightTheme: "Light",
    resetProgressSetting: "Reset Progress",
    resetProgressBtn: "Reset All Data",
    confirmReset: "Are you sure you want to reset all your progress?",

    // General
    loading: "Running simulation...",
    chapter: "Chapter",
    lesson: "Lesson",
    lessonCompleted: "Completed",
    lessonOpen: "Open",
    hintBtn: "💡 Hint",
    hintTitle: "Hint",
    noHint: "No hint available",
    chapterProgress: "Chapter Progress"
  }
};

class I18nManager {
  constructor() {
    this.lang = localStorage.getItem('verilearn_lang') || 'he';
  }

  init() {
    this.setLanguage(this.lang);
    
    // Bind toggle button
    const toggleBtn = document.getElementById('lang-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const newLang = this.lang === 'he' ? 'en' : 'he';
        this.setLanguage(newLang);
      });
    }
  }

  setLanguage(lang) {
    if (!translations[lang]) return;
    this.lang = lang;
    localStorage.setItem('verilearn_lang', lang);

    // Update HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';

    // Update language flag/badge to EN
    const flagEl = document.getElementById('lang-flag');
    if (flagEl) {
      flagEl.textContent = lang === 'he' ? 'HE' : 'EN';
    }

    // Update all elements with data-i18n
    this.updateDOM();

    // Dispatch event for components to react
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
  }

  t(key) {
    return translations[this.lang]?.[key] || translations['he']?.[key] || key;
  }

  updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    });
  }
}

window.i18n = new I18nManager();
