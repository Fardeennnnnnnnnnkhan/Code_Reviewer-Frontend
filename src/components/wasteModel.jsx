// import React, { useState, useCallback, useMemo } from 'react';

// // --- MOCK DEPENDENCIES (Replace with actual imports in your project) ---
// // Note: In a real project, you would import these packages via npm:
// // import Editor from 'react-simple-code-editor';
// // import { highlight, languages } from 'prismjs/components/prism-core';
// // import 'prismjs/components/prism-clike';
// // import 'prismjs/components/prism-javascript';
// // import Markdown from 'react-markdown';
// // import rehypeHighlight from 'rehype-highlight';

// // We must define mock components and functions since we can't bundle them here:
// const Editor = ({ value, onValueChange, highlight, padding, style }) => (
//   <textarea
//     value={value}
//     onChange={(e) => onValueChange(e.target.value)}
//     style={{ ...style, width: '100%', minHeight: '300px', resize: 'vertical' }}
//     className="font-mono text-sm p-4 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-[#8e9c78] outline-none"
//   />
// );
// const Markdown = ({ children }) => <div className="markdown-body">{children}</div>; // Placeholder
// const rehypeHighlight = null; // Placeholder
// const prism = { highlight: (code) => code, languages: { javascript: {} } }; // Placeholder
// // --- END MOCK DEPENDENCIES ---


// // --- CORE LOGIC AND UTILITIES ---

// // Helper function to get the classification color and label
// const getClassificationData = (reviewText) => {
//   const text = reviewText.toLowerCase();
//   if (text.includes("✅ excellent")) return { label: "Excellent", color: 'text-green-600 bg-green-50 border-green-300' };
//   if (text.includes("⚠️ good")) return { label: "Good but Improvable", color: 'text-yellow-700 bg-yellow-50 border-yellow-300' };
//   if (text.includes("❌ needs improvement")) return { label: "Needs Improvement", color: 'text-red-600 bg-red-50 border-red-300' };
//   return { label: "Analysis Pending/Unknown", color: 'text-gray-600 bg-gray-100 border-gray-300' };
// };

// // Helper function to simulate asynchronous API call for comparison data
// const mockApiCall = (model, code) => {
//   let latency, baseRelevance, review, lengthFactor;

//   // Define performance profiles for realism
//   switch (model) {
//     case 'gemini':
//       latency = Math.random() * 800 + 1000; // Slower, more depth (1000-1800ms)
//       baseRelevance = 0.92;
//       lengthFactor = 5;
//       review = `
// **✅ Excellent - Clean Code**

// This function, while simple, is idiomatic and correct in most JavaScript environments. It's concise and readable.

// \`\`\`javascript
// function sum() {
//   return 1 + 1;
// }
// \`\`\`

// **Deep Dive Suggestions:**
// 1. **Purity Check:** The function is pure, which is excellent.
// 2. **ES6 Refactor:** For modern codebases, consider using a const arrow function: \`const sum = () => 1 + 1;\`.
// 3. **Complexity:** O(1) - Optimal.
// `;
//       break;

//     case 'cohere':
//       latency = Math.random() * 1200 + 400; // Moderate speed (400-1600ms)
//       baseRelevance = 0.85;
//       lengthFactor = 3.5;
//       review = `
// **⚠️ Good but Improvable**

// The function \`sum\` performs a literal addition of two constants. The result is fixed, suggesting the function is unnecessary overhead.

// **Optimization Refactoring:**
// Pre-calculate the result to zero the function call overhead.
// \`\`\`javascript
// const result = 2; // Fixed constant
// \`\`\`

// **Security:** No vulnerabilities detected. Focus on removing dead code/overhead.
// `;
//       break;

//     case 'openrouter':
//     default: // Simulating Llama 3 via OpenRouter, optimized for speed
//       latency = Math.random() * 400 + 200; // Very fast (200-600ms)
//       baseRelevance = 0.78;
//       lengthFactor = 2;
//       review = `
// **❌ Needs Improvement - Naming and Utility**

// This function always returns \`2\`. The name \`sum()\` suggests it should be able to add variable numbers. The current code is misleading and should be corrected or renamed.

// **Immediate Fix:**
// Pass arguments to make it useful: \`function sum(a, b) { return a + b; }\`.
// `;
//       break;
//   }

//   // Calculate Length Score (based on token count/character length for mock)
//   const lengthScore = Math.min(Math.round(review.length / 5), 100);

//   // Randomize relevance slightly to show dynamic scoring
//   const relevance = Math.round((baseRelevance + (Math.random() * 0.1 - 0.05)) * 100);
//   const time = Math.round(latency);

//   // Calculate a final Quality Score for a quick comparison stat
//   const finalQualityScore = Math.round((relevance * 0.5) + (lengthScore * 0.3) + ((2000 - time) / 20));

//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         review,
//         time,
//         length: lengthScore,
//         relevance,
//         quality: Math.min(finalQualityScore, 100), // Cap quality at 100
//         status: 'success',
//       });
//     }, latency);
//   });
// };

// // --- REACT COMPONENT ---

// const Model = () => {
//   const defaultCode = `function sum(a, b) {
//   // This function adds two numbers
//   return a + b; 
// }
// `;
//   const [code, setCode] = useState(defaultCode);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('gemini');
  
//   const initialModelData = {
//     gemini: { review: "Click 'Review Code' to start the analysis.", time: 0, length: 0, relevance: 0, quality: 0, status: 'idle' },
//     cohere: { review: "Click 'Review Code' to start the analysis.", time: 0, length: 0, relevance: 0, quality: 0, status: 'idle' },
//     openrouter: { review: "Click 'Review Code' to start the analysis.", time: 0, length: 0, relevance: 0, quality: 0, status: 'idle' },
//   };

//   const [modelData, setModelData] = useState(initialModelData);

//   // Custom CSS for the loader
//   const loaderStyle = `
//     .loader {
//         border: 4px solid #f3f3f3;
//         border-top: 4px solid #8e9c78; /* Primary color for spinner */
//         border-radius: 50%;
//         width: 24px;
//         height: 24px;
//         animation: spin 1s linear infinite;
//     }
//     @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//     }
//     .markdown-body pre {
//         background-color: #1f2937 !important;
//         color: #f3f4f6 !important;
//         padding: 1rem;
//         border-radius: 0.5rem;
//         overflow-x: auto;
//     }
//   `;

//   const modelKeys = useMemo(() => Object.keys(modelData), [modelData]);

//   const reviewCode = useCallback(async () => {
//     if (loading) return;
//     if (!code.trim()) {
//       // Custom Modal/Toast instead of alert for better UX
//       console.error("Please enter code for review.");
//       return;
//     }

//     setLoading(true);
//     // Reset all review statuses and active tab
//     setModelData(prev => 
//       modelKeys.reduce((acc, key) => {
//         acc[key] = { ...prev[key], status: 'loading', review: 'Analyzing...' };
//         return acc;
//       }, {})
//     );
//     setActiveTab(modelKeys[0]); // Default to the first tab

//     const apiCalls = modelKeys.map(key => {
//       const startTime = performance.now();
//       // Replace mockApiCall with your actual axios calls here:
//       /*
//       if (key === 'gemini') { 
//           return axios.post("YOUR_GEMINI_ENDPOINT", { code }) 
//       } else if (key === 'cohere') { 
//           return axios.post("YOUR_COHERE_ENDPOINT", { code }) 
//       } 
//       */
//       return mockApiCall(key, code)
//         .then(data => ({ model: key, result: { ...data, status: 'success' } }))
//         .catch(err => ({ 
//           model: key, 
//           result: { 
//             review: `❌ Error: API Failed. (${err.message || 'Check network/key'})`, 
//             time: Math.round(performance.now() - startTime),
//             length: 0, 
//             relevance: 0, 
//             quality: 0,
//             status: 'error' 
//           } 
//         }));
//     });

//     try {
//       const results = await Promise.all(apiCalls);
      
//       setModelData(prev => {
//         const newState = { ...prev };
//         results.forEach(({ model, result }) => {
//           newState[model] = result;
//         });
//         return newState;
//       });

//     } catch (error) {
//       console.error("Global Review Error:", error);
//       // Use a cleaner modal/toast for global error
//     } finally {
//       setLoading(false);
//     }
//   }, [code, loading, modelKeys]);


//   const activeModel = modelData[activeTab];
//   const activeClassification = getClassificationData(activeModel.review);

//   const handleCopy = (text) => {
//     navigator.clipboard.writeText(text).then(() => {
//       // Replace alert with a success toast/notification
//       console.log("Review copied to clipboard!");
//     }).catch(err => {
//       console.error('Could not copy text: ', err);
//       // Replace alert with a failure toast/notification
//     });
//   };
  
//   // Custom helper for metric bars
//   const MetricDisplay = ({ label, value, unit, color }) => (
//     <div className="flex justify-between items-center mb-1">
//       <span className="text-sm font-medium text-gray-600">{label}</span>
//       <span className={`text-base font-bold ${color}`}>{value}{unit}</span>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-white p-4 sm:p-8">
//       <style>{loaderStyle}</style>
//       <div className="max-w-7xl mx-auto font-sans">
//         <h1 className="text-4xl font-extrabold text-[#4a5d13] mb-8 text-center tracking-tight">
//           AI Code Review Comparison Suite
//         </h1>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* LEFT COLUMN: CODE EDITOR & INPUT */}
//           <div className="flex-1 w-full lg:w-1/2">
//             <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 h-full flex flex-col">
//               <h2 className="text-xl font-bold mb-4 text-white">1. Enter Code for Review</h2>
//               <div className="flex-1">
//                 <Editor
//                   value={code}
//                   onValueChange={setCode}
//                   highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
//                   padding={15}
//                   style={{
//                     fontFamily: '"Fira Code", "Fira Mono", monospace',
//                     fontSize: 14,
//                     minHeight: 300,
//                     maxHeight: 'calc(100vh - 400px)',
//                     overflowY: 'auto',
//                     borderRadius: '0.75rem',
//                     outline: 'none',
//                     backgroundColor: '#1f2937',
//                     color: '#f3f4f6',
//                     lineHeight: 1.5,
//                   }}
//                 />
//               </div>
//               <button
//                 onClick={reviewCode}
//                 disabled={loading}
//                 className="w-full mt-6 bg-[#8e9c78] hover:bg-[#6c7b5b] text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 disabled:opacity-50 flex items-center justify-center space-x-3"
//               >
//                 {loading ? (
//                   <>
//                     <div className="loader"></div>
//                     <span className="text-lg">Analyzing Code...</span>
//                   </>
//                 ) : (
//                   <span className="text-lg">Run Review with All Models</span>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: REVIEW & COMPARISON DASHBOARD */}
//           <div className="flex-1 w-full lg:w-1/2">
//             <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 h-full">
//               <h2 className="text-xl font-bold mb-4 text-gray-800">2. AI Model Performance & Output</h2>

//               {/* TABS (MODEL SELECTOR) */}
//               <div className="flex mb-5 border-b border-gray-200">
//                 {modelKeys.map((key) => (
//                   <button
//                     key={key}
//                     onClick={() => setActiveTab(key)}
//                     className={`flex-1 py-2 px-3 text-base font-semibold transition duration-200 capitalize border-b-2 ${
//                       activeTab === key
//                         ? 'border-[#8e9c78] text-[#4a5d13]'
//                         : 'border-transparent text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     {key}
//                   </button>
//                 ))}
//               </div>

//               {/* STATISTICAL COMPARISON BAR */}
//               <div className="p-4 bg-gray-50 rounded-xl shadow-inner mb-6">
//                 <h3 className="text-lg font-bold text-gray-700 mb-4">Model Performance Overview</h3>
//                 <div className="space-y-4">
//                     {modelKeys.map(key => {
//                         const data = modelData[key];
//                         // Normalize metrics for bar display
//                         const speedScore = 100 - (data.time / 2000) * 100; // 2000ms max scale
//                         const qualityScore = data.quality; // Use the derived quality score

//                         return (
//                             <div key={key} className="flex items-center space-x-4">
//                                 <span className={`w-24 font-bold capitalize text-sm ${
//                                     activeTab === key ? 'text-[#4a5d13]' : 'text-gray-500'
//                                 }`}>
//                                     {key}
//                                 </span>
//                                 <div className="flex-1 flex space-x-1 h-3 rounded-full overflow-hidden border border-gray-300">
//                                     {/* Quality Score Bar */}
//                                     <div 
//                                          title={`Quality: ${qualityScore}% (Relevance & Length)`}
//                                          className="h-full transition-all duration-700"
//                                          style={{
//                                              width: `${qualityScore}%`,
//                                              backgroundColor: qualityScore > 75 ? '#10b981' : qualityScore > 50 ? '#f59e0b' : '#ef4444',
//                                          }}
//                                     ></div>
//                                     {/* Speed Gap Indicator */}
//                                     <div 
//                                          title={`Speed: ${data.time}ms`}
//                                          className="h-full bg-gray-400 transition-all duration-700"
//                                          style={{
//                                             width: `${100 - qualityScore}%`,
//                                             opacity: 0.5,
//                                          }}
//                                     ></div>
//                                 </div>
//                                 <span className="text-xs text-gray-500 w-12 text-right">{qualityScore}%</span>
//                             </div>
//                         );
//                     })}
//                 </div>
//                 <p className="text-xs text-gray-500 mt-4 text-center">
//                     **Bar shows Quality Score.** Hover for details. Quality is derived from Relevance and Review Length, weighted against Speed.
//                 </p>
//               </div>

//               {/* ACTIVE MODEL REVIEW OUTPUT */}
//               <div className="min-h-[300px] border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                
//                 {/* CLASSIFICATION HEADER */}
//                 <div className={`p-4 font-extrabold text-xl border-b ${activeClassification.color}`}>
//                     {activeModel.status === 'loading' ? (
//                         <div className="flex items-center space-x-3 text-gray-600">
//                             <div className="loader"></div>
//                             <span>Analyzing...</span>
//                         </div>
//                     ) : (
//                         <span className="tracking-wide">{activeClassification.label}</span>
//                     )}
//                 </div>

//                 <div className="p-4 bg-white">
//                     {/* STATISTICAL DETAIL CARDS */}
//                     <div className="grid grid-cols-3 gap-3 mb-4 border-b pb-4">
//                         <div className="p-2 bg-blue-50 rounded-lg">
//                             <MetricDisplay label="Response Time" value={activeModel.time} unit="ms" color={activeModel.time < 500 ? 'text-green-600' : 'text-red-600'} />
//                         </div>
//                         <div className="p-2 bg-purple-50 rounded-lg">
//                             <MetricDisplay label="Relevance Score" value={activeModel.relevance} unit="%" color={activeModel.relevance > 85 ? 'text-green-600' : 'text-orange-600'} />
//                         </div>
//                         <div className="p-2 bg-indigo-50 rounded-lg">
//                             <MetricDisplay label="Detail Length" value={activeModel.length} unit="pts" color={activeModel.length > 70 ? 'text-green-600' : 'text-gray-600'} />
//                         </div>
//                     </div>

//                     {/* REVIEW CONTENT */}
//                     <div className="flex justify-between items-center mb-3">
//                         <h4 className="font-bold text-lg text-gray-800 capitalize">{activeTab} Review:</h4>
//                         <button
//                             onClick={() => handleCopy(activeModel.review)}
//                             className="text-sm text-gray-500 hover:text-[#4a5d13] transition duration-150 p-2 rounded-md border border-gray-300 hover:border-[#8e9c78] flex items-center space-x-1"
//                             title="Copy Review Output"
//                         >
//                             📋 Copy
//                         </button>
//                     </div>

//                     {/* Markdown Output Area */}
//                     <div className="prose prose-sm max-w-none text-gray-800">
//                       <Markdown 
//                         // rehypePlugins={[rehypeHighlight]} // uncomment in real environment
//                       >
//                         {activeModel.review.replace(activeModel.review.split('\n')[0], '').trim()}
//                       </Markdown>
//                     </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Model;
