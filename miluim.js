// miluim.js is an alias for recordings.js
const recordings = require('./recordings.js');

module.exports = {
    ...recordings,
    resolveMiluimFolder: recordings.resolveRecordingsFolder,
    getMiluimLessons: recordings.getRecordingsLessons,
    initMiluimRoutes: recordings.initRecordingsRoutes
};
