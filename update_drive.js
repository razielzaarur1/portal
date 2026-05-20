const fs = require('fs');
const file = 'drive.html';
let content = fs.readFileSync(file, 'utf8');

const startIdx = content.indexOf('        function App() {');
const endIdx = content.indexOf('        const root = ReactDOM.createRoot(document.getElementById(\\'root\\'));');

if (startIdx !== -1 && endIdx !== -1) {
  const newApp = `
        function App() {
          const tz = localStorage.getItem('student_tz') || '';
          const isAdmin = tz === '322368564';
          
          const [files, setFiles] = useState([]);
          const [loading, setLoading] = useState(false);
          const [error, setError] = useState('');
          const [currentPath, setCurrentPath] = useState(''); 
          const [pathHistory, setPathHistory] = useState([]); 
          const [viewingFile, setViewingFile] = useState(null); 

          const [previewLoading, setPreviewLoading] = useState(false);
          const [blobUrl, setBlobUrl] = useState(null);
          
          // Admin specific state
          const [editMode, setEditMode] = useState(false);
          const [allUsers, setAllUsers] = useState([]);
          const [permModal, setPermModal] = useState({ open: false, item: null, visibility: 'inherit', users: [] });

          // Fetch users on load if admin
          useEffect(() => {
            if (isAdmin) {
              fetch('/api/users').then(r => r.json()).then(setAllUsers).catch(console.error);
            }
          }, [isAdmin]);

          const fetchLocalFiles = useCallback(async (pathToFetch = "/") => {
            setLoading(true);
            setError('');

            try {
              const response = await fetch(\`/api/drive/list?path=\${encodeURIComponent(pathToFetch)}&tz=\${tz}&editMode=\${editMode}\`);
              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || 'שגיאה בטעינת קבצים מהשרת המקומי');
              }

              setFiles(data.files || []);
              setCurrentPath(pathToFetch === "/" ? "" : pathToFetch);
            } catch (err) {
              setError(err.message);
              // if access denied, clear files
              if (err.message.includes('Access denied')) {
                 setFiles([]);
              }
            } finally {
              setLoading(false);
            }
          }, [tz, editMode]);

          useEffect(() => {
            fetchLocalFiles(currentPath || "/");
          }, [fetchLocalFiles]);

          const handleFolderClick = (folderData) => {
            setPathHistory([...pathHistory, currentPath]);
            const newPath = currentPath === "" 
                ? \`/\${folderData.name}\` 
                : \`\${currentPath}/\${folderData.name}\`;
            fetchLocalFiles(newPath);
          };

          const handleBackClick = () => {
            const previousPath = pathHistory[pathHistory.length - 1];
            const newHistory = pathHistory.slice(0, -1);
            setPathHistory(newHistory);
            fetchLocalFiles(previousPath || "/");
          };

          const getFileIcon = (filename) => {
            const ext = filename.split('.').pop().toLowerCase();
            if (['jpg', 'png', 'gif', 'jpeg'].includes(ext)) return <ImageIcon className="text-purple-500" size={24} />;
            if (['pdf'].includes(ext)) return <FileText className="text-red-500" size={24} />;
            return <File className="text-slate-400" size={24} />;
          };

          const getDownloadUrl = (file) => {
            const basePath = currentPath === "" ? "" : currentPath;
            return \`/studies\${basePath}/\${file.name}\`;
          };

          const getRawFileUrl = (file) => {
            return getDownloadUrl(file);
          };

          useEffect(() => {
            let currentBlobUrl = null;

            const loadFileIntoMemory = async () => {
              if (!viewingFile) return;
              
              const ext = viewingFile.name.split('.').pop().toLowerCase();
              
              if (ext === 'pdf') {
                setPreviewLoading(true);
                try {
                  const response = await fetch(getDownloadUrl(viewingFile));
                  if (!response.ok) throw new Error('שגיאה בטעינת הקובץ מהשרת');
                  
                  const blob = await response.blob();
                  const pdfBlob = new Blob([blob], { type: 'application/pdf' });
                  currentBlobUrl = URL.createObjectURL(pdfBlob); 
                  
                  setBlobUrl(currentBlobUrl);
                } catch (err) {
                  console.error("שגיאה בטעינת הקובץ:", err);
                } finally {
                  setPreviewLoading(false);
                }
              } else {
                setBlobUrl(null);
              }
            };

            loadFileIntoMemory();

            return () => {
              if (currentBlobUrl) {
                URL.revokeObjectURL(currentBlobUrl);
              }
            };
          }, [viewingFile, currentPath]);

          const handleCloseFile = () => {
            if (blobUrl) {
              URL.revokeObjectURL(blobUrl); 
            }
            setViewingFile(null);
            setBlobUrl(null);
            setPreviewLoading(false);
          };

          const openPermModal = (e, item) => {
            e.stopPropagation();
            setPermModal({
               open: true,
               item: item,
               visibility: item.permission ? item.permission.visibility : 'inherit',
               users: item.permission ? item.permission.users : []
            });
          };

          const savePermissions = async () => {
             try {
                await fetch('/api/drive/permissions', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({
                      path: permModal.item.path,
                      visibility: permModal.visibility,
                      users: permModal.users
                   })
                });
                setPermModal({ open: false, item: null, visibility: 'inherit', users: [] });
                fetchLocalFiles(currentPath || "/");
             } catch(e) {
                alert("שגיאה בשמירת הרשאות");
             }
          };

          const toggleUserSelection = (userId) => {
             const newUsers = permModal.users.includes(userId) 
                ? permModal.users.filter(id => id !== userId)
                : [...permModal.users, userId];
             setPermModal({ ...permModal, users: newUsers });
          };

          return (
            <div className="min-h-screen flex flex-col bg-slate-50 relative">
              
              {/* סרגל ניווט עליון */}
              <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                  <div className="flex items-center">
                    <a href="index.html" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 p-2 md:px-4 rounded-lg transition-colors flex items-center gap-2 font-medium" title="חזרה לעמוד הראשי">
                      <Home size={22} />
                      <span className="hidden sm:inline">עמוד הבית</span>
                    </a>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-medium text-slate-600">מצב עריכת הרשאות</span>
                       <button 
                          onClick={() => setEditMode(!editMode)}
                          className={\`w-12 h-6 rounded-full transition-colors relative \${editMode ? 'bg-blue-500' : 'bg-slate-300'}\`}
                       >
                          <div className={\`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform \${editMode ? 'left-1' : 'right-1'}\`}></div>
                       </button>
                    </div>
                  )}
                </div>
              </header>

              <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto mt-4">
                <div className="space-y-6">
                  
                  {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start gap-3 shadow-sm">
                      <AlertCircle size={20} className="mt-0.5 shrink-0" />
                      <div className="text-sm font-medium">{error}</div>
                    </div>
                  )}

                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-100 border-b border-slate-200 p-4 flex items-center justify-between flex-wrap gap-4">
                       <div className="flex items-center gap-3">
                          {pathHistory.length > 0 && (
                            <button 
                              onClick={handleBackClick}
                              className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-600 flex items-center gap-1 text-sm font-medium"
                            >
                              <ChevronRight size={18} />
                              חזור
                            </button>
                          )}
                          <div className="font-semibold text-slate-700 flex items-center gap-2 text-lg">
                            <Folder size={20} className="text-blue-500" />
                            תיקיית לימודים רזיאל
                            {currentPath && <span className="text-slate-400 font-normal truncate" dir="ltr">{currentPath}</span>}
                          </div>
                       </div>
                    </div>

                    <div className="divide-y divide-slate-100 min-h-[300px]">
                      {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                          <Loader2 size={40} className="animate-spin mb-4 text-blue-500" />
                          <p>טוען קבצים...</p>
                        </div>
                      ) : files.length === 0 && !error ? (
                        <div className="flex items-center justify-center h-64 text-slate-400">
                          <p>התיקייה ריקה או שאין לך הרשאה מתאימה.</p>
                        </div>
                      ) : (
                        <ul className="max-h-[600px] overflow-y-auto">
                          {files.map((item) => (
                            <li key={item.name} className="group hover:bg-blue-50 transition-colors flex items-center justify-between">
                              {item.isDirectory ? (
                                <button 
                                  onClick={() => handleFolderClick(item)}
                                  className="flex-1 flex items-center p-4 text-right cursor-pointer focus:outline-none focus:bg-blue-50"
                                >
                                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600 ml-4">
                                    <Folder size={24} />
                                  </div>
                                  <span className="font-medium text-slate-700 flex-1 flex items-center gap-2">
                                    {item.name}
                                    {isAdmin && editMode && item.permission && item.permission.visibility !== 'inherit' && (
                                       <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-normal">
                                         מותאם
                                       </span>
                                    )}
                                  </span>
                                  <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors rotate-180 ml-4" />
                                </button>
                              ) : (
                                <div className="flex-1 flex items-center p-4 text-right hover:bg-slate-50 transition-colors">
                                  <div className="bg-slate-100 p-2 rounded-lg ml-4 shrink-0">
                                    {getFileIcon(item.name)}
                                  </div>
                                  
                                  <div 
                                    className="flex-1 cursor-pointer flex items-center gap-2" 
                                    onClick={() => setViewingFile(item)}
                                  >
                                    <span className="font-medium text-slate-700 block hover:text-blue-600 transition-colors">
                                      {item.name}
                                    </span>
                                    {isAdmin && editMode && item.permission && item.permission.visibility !== 'inherit' && (
                                       <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-normal">
                                         מותאם
                                       </span>
                                    )}
                                    <span className="text-xs text-slate-400 block w-full mt-1">
                                      {(item.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 shrink-0 ml-4">
                                    <button
                                      onClick={() => setViewingFile(item)}
                                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                      title="הצג קובץ באתר"
                                    >
                                      <Eye size={20} />
                                    </button>

                                    <a 
                                      href={getDownloadUrl(item)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                      title="הורד קובץ"
                                    >
                                      <Download size={20} />
                                    </a>
                                  </div>
                                </div>
                              )}
                              
                              {isAdmin && editMode && (
                                <button 
                                  onClick={(e) => openPermModal(e, item)}
                                  className="ml-4 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors shrink-0"
                                  title="ניהול הרשאות"
                                >
                                  <AlertCircle size={20} /> {/* Can use a gear icon here, AlertCircle is available */}
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </main>

              {/* Modal for viewing files */}
              {viewingFile && (
                <div className="fixed inset-0 bg-slate-900/80 z-50 flex flex-col p-2 md:p-8 animate-in fade-in duration-200">
                  <div className="bg-white rounded-t-xl p-4 flex justify-between items-center shadow-sm max-w-6xl w-full mx-auto">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="shrink-0">{getFileIcon(viewingFile.name)}</div>
                      <h3 className="font-bold text-slate-800 text-lg truncate" dir="auto">
                        {viewingFile.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a 
                        href={getDownloadUrl(viewingFile)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors font-medium"
                      >
                        <Download size={16} />
                        <span className="hidden sm:inline">הורדה</span>
                      </a>
                      <button 
                        onClick={handleCloseFile}
                        className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-slate-200 rounded-b-xl overflow-hidden relative max-w-6xl w-full mx-auto border-t border-slate-200 shadow-xl flex items-center justify-center">
                    {(() => {
                      const ext = viewingFile.name.split('.').pop().toLowerCase();
                      const isImage = ['jpg', 'png', 'gif', 'jpeg', 'webp'].includes(ext);
                      const isPdf = ext === 'pdf';
                      const rawUrl = getRawFileUrl(viewingFile);

                      if (isImage) {
                        return (
                          <div className="w-full h-full p-4 flex items-center justify-center bg-slate-800">
                            <img src={rawUrl} alt={viewingFile.name} className="max-w-full max-h-full object-contain shadow-md" />
                          </div>
                        );
                      } else if (isPdf) {
                        if (previewLoading) {
                          return (
                            <div className="flex flex-col items-center justify-center text-slate-500 p-8 text-center w-full h-full bg-slate-50">
                              <Loader2 size={48} className="animate-spin mb-4 text-blue-500" />
                              <p className="text-xl font-bold text-slate-700 mb-2">טוען את המסמך...</p>
                            </div>
                          );
                        }
                        
                        if (blobUrl) {
                          return (
                            <div className="relative w-full h-full bg-slate-200">
                              <iframe 
                                src={blobUrl} 
                                className="absolute inset-0 w-full h-full border-none bg-white z-0"
                                title="מציג PDF"
                              />
                            </div>
                          );
                        }
                        
                        return (
                          <div className="flex flex-col items-center justify-center text-slate-500 p-8 text-center w-full h-full bg-slate-50">
                            <AlertCircle size={48} className="mb-4 text-red-400" />
                            <p className="text-xl font-bold text-slate-700 mb-2">שגיאה בטעינת הקובץ</p>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex flex-col items-center justify-center text-slate-500 p-8 text-center w-full h-full bg-slate-50">
                            <File size={64} className="mb-4 text-slate-300" />
                            <p className="text-xl font-bold text-slate-700 mb-2">אין תצוגה מקדימה לקובץ זה</p>
                            <a 
                              href={getDownloadUrl(viewingFile)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all shadow-sm font-medium flex items-center gap-2"
                            >
                              <Download size={20} />
                              הורדה
                            </a>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* Permissions Modal */}
              {permModal.open && (
                 <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">
                       <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold text-slate-800">הגדרות הרשאה</h2>
                          <button onClick={() => setPermModal({...permModal, open: false})} className="p-1 text-slate-400 hover:text-slate-600">
                             <X size={20} />
                          </button>
                       </div>
                       
                       <p className="text-sm text-slate-500 mb-4 truncate" dir="ltr">{permModal.item.path}</p>
                       
                       <div className="space-y-3 mb-6">
                          <label className="flex items-center gap-3 cursor-pointer">
                             <input type="radio" name="visibility" value="inherit" 
                                checked={permModal.visibility === 'inherit'} 
                                onChange={(e) => setPermModal({...permModal, visibility: e.target.value, users: []})} 
                                className="w-4 h-4 text-blue-600"
                             />
                             <span className="text-slate-700 font-medium">ברירת מחדל (ירושה מהתיקייה)</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                             <input type="radio" name="visibility" value="everyone" 
                                checked={permModal.visibility === 'everyone'} 
                                onChange={(e) => setPermModal({...permModal, visibility: e.target.value, users: []})} 
                                className="w-4 h-4 text-blue-600"
                             />
                             <span className="text-slate-700 font-medium">כולם (פומבי)</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                             <input type="radio" name="visibility" value="none" 
                                checked={permModal.visibility === 'none'} 
                                onChange={(e) => setPermModal({...permModal, visibility: e.target.value, users: []})} 
                                className="w-4 h-4 text-blue-600"
                             />
                             <span className="text-slate-700 font-medium">אף אחד (נסתר לחלוטין)</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                             <input type="radio" name="visibility" value="except" 
                                checked={permModal.visibility === 'except'} 
                                onChange={(e) => setPermModal({...permModal, visibility: e.target.value})} 
                                className="w-4 h-4 text-blue-600"
                             />
                             <span className="text-slate-700 font-medium">כולם חוץ מ...</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                             <input type="radio" name="visibility" value="only" 
                                checked={permModal.visibility === 'only'} 
                                onChange={(e) => setPermModal({...permModal, visibility: e.target.value})} 
                                className="w-4 h-4 text-blue-600"
                             />
                             <span className="text-slate-700 font-medium">אף אחד, פרט ל... (רק ל...)</span>
                          </label>
                       </div>

                       {(permModal.visibility === 'except' || permModal.visibility === 'only') && (
                          <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg p-3 mb-4 space-y-2">
                             {allUsers.length === 0 ? <p className="text-sm text-slate-400 text-center py-4">אין משתמשים במערכת</p> : 
                              allUsers.map(u => (
                                <label key={u.tz} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md cursor-pointer">
                                   <input type="checkbox" 
                                      checked={permModal.users.includes(u.tz)}
                                      onChange={() => toggleUserSelection(u.tz)}
                                      className="w-4 h-4 rounded text-blue-600"
                                   />
                                   <div>
                                      <span className="block text-sm font-medium text-slate-700">{u.name || 'ללא שם'}</span>
                                      <span className="block text-xs text-slate-400">{u.tz}</span>
                                   </div>
                                </label>
                              ))
                             }
                          </div>
                       )}

                       <div className="mt-auto pt-4 border-t border-slate-100 flex gap-3">
                          <button onClick={savePermissions} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors">
                             שמור הגדרות
                          </button>
                       </div>
                    </div>
                 </div>
              )}

            </div>
          );
        }
`;
  
  content = content.substring(0, startIdx) + newApp + content.substring(endIdx);
  fs.writeFileSync(file, content);
  console.log('Successfully updated drive.html');
} else {
  console.log('Could not find boundaries');
}
