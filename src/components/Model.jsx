import React, { useState, useEffect, useRef } from "react";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "../../src/App.css";
import { useUser } from "@clerk/clerk-react";
import BlurReveal from "./BlurReveal";

const Model = () => {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1;\n}`);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState("");
  const { user, isLoaded, isSignedIn } = useUser();
  const [inputMode, setInputMode] = useState("code"); // "code" | "file"
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  useEffect(() => {
    prism.highlightAll();
  }, []);

  const reviewCode = async () => {
    if (!isSignedIn) {
      Toastify({
        text: "Please sign in first to evaluate code and save your history.",
        duration: 4000,
        gravity: "top",
        position: "right",
        style: {
          background: "#4A5638",
        },
      }).showToast();
      return;
    }

    if (inputMode === 'code' && !code.trim()) {
      Toastify({
        text: "Please provide code to review.",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "#ff4d4f" },
      }).showToast();
      return;
    }

    if (inputMode === 'file' && !selectedFile) {
      Toastify({
        text: "Please select an image file to analyze.",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "#ff4d4f" },
      }).showToast();
      return;
    }

    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      let reviewApiUrl;
      let payload;

      if (inputMode === 'code') {
        reviewApiUrl = baseUrl.includes('/ai/get-review') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/ai/get-review`;
        payload = {
          code,
          userId: user ? user.id : null,
          email: user?.primaryEmailAddress?.emailAddress || ""
        };
      } else if (inputMode === 'file') {
        // Validate Image
        if (!selectedFile.type.startsWith('image/')) {
           throw new Error("Only Image files are currently supported for File Upload analysis.");
        }
        
        // Step 1: Upload image to ImageKit
        const uploadApiUrl = `${baseUrl.replace(/\/$/, '')}/images/upload`;
        const formData = new FormData();
        formData.append('image', selectedFile);

        const uploadRes = await axios.post(uploadApiUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const uploadedImageUrl = uploadRes.data.image.url;

        // Step 2: Use URL to analyze image
        reviewApiUrl = `${baseUrl.replace(/\/$/, '')}/ai/analyze-image-code`;
        payload = {
          imageUrl: uploadedImageUrl,
          userId: user ? user.id : null,
          email: user?.primaryEmailAddress?.emailAddress || ""
        };
      }
      
      const res = await axios.post(reviewApiUrl, payload);
      
      if (res.data && res.data.success) {
        let feedback = "";
        
        if (inputMode === 'file') {
          feedback = res.data.parsedResponse?.feedback || "Analysis completed but no feedback was returned.";
        } else {
          feedback = res.data.parsedResponse?.feedback || (typeof res.data.response === 'string' ? "Wait, please check JSON format:\n```json\n" + res.data.response + "\n```" : "");
        }
        
        setReview(feedback);
      } else if (res.data && res.data.response) { // Fallback for old backend
        setReview(res.data.response);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      let errorMsg = "Failed to fetch review.";
      
      if (err.response) {
        errorMsg = err.response.data?.message || err.response.data?.error || `Server Error: ${err.response.status}`;
      } else if (err.request) {
        errorMsg = "No response from server. It might be starting up, please wait a minute and try again.";
      } else {
        errorMsg = err.message;
      }
      
      Toastify({
        text: errorMsg,
        duration: 5000,
        gravity: "top",
        position: "right",
        style: {
          background: "#ff4d4f",
        },
      }).showToast();
      console.error("[Code Review Error]:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]   pb-16">
      {/* Immersive Banner */}
      <div className="h-40 md:h-48 w-full bg-gradient-to-br from-[#8d9a7b] via-[#6f7a60] to-[#4a5638] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 blur-3xl rounded-full mix-blend-overlay"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#eaf4d7]/20 blur-3xl rounded-full mix-blend-overlay"></div>
      </div>

      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-10">
          <BlurReveal className="bg-white rounded-2xl md:rounded-3xl border border-white/40 shadow-[0_12px_40px_rgba(141,154,123,0.12)] p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
             <div className="flex items-center gap-5 w-full">
                  <div className="w-14 h-14 bg-gradient-to-tr from-[#8d9a7b] to-[#eaf4d7] rounded-xl flex items-center justify-center shrink-0 shadow-lg border-2 border-white">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                  </div>
                  <div className="text-center md:text-left">
                      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">AI Code Cure</h1>
                      <p className="text-slate-500 font-medium text-sm md:text-base mt-1">Submit your codebase or upload files for a devastatingly deep analysis.</p>
                  </div>
             </div>
             <div className="flex items-center gap-3 bg-[#eaf4d7]/50 border border-[#8d9a7b]/20 px-5 py-2.5 rounded-full shrink-0 shadow-sm">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8d9a7b] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4a5638]"></span>
                  </div>
                  <span className="text-sm font-bold text-[#4a5638] tracking-wide uppercase">Engine Online</span>
             </div>
          </BlurReveal>

          <BlurReveal stagger={true} delay={0.1} className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* INPUT PANE */}
            <div className="bg-white rounded-[2rem] border border-[#8d9a7b]/15 shadow-[0_8px_30px_rgba(141,154,123,0.06)] flex flex-col overflow-hidden transition-all hover:shadow-[0_12px_40px_rgba(141,154,123,0.1)]">
              {/* Tabs Wrapper */}
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#8d9a7b]/10 bg-gradient-to-r from-[#fafaf9] to-white px-6 py-4 gap-4">
                  <div className="bg-slate-100 p-1.5 rounded-xl flex items-center space-x-1 border border-slate-200/60 shadow-inner w-full sm:w-auto overflow-x-auto">
                      <button 
                         onClick={() => setInputMode('code')}
                         className={`px-6 py-2.5 rounded-lg text-sm sm:text-base font-bold transition-all whitespace-nowrap ${inputMode === 'code' ? 'bg-white text-[#4a5638] shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                      >
                         Raw Code Input
                      </button>
                      <button 
                         onClick={() => setInputMode('file')}
                         className={`px-6 py-2.5 rounded-lg text-sm sm:text-base font-bold transition-all flex items-center gap-2 whitespace-nowrap ${inputMode === 'file' ? 'bg-white text-[#4a5638] shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                      >
                         File Upload
                         <span className="bg-[#eaf4d7] text-[#4a5638] text-[9px] sm:text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider">New</span>
                      </button>
                  </div>
              </div>

              {/* Dynamic Input Body */}
              <div className="flex-grow flex flex-col p-6 sm:p-8">
                 {inputMode === 'code' ? (
                    <div className="bg-[#111827] rounded-3xl border border-slate-800 shadow-inner overflow-hidden flex flex-col h-[450px]">
                      <div className="bg-gradient-to-b from-[#1e293b] to-[#111827] px-5 py-3.5 border-b border-slate-800 flex justify-between items-center shrink-0">
                          <div className="flex space-x-2">
                             <div className="w-3.5 h-3.5 rounded-full bg-red-400 opacity-80"></div>
                             <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 opacity-80"></div>
                             <div className="w-3.5 h-3.5 rounded-full bg-green-400 opacity-80"></div>
                          </div>
                          <span className="text-slate-400 text-xs font-mono tracking-wider font-semibold">sys/editor.js</span>
                      </div>
                      <div className="flex-grow overflow-auto custom-scrollbar relative p-5">
                        <Editor
                          value={code}
                          onValueChange={setCode}
                          highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
                          padding={0}
                          style={{
                            fontFamily: '"Fira Code", "SF Mono", monospace',
                            fontSize: 14,
                            background: "transparent",
                            minHeight: "100%",
                            outline: "none",
                            color: "#e2e8f0",
                            lineHeight: "1.6",
                          }}
                        />
                      </div>
                    </div>
                 ) : (
                    <div className="h-[450px] border-2 border-dashed border-[#8d9a7b]/40 rounded-3xl bg-gradient-to-br from-[#fafaf9]/80 to-white flex flex-col items-center justify-center relative transition-all duration-300 hover:border-[#8d9a7b] hover:bg-[#fafaf9] group overflow-hidden">
                       <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                          accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.cs,.php,.rb,.go,.rs,.txt,.pdf,.doc,.docx,image/*"
                       />
                       
                       {previewUrl ? (
                          <div className="w-full h-full p-4 relative z-0 flex items-center justify-center bg-black/5">
                             <img src={previewUrl} alt="Preview" className="max-w-full max-h-full rounded-xl object-contain shadow-md" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-3xl pointer-events-none">
                                <span className="text-white font-bold tracking-wider text-xl drop-shadow-md">Click to change image</span>
                             </div>
                          </div>
                       ) : (
                          <>
                             <div className="w-24 h-24 bg-white shadow-md border border-[#8d9a7b]/15 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_30px_rgba(141,154,123,0.15)] ring-4 ring-[#eaf4d7]/50">
                                <svg className="w-12 h-12 text-[#8d9a7b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                             </div>
                             <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">Drop resources here</h3>
                             <p className="text-slate-500 text-center max-w-sm leading-relaxed text-sm md:text-base px-4">
                                We process Images, PDFs, Word docs, and Raw Code files. <span className="text-[#8d9a7b] font-bold underline decoration-[#8d9a7b]/40 underline-offset-4 pointer-events-none">Click to browse</span>
                             </p>
                          </>
                       )}
                       
                       {selectedFile && !previewUrl && (
                          <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl border border-emerald-200/60 p-5 shrink-0 shadow-lg flex justify-between items-center z-20 backdrop-blur-sm bg-white/90">
                             <div className="flex items-center gap-4 overflow-hidden">
                                <div className="p-2 bg-emerald-50 rounded-xl">
                                  <svg className="w-7 h-7 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-800 truncate text-sm sm:text-base">{selectedFile.name}</span>
                                  <span className="text-xs font-semibold text-slate-400">Ready for scan</span>
                                </div>
                             </div>
                             <button onClick={(e) => { e.preventDefault(); setSelectedFile(null); setPreviewUrl(null); }} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-full transition-colors shrink-0 z-30 relative cursor-pointer">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                             </button>
                          </div>
                       )}

                       {selectedFile && previewUrl && (
                          <div className="absolute bottom-6 left-6 right-6 bg-white/80 rounded-2xl border border-emerald-200/50 p-4 shrink-0 shadow-lg flex justify-between items-center z-20 backdrop-blur-md">
                             <div className="flex items-center gap-4 overflow-hidden">
                                <div className="p-2 bg-emerald-100 rounded-xl">
                                  <svg className="w-6 h-6 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-800 truncate text-sm">{selectedFile.name}</span>
                                  <span className="text-xs font-semibold text-emerald-600">Image Ready</span>
                                </div>
                             </div>
                             <button onClick={(e) => { e.preventDefault(); setSelectedFile(null); setPreviewUrl(null); }} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-full transition-colors shrink-0 z-30 relative cursor-pointer">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                             </button>
                          </div>
                       )}
                    </div>
                 )}

                 {/* Analyze Button */}
                 <button
                    onClick={reviewCode}
                    disabled={loading || (inputMode === 'code' ? !code.trim() : !selectedFile)}
                    className="mt-6 sm:mt-8 w-full bg-gradient-to-r from-[#8d9a7b] to-[#6a7751] hover:from-[#6a7751] hover:to-[#4a5638] disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:shadow-none text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-[0_8px_20px_rgba(141,154,123,0.3)] hover:shadow-[0_15px_30px_rgba(141,154,123,0.4)] flex items-center justify-center gap-3 overflow-hidden group"
                 >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deploying Intelligence...
                      </>
                    ) : (
                      <>
                        Invoke AI Diagnostics
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </>
                    )}
                 </button>
              </div>
            </div>

            {/* OUTPUT PANE */}
            <div className="bg-white rounded-[2rem] border border-[#8d9a7b]/15 shadow-[0_8px_30px_rgba(141,154,123,0.06)] flex flex-col overflow-hidden transition-all hover:shadow-[0_12px_40px_rgba(141,154,123,0.1)] h-[650px] xl:h-auto">
               <div className="flex items-center justify-between border-b border-[#8d9a7b]/10 bg-gradient-to-r from-[#fafaf9] to-white px-6 sm:px-8 py-4 sm:py-5 shrink-0">
                   <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-3">
                       <div className="p-2.5 bg-[#8d9a7b]/10 rounded-xl">
                           <svg className="w-5 h-5 text-[#8d9a7b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                           </svg>
                       </div>
                       AI Resolution & Metrics
                   </h2>
               </div>
               <div className="flex-grow p-6 sm:p-8 overflow-auto bg-[#fafaf9]/40 custom-scrollbar relative">
                 {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm z-10">
                        <div className="relative flex justify-center items-center">
                            <div className="absolute animate-ping w-20 h-20 rounded-full bg-[#8d9a7b]/30"></div>
                            <div className="w-16 h-16 border-[5px] border-[#8d9a7b]/20 border-t-[#8d9a7b] rounded-full animate-spin relative z-10 shadow-lg"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mt-8 tracking-tight">Extracting Insights...</h3>
                        <p className="text-slate-500 mt-2 font-medium">Deep diving into your architecture</p>
                    </div>
                 ) : review ? (
                    <div className="prose prose-sm md:prose-base prose-slate max-w-none prose-headings:text-[#4a5638] prose-a:text-[#6a7751] hover:prose-a:text-[#8d9a7b] font-medium prose-strong:text-slate-800 prose-code:text-[#6a7751] prose-code:bg-[#eaf4d7]/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-[#111827] prose-pre:text-slate-200 prose-pre:shadow-2xl prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-2xl">
                      <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
                    </div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                        <div className="w-28 h-28 bg-[#eaf4d7] rounded-full flex items-center justify-center mb-8 shadow-inner ring-4 ring-white">
                            <svg className="w-12 h-12 text-[#4a5638]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-800 mb-3 tracking-tight">System Awaiting Input</h3>
                        <p className="text-slate-500 max-w-sm mb-4 leading-relaxed font-medium">Upload your files or paste code to unleash the power of CodeCure AI. Your personalized diagnostic report will render here instantly.</p>
                    </div>
                 )}
               </div>
            </div>

          </BlurReveal>
      </div>
    </div>
  );
};

export default Model;
