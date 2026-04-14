import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

const History = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isLoaded) return;
      if (!isSignedIn) {
        setLoading(false);
        setError("Please sign in to view your history.");
        return;
      }

      try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const apiUrl = baseUrl.includes('/ai/get-history') 
          ? baseUrl 
          : `${baseUrl.replace(/\/$/, '')}/ai/get-history`;
        
        const res = await axios.get(`${apiUrl}?userId=${user.id}`);
        setHistoryItems(res.data.history || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, isLoaded, isSignedIn]);

  useEffect(() => {
    prism.highlightAll();
  }, [historyItems]);

  if (loading) {
    return (
        <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center pt-20">
            <div className="relative flex justify-center items-center">
                <div className="absolute animate-ping w-12 h-12 rounded-full bg-[#8d9a7b]/40"></div>
                <div className="w-12 h-12 border-4 border-[#8d9a7b]/20 border-t-[#8d9a7b] rounded-full animate-spin relative z-10"></div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]   pb-16">
      {/* Immersive Banner */}
      <div className="h-40 md:h-56 w-full bg-gradient-to-br from-[#8d9a7b] via-[#6f7a60] to-[#4a5638] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
          {/* Decorative floating blurred orbs */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 blur-3xl rounded-full mix-blend-overlay"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#eaf4d7]/20 blur-3xl rounded-full mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-10">
          {/* Header Card */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-white/40 shadow-[0_12px_40px_rgba(141,154,123,0.12)] p-6 md:p-10 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                  <div className="w-16 h-16 bg-gradient-to-tr from-[#8d9a7b] to-[#eaf4d7] rounded-full flex items-center justify-center shrink-0 shadow-lg border-4 border-white">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                  </div>
                  <div className="text-center md:text-left">
                      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">Evaluation History</h1>
                      <p className="text-slate-500 font-medium text-base md:text-lg mt-1">Review your past code requests and strategic AI insights.</p>
                  </div>
              </div>
          </div>

          <div className="w-full">
            {error ? (
              <div className="bg-white rounded-3xl border border-red-200 shadow-sm p-10 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{error}</h3>
              </div>
            ) : historyItems.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#8d9a7b]/20 shadow-[0_10px_40px_rgba(141,154,123,0.15)] p-12 text-center max-w-2xl mx-auto transform transition-all mt-8">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#eaf4d7] to-[#ffffff] border border-[#8d9a7b]/10 shadow-inner rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-[#8d9a7b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">No History Found</h3>
                <p className="text-slate-500 text-lg">You haven't submitted any code for review yet! Begin analyzing code to populate this dashboard.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {historyItems.map((item, index) => (
                  <div key={item._id || index} className="bg-white rounded-[2rem] border border-[#8d9a7b]/15 shadow-[0_8px_30px_rgba(141,154,123,0.06)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_50px_rgba(141,154,123,0.12)] flex flex-col">
                    {/* Card Header Layer */}
                    <div className="bg-gradient-to-r from-[#fafaf9] to-white border-b border-[#8d9a7b]/10 px-6 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                          <div className="p-2.5 bg-[#8d9a7b]/10 rounded-xl">
                              <svg className="w-5 h-5 text-[#8d9a7b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                          </div>
                          Review Snapshot #{historyItems.length - index}
                      </h3>
                      <span className="text-sm font-semibold text-[#6a7751] bg-[#eaf4d7] px-5 py-2 rounded-full border border-[#8d9a7b]/10 shadow-sm">
                          {new Date(item.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      {/* Left Pane - Source Code */}
                      <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#8d9a7b]/10 flex flex-col bg-white">
                        <h4 className="text-xs font-bold text-slate-400 mb-5 uppercase tracking-wider flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                            Original Source Code
                        </h4>
                        <div className="bg-[#111827] rounded-2xl p-6 overflow-auto max-h-[500px] border border-slate-800 shadow-inner flex-grow relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] h-6 top-auto bottom-0 pointer-events-none rounded-b-2xl"></div>
                            <pre className="text-[13px] md:text-sm text-slate-300 m-0 font-mono">
                                <code className="language-javascript">{item.query}</code>
                            </pre>
                        </div>
                      </div>
                      
                      {/* Right Pane - AI Feedback */}
                      <div className="p-6 sm:p-8 overflow-auto max-h-[500px] bg-[#fafaf9]/50">
                        <h4 className="text-xs font-bold text-[#8d9a7b] mb-5 uppercase tracking-wider flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            AI Diagnostics & Intelligence
                        </h4>
                        <div className="prose prose-sm md:prose-base prose-slate max-w-none prose-headings:text-[#4a5638] prose-a:text-[#6a7751] hover:prose-a:text-[#8d9a7b] prose-strong:text-slate-800 prose-code:text-[#6a7751] prose-code:bg-[#eaf4d7]/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-slate-800 prose-pre:text-slate-200">
                          <Markdown rehypePlugins={[rehypeHighlight]}>
                            {(() => {
                              try {
                                const parsed = JSON.parse(item.response);
                                let feedbackStr = parsed.feedback ? parsed.feedback : "";
                                let improvementsStr = parsed.improvements && Array.isArray(parsed.improvements) 
                                                        ? "\n\n### Critical Improvements:\n" + parsed.improvements.map(i => "* " + i).join("\n")
                                                        : "";
                                return feedbackStr + improvementsStr;
                              } catch (e) {
                                 return item.response;
                              }
                            })()}
                          </Markdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default History;
