const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'drive.html');
let code = fs.readFileSync(file, 'utf8');

// 1. Fix Header: Extract Chat Button and Remove Toggle
// Regex to target the specific block in the header
const headerRegex = /\{isAdmin && \([\s\S]*?\{isAdminMode \? \([\s\S]*?<\/span>\s*\)\s*:\s*\([\s\S]*?<div className="flex items-center gap-2">[\s\S]*?<\/div>\s*\)\}\s*<\/div>\s*\)\}/;

const newHeaderCode = `
                  <div className="flex items-center gap-4">
                    {/* Chat / Proposals Header Button for Students */}
                    {!isAdminMode && (
                      <button 
                        onClick={() => setChatModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium mr-4"
                      >
                        <i className="fas fa-comment-dots"></i> הצעות / הערות
                      </button>
                    )}

                    {isAdmin && (
                      <div className="flex items-center gap-4">
                        <button onClick={triggerCacheRefresh} className="text-sm bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                            רענן מפת תיקיות
                        </button>
                        {isAdminMode && (
                           <span className="text-sm bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1">
                             🛡️ מצב ניהול פעיל
                           </span>
                        )}
                      </div>
                    )}
                  </div>
`;

// It's safer to just replace the whole right side of the header.
// Looking at lines 436-473... Let's just use string replace.
code = code.replace(/{isAdmin && \(\s*<div className="flex items-center gap-4">[\s\S]*?<\/div>\s*\)\}/, newHeaderCode.trim());


// 2. Add Status Polling to handleProposeUpload
const stateRegex = /const \[proposalComments, setProposalComments\] = useState\(''\);/;
code = code.replace(stateRegex, "const [proposalComments, setProposalComments] = useState('');\n          const [uploadStatus, setUploadStatus] = useState(null); // 'uploading', 'scanning', 'pending', 'approved', 'rejected', 'virus'");

const oldUploadHandler = /const handleProposeUpload = async \(\) => \{[\s\S]*?setLoading\(false\);\s*\n\s*\};\s*\n/;
const newUploadHandler = `const handleProposeUpload = async () => {
             if (proposalFiles.length === 0) return alert('נא לבחור לפחות קובץ אחד');
             if (proposalFiles.length > 20) return alert('ניתן לבחור עד 20 קבצים');
             
             const formData = new FormData();
             formData.append('tz', tz);
             formData.append('proposed_path', currentPath);
             formData.append('comments', proposalComments);
             Array.from(proposalFiles).forEach(file => {
                 formData.append('files', file);
             });
             
             try {
                 setLoading(true);
                 setUploadStatus('uploading');
                 
                 const res = await fetch('/api/drive/propose-file', {
                     method: 'POST',
                     body: formData
                 });
                 const data = await res.json();
                 
                 if (!res.ok) throw new Error(data.message || 'שגיאה בהעלאה');
                 
                 // Start polling status
                 pollProposalStatus(data.proposalId);
             } catch (e) {
                 alert(e.message);
                 setLoading(false);
                 setUploadStatus(null);
             }
          };

          const pollProposalStatus = async (proposalId) => {
              setUploadStatus('scanning');
              
              const interval = setInterval(async () => {
                  try {
                      const res = await fetch(\`/api/proposals/\${proposalId}/status\`);
                      const data = await res.json();
                      if (data.status) {
                          setUploadStatus(data.status);
                          if (['approved', 'rejected', 'virus', 'error'].includes(data.status)) {
                              clearInterval(interval);
                              setTimeout(() => {
                                  setProposeModalOpen(false);
                                  setProposalFiles([]);
                                  setProposalComments('');
                                  setUploadStatus(null);
                                  setLoading(false);
                              }, 3000); // close after 3 seconds showing final status
                          }
                      }
                  } catch (e) {
                      // ignore network errors during poll
                  }
              }, 2000);
          };
`;
code = code.replace(oldUploadHandler, newUploadHandler);


// 3. Update the Proposal Modal UI to show status
const oldModalUI = /<button onClick=\{handleProposeUpload\}.*?<\/button>/;
const newModalUI = `
                       {uploadStatus ? (
                           <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2">
                               <div className="font-bold text-center mb-2">סטטוס העלאה:</div>
                               <div className="flex flex-col gap-2 text-sm">
                                   <div className={\`flex items-center gap-2 \${uploadStatus === 'uploading' ? 'text-blue-600 font-bold' : 'text-slate-400'}\`}>
                                       <i className={\`fas fa-cloud-upload-alt \${uploadStatus === 'uploading' ? 'animate-bounce' : ''}\`}></i> 1. מעלה לשרת
                                   </div>
                                   <div className={\`flex items-center gap-2 \${uploadStatus === 'scanning' ? 'text-blue-600 font-bold' : (['pending','approved','rejected','virus'].includes(uploadStatus) ? 'text-green-600' : 'text-slate-400')}\`}>
                                       <i className={\`fas fa-shield-virus \${uploadStatus === 'scanning' ? 'animate-pulse' : ''}\`}></i> 2. סורק וירוסים
                                   </div>
                                   <div className={\`flex items-center gap-2 \${uploadStatus === 'pending' ? 'text-blue-600 font-bold' : (['approved','rejected'].includes(uploadStatus) ? 'text-green-600' : 'text-slate-400')}\`}>
                                       <i className={\`fas fa-user-clock \${uploadStatus === 'pending' ? 'animate-pulse' : ''}\`}></i> 3. ממתין לאישור מנהל
                                   </div>
                                   {uploadStatus === 'approved' && <div className="text-green-600 font-bold text-center mt-2">✅ אושר בהצלחה!</div>}
                                   {uploadStatus === 'rejected' && <div className="text-red-600 font-bold text-center mt-2">❌ נדחה על ידי המנהל.</div>}
                                   {uploadStatus === 'virus' && <div className="text-red-600 font-bold text-center mt-2">⚠️ התגלה וירוס! הקובץ בהסגר.</div>}
                                   {uploadStatus === 'error' && <div className="text-red-600 font-bold text-center mt-2">❌ שגיאה כללית במערכת.</div>}
                               </div>
                           </div>
                       ) : (
                           <button onClick={handleProposeUpload} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50">
                               {loading ? 'מעלה...' : 'שלח לאישור'}
                           </button>
                       )}
`;
code = code.replace(oldModalUI, newModalUI);

fs.writeFileSync(file, code);
console.log("drive.html UI patches applied!");
