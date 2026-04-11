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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 md:pt-28">
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">Evaluation History</h1>
          <p className="text-slate-600 mt-1">Review your past code requests and AI insights.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center font-medium">
            {error}
          </div>
        ) : historyItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-medium text-slate-900 mb-2">No history available</h3>
            <p className="text-slate-600">You have not submitted any code for review yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {historyItems.map((item, index) => (
              <div key={item._id || index} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white">
                  <h3 className="font-semibold">Review Request #{historyItems.length - index}</h3>
                  <span className="text-sm text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Your Code</h4>
                    <div className="bg-slate-900 rounded-md p-4 overflow-auto max-h-[400px]">
                      <pre className="text-sm text-slate-300 m-0">
                        <code className="language-javascript">{item.query}</code>
                      </pre>
                    </div>
                  </div>
                  
                  <div className="p-6 overflow-auto max-h-[400px] lg:max-h-[500px]">
                    <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">AI Insight</h4>
                    <div className="prose prose-sm prose-slate max-w-none">
                      <Markdown rehypePlugins={[rehypeHighlight]}>
                        {item.response}
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
  );
};

export default History;
