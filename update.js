const fs = require('fs');
const file = 'drive.html';
let content = fs.readFileSync(file, 'utf8');

const startIdx = content.indexOf('// הטמעת הטוקן שביקשת');
const endIdx = content.indexOf('const root = ReactDOM.createRoot(document.getElementById(\\'root\\'));');

if (startIdx !== -1 && endIdx !== -1) {
  const newApp = `
        function App() {
          const [files, setFiles] = useState([]);
          const [loading, setLoading] = useState(false);
          const [error, setError] = useState('');
          const [currentPath, setCurrentPath] = useState(''); 
          const [pathHistory, setPathHistory] = useState([]); 
          const [viewingFile, setViewingFile] = useState(null); 

          const [previewLoading, setPreviewLoading] = useState(false);
          const [blobUrl, setBlobUrl] = useState(null);

          const fetchLocalFiles = useCallback(async (pathToFetch = "/") => {
            setLoading(true);
            setError('');

            try {
              const response = await fetch(\`/api/drive/list?path=\${encodeURIComponent(pathToFetch)}\`);
              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || 'שגיאה בטעינת קבצים מהשרת המקומי');
              }

              setFiles(data.files || []);
              setCurrentPath(pathToFetch === "/" ? "" : pathToFetch);
            } catch (err) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
          }, []);

          useEffect(() => {
            fetchLocalFiles("/");
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

          return (
            <div className="min-h-screen flex flex-col bg-slate-50">
              
              {/* סרגל ניווט עליון */}
              <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                  <div className="flex items-center">
                    <a href="index.html" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 p-2 md:px-4 rounded-lg transition-colors flex items-center gap-2 font-medium" title="חזרה לעמוד הראשי">
                      <Home size={22} />
                      <span className="hidden sm:inline">עמוד הבית</span>
                    </a>
                  </div>
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
                          <p>התיקייה ריקה.</p>
                        </div>
                      ) : (
                        <ul className="max-h-[600px] overflow-y-auto">
                          {files.map((item) => (
                            <li key={item.name} className="group hover:bg-blue-50 transition-colors">
                              {item.isDirectory ? (
                                <button 
                                  onClick={() => handleFolderClick(item)}
                                  className="w-full flex items-center p-4 text-right cursor-pointer focus:outline-none focus:bg-blue-50"
                                >
                                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600 ml-4">
                                    <Folder size={24} />
                                  </div>
                                  <span className="font-medium text-slate-700 flex-1">{item.name}</span>
                                  <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors rotate-180" />
                                </button>
                              ) : (
                                <div className="w-full flex items-center p-4 text-right hover:bg-slate-50 transition-colors">
                                  <div className="bg-slate-100 p-2 rounded-lg ml-4 shrink-0">
                                    {getFileIcon(item.name)}
                                  </div>
                                  
                                  <div 
                                    className="flex-1 cursor-pointer" 
                                    onClick={() => setViewingFile(item)}
                                  >
                                    <span className="font-medium text-slate-700 block hover:text-blue-600 transition-colors">{item.name}</span>
                                    <span className="text-xs text-slate-400">
                                      {(item.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 shrink-0">
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
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </main>

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
                              <p className="text-slate-500 max-w-md">
                                הקובץ נטען ישירות לדפדפן שלך כדי לאפשר תצוגה חלקה. <br/>קבצים גדולים עשויים לקחת מספר שניות.
                              </p>
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
                              <div className="absolute bottom-6 left-6 z-10">
                                <div className="bg-slate-900/70 hover:bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-2xl shadow-2xl border border-slate-700/50 flex items-center gap-3 transition-all opacity-80 hover:opacity-100">
                                  <span className="text-sm font-medium px-2 hidden sm:block opacity-90">
                                    התצוגה ריקה?
                                  </span>
                                  <button 
                                    onClick={() => window.open(blobUrl, '_blank')}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
                                  >
                                    פתיחה בחלון נפרד
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <div className="flex flex-col items-center justify-center text-slate-500 p-8 text-center w-full h-full bg-slate-50">
                            <AlertCircle size={48} className="mb-4 text-red-400" />
                            <p className="text-xl font-bold text-slate-700 mb-2">שגיאה בטעינת הקובץ</p>
                            <a href={getDownloadUrl(viewingFile)} target="_blank" rel="noopener noreferrer" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg">
                              פתח קובץ מקומית במקום זאת
                            </a>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex flex-col items-center justify-center text-slate-500 p-8 text-center w-full h-full bg-slate-50">
                            <File size={64} className="mb-4 text-slate-300" />
                            <p className="text-xl font-bold text-slate-700 mb-2">אין תצוגה מקדימה לקובץ זה</p>
                            <p className="text-slate-500 mb-6 max-w-md">
                              הדפדפן אינו תומך בהצגת קבצי <strong>{ext.toUpperCase()}</strong> ישירות באתר. יש לפתוח או להוריד את הקובץ.
                            </p>
                            <a 
                              href={getDownloadUrl(viewingFile)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all shadow-sm font-medium flex items-center gap-2"
                            >
                              <Download size={20} />
                              פתיחה / הורדה של הקובץ
                            </a>
                          </div>
                        );
                      }
                    })()}
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
