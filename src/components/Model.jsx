import React from "react";
import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "../../src/App.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const Model = () => {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`);

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    if (!code.trim()) {
      Toastify({
        text: "Please provide a code",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff4d4f",
      }).showToast();
      return;
    }
    setLoading(true);
    const response = await axios.post(
      "https://code-reviewer-by-fardeen.onrender.com/ai/get-review",
      {
        code,
      }
    );
    setReview(response.data.response);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white pt-8 px-2 md:px-8 flex flex-col items-center justify-start w-full">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 bg-white rounded-2xl shadow-lg p-4 md:p-8 mt-8">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col w-full md:w-1/2 mb-4 md:mb-0">
          <div className="text-lg font-semibold mb-2 text-[#4a5d13]">
            Your Code
          </div>
          <div className="bg-[#f6f8f3] rounded-xl border border-[#e0e4d7] p-2 md:p-4 flex-1 min-h-[200px]">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={12}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                background: "none",
                minHeight: 120,
                outline: "none",
              }}
            />
          </div>
          <button
            onClick={reviewCode}
            className="mt-4 bg-[#8e9c78] hover:bg-[#4a5638] text-white font-semibold py-2 px-8 rounded-full shadow transition text-lg self-end md:self-start"
          >
            Review
          </button>
        </div>
        {/* Review Output */}
        <div className="flex-1 flex flex-col w-full md:w-1/2">
          <div className="text-lg font-semibold mb-2 text-[#4a5d13]">
            AI Review
          </div>
          <div className="bg-[#f6f8f3] rounded-xl border border-[#e0e4d7] p-4 min-h-[200px] max-h-[500px] overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[120px]">
                <div className="loader mb-2"></div>
                <div className="text-[#4a5d13] font-semibold">
                  Loading review...
                </div>
              </div>
            ) : (
              <Markdown
                rehypePlugins={[rehypeHighlight]}
             
              >
                {review}
              </Markdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Model;
