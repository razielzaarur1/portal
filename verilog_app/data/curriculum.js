/* ==========================================================================
   VeriLearn Curriculum Loader & Registry (100-Lesson Master Curriculum)
   Synchronously loads data/chapters/chapter1.js ... chapter14.js
   ========================================================================== */

window.CURRICULUM = window.CURRICULUM || [];

window.registerChapter = function(lessonsArray) {
  if (Array.isArray(lessonsArray)) {
    lessonsArray.forEach(lesson => {
      if (!window.CURRICULUM.some(existing => existing.id === lesson.id)) {
        window.CURRICULUM.push(lesson);
      }
    });
    window.CURRICULUM.sort((a, b) => a.id - b.id);
  }
};

// Synchronously load all 14 chapter files in data/chapters/
(function() {
  const chapters = [
    'chapter1.js',
    'chapter2.js',
    'chapter3.js',
    'chapter4.js',
    'chapter5.js',
    'chapter6.js',
    'chapter7.js',
    'chapter8.js',
    'chapter9.js',
    'chapter10.js',
    'chapter11.js',
    'chapter12.js',
    'chapter13.js',
    'chapter14.js'
  ];

  chapters.forEach(file => {
    document.write('<script src="data/chapters/' + file + '"><\/script>');
  });
})();
