const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'drive.html');
let code = fs.readFileSync(file, 'utf8');

// 1. Add Chat button to header and floating Chat Window
const chatButtonCode = `
          {/* Chat / Proposals Header Button for Students */}
          {!isAdminMode && (
            <button 
              onClick={() => setChatModalOpen(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-medium mr-4"
            >
              <i className="fas fa-comment-dots"></i> הצעות / הערות
            </button>
          )}
`;
// Insert near the user greeting in header (line 335ish)
code = code.replace(/<div className="flex items-center gap-4">/, '<div className="flex items-center gap-4">' + chatButtonCode);

// 2. Add React state for proposals and chat
const stateCode = `
          const [chatModalOpen, setChatModalOpen] = useState(false);
          const [chatMessages, setChatMessages] = useState([]);
          const [chatInput, setChatInput] = useState('');
          const [proposeModalOpen, setProposeModalOpen] = useState(false);
          const [proposalFiles, setProposalFiles] = useState([]);
          const [proposalComments, setProposalComments] = useState('');
          
          // Proposal Path creation (Virtual)
          const [virtualFolders, setVirtualFolders] = useState([]);
          
          const fetchChatHistory = async () => {
             if (!tz) return;
             try {
                const res = await fetch(\`/api/chat/\${tz}\`);
                const data = await res.json();
                setChatMessages(data);
             } catch(e) {}
          };
          
          useEffect(() => {
             if (chatModalOpen) fetchChatHistory();
          }, [chatModalOpen]);
          
          const sendChatMessage = async () => {
             if (!chatInput.trim()) return;
             try {
                await fetch(\`/api/chat/\${tz}\`, {
                   method: 'POST',
                   headers: {'Content-Type':'application/json'},
                   body: JSON.stringify({ message: chatInput, sender: 'student' })
                });
                setChatInput('');
                fetchChatHistory();
             } catch(e) {
                alert('שגיאה בשליחה או שהצ\\'אט נחסם עבורך');
             }
          };
          
          const handleProposeUpload = async () => {
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
                 const res = await fetch('/api/drive/propose-file', {
                     method: 'POST',
                     body: formData
                 });
                 const data = await res.json();
                 
                 if (!res.ok) throw new Error(data.message || 'שגיאה בהעלאה');
                 
                 alert(data.warning === 'virus' ? 'הקובץ שלך הוכנס להסגר לבדיקת וירוסים. המנהל יעדכן אותך' : 'הצעתך נשלחה למנהל בהצלחה!');
                 setProposeModalOpen(false);
                 setProposalFiles([]);
                 setProposalComments('');
             } catch (e) {
                 alert(e.message);
             } finally {
                 setLoading(false);
             }
          };
          
          const createVirtualFolder = async () => {
              const name = prompt('הכנס שם תיקייה להוספה (זמני עד אישור):');
              if (!name) return;
              
              try {
                  const res = await fetch('/api/drive/propose-folder', {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({ tz, path: currentPath + '/' + name })
                  });
                  if (!res.ok) {
                      const err = await res.json();
                      return alert(err.message || 'שגיאה ביצירת תיקייה');
                  }
                  
                  // Add to virtual UI
                  setVirtualFolders([...virtualFolders, { name, path: currentPath, isDirectory: true, isVirtual: true }]);
              } catch(e) {}
          };
`;
code = code.replace(/const \[previewLoading, setPreviewLoading\] = useState\(false\);/, stateCode + '\nconst [previewLoading, setPreviewLoading] = useState(false);');

// 3. Add virtual folders to display list
code = code.replace(/<ul className="max-h-\[600px\] overflow-y-auto">/, `
                        <ul className="max-h-[600px] overflow-y-auto">
                          {virtualFolders.filter(v => v.path === currentPath).map(item => (
                              <li key={item.name} className="group hover:bg-yellow-50 transition-colors flex items-center justify-between border-b border-yellow-100 bg-yellow-50/50">
                                <button 
                                  onClick={() => handleFolderClick(item)}
                                  className="flex-1 flex items-center p-4 text-right cursor-pointer"
                                >
                                  <div className="bg-yellow-200 p-2 rounded-lg text-yellow-700 ml-4 shrink-0">
                                    <Folder size={24} />
                                  </div>
                                  <span className="font-medium text-slate-700 flex-1 flex items-center gap-2">
                                    {item.name} <span className="text-xs text-yellow-600 font-normal">(טיוטה)</span>
                                  </span>
                                </button>
                              </li>
                          ))}
`);

// 4. Add "Add Folder / Propose" button at the top
const addButtonCode = `
                       {!isAdminMode && (
                           <div className="flex gap-2">
                               <button 
                                 onClick={createVirtualFolder}
                                 className="flex items-center gap-2 bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                               >
                                 <Folder size={16} /> הוספת תיקייה
                               </button>
                               <button 
                                 onClick={() => setProposeModalOpen(true)}
                                 className="flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                               >
                                 <File size={16} /> הוספת קובץ
                               </button>
                           </div>
                       )}
`;
code = code.replace(/<button\s+onClick=\{handleDownloadFolderAsZip\}/, addButtonCode + '\n<button onClick={handleDownloadFolderAsZip}');

// 5. Add Modals code to end of App UI
const modalsCode = `
              {/* Chat Modal */}
              {chatModalOpen && (
                 <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col h-[60vh] overflow-hidden">
                       <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                          <h2 className="text-lg font-bold">הצעות והערות (למנהל)</h2>
                          <button onClick={() => setChatModalOpen(false)} className="hover:text-blue-200">
                             <X size={20} />
                          </button>
                       </div>
                       <div className="flex-1 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-3">
                           {chatMessages.map(msg => (
                               <div key={msg.id} className={\`p-3 rounded-lg max-w-[80%] \${msg.sender === 'student' ? 'bg-blue-100 self-start' : 'bg-slate-200 self-end'}\`}>
                                   <div className="text-sm">{msg.message}</div>
                                   <div className="text-[10px] text-slate-500 mt-1">{new Date(msg.timestamp).toLocaleString()}</div>
                               </div>
                           ))}
                           {chatMessages.length === 0 && <div className="text-center text-slate-400 mt-10">אין הודעות. שלח הודעה למנהל.</div>}
                       </div>
                       <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
                           <input 
                               type="text" 
                               value={chatInput}
                               onChange={e => setChatInput(e.target.value)}
                               onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                               placeholder="הקלד הודעה..." 
                               className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                           />
                           <button onClick={sendChatMessage} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">שלח</button>
                       </div>
                    </div>
                 </div>
              )}

              {/* Propose Files Modal */}
              {proposeModalOpen && (
                 <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">
                       <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold text-slate-800">הוספת קבצים / ZIP</h2>
                          <button onClick={() => setProposeModalOpen(false)} className="p-1 text-slate-400">
                             <X size={20} />
                          </button>
                       </div>
                       <p className="text-sm text-slate-500 mb-4">
                           הקבצים יישלחו לאישור המנהל (נתיב: <span dir="ltr">{currentPath || '/'}</span>).
                           ניתן להעלות קובצי ZIP, והמנהל יפתח אותם אוטומטית. עד 20 קבצים.
                       </p>
                       <input 
                           type="file" 
                           multiple
                           onChange={e => setProposalFiles(e.target.files)}
                           className="mb-4 block w-full text-sm text-slate-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-blue-50 file:text-blue-700
                                      hover:file:bg-blue-100"
                       />
                       <textarea 
                           placeholder="הערות למנהל (אופציונלי)..." 
                           value={proposalComments}
                           onChange={e => setProposalComments(e.target.value)}
                           className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm mb-4 min-h-[80px]"
                       />
                       <button onClick={handleProposeUpload} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50">
                           {loading ? 'מעלה...' : 'שלח לאישור'}
                       </button>
                    </div>
                 </div>
              )}
`;

code = code.replace(/\{\/\* Permissions Modal \*\/\}/, modalsCode + '\n{/* Permissions Modal */}');

// Finally, rewrite FontAwesome in the head
code = code.replace(/<title>/, '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n    <title>');

fs.writeFileSync(file, code);
console.log('drive.html injected successfully!');
