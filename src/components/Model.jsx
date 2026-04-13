import React, { useState, useEffect } from "react";
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

const Model = () => {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1;\n}`);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState("");
  const { user, isLoaded, isSignedIn } = useUser();

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

    if (!code.trim()) {
      Toastify({
        text: "Please provide code to review",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "#ff4d4f",
        },
      }).showToast();
      return;
    }

    setLoading(true);

    try {
      // Ensure the URL is constructed properly
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const apiUrl = baseUrl.includes('/ai/get-review') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/ai/get-review`;
      
      const payload = {
        code,
        userId: user ? user.id : null,
        email: user?.primaryEmailAddress?.emailAddress || ""
      };
      
      const res = await axios.post(apiUrl, payload);
      
      if (res.data && res.data.success) {
        const feedback = res.data.parsedResponse?.feedback || (typeof res.data.response === 'string' ? "Wait, please check JSON format:\n```json\n" + res.data.response + "\n```" : "");
        setReview(feedback);
      } else if (res.data && res.data.response) { // Fallback for old backend
        setReview(res.data.response);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      let errorMsg = "Failed to fetch review.";
      
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        errorMsg = err.response.data?.message || err.response.data?.error || `Server Error: ${err.response.status}`;
      } else if (err.request) {
        // The request was made but no response was received
        errorMsg = "No response from server. It might be starting up, please wait a minute and try again.";
      } else {
        // Something happened in setting up the request
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
    <div className="min-h-screen bg-slate-50 pt-20 md:pt-28">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                AI Code Review Assistant
              </h1>
              <p className="text-slate-600 mt-1">
                Get comprehensive code reviews powered by Gemini
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Operational</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Input Section */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Code Input</h2>
            </div>
            <div className="p-6">
              <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                  <span className="text-slate-300 text-sm font-medium">JavaScript</span>
                </div>
                <div className="p-4 overflow-auto max-h-[400px]">
                  <Editor
                    value={code}
                    onValueChange={setCode}
                    highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
                    padding={0}
                    style={{
                      fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                      fontSize: 14,
                      background: "transparent",
                      minHeight: 300,
                      outline: "none",
                      color: "#e2e8f0",
                      lineHeight: "1.6",
                    }}
                  />
                </div>
              </div>
              <button
                onClick={reviewCode}
                disabled={loading}
                className="mt-6 w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Code...
                  </>
                ) : (
                  "Analyze Code"
                )}
              </button>
            </div>
          </div>

          {/* AI Review Section */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Review Output</h2>
            </div>
            <div className="p-6 min-h-[400px] max-h-[600px] overflow-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                  <h3 className="text-lg font-medium text-slate-900 mt-4">Analyzing your code...</h3>
                  <p className="text-slate-600 mt-2">Getting insights from Gemini</p>
                </div>
              ) : review ? (
                <div className="prose prose-slate max-w-none">
                  <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No review available</h3>
                  <p className="text-slate-600">Run a code analysis to see the review</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Model;
