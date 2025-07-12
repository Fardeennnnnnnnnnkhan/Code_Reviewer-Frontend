import React from "react";
import { Link } from "react-router-dom";

export default function ConnectUs() {
  // No need for useNavigate since we are redirecting to an external URL
  const portfolioUrl = "https://portfolio-fardeen-khan.vercel.app/"; // Replace with your actual portfolio URL
  return (
    <section className="w-full mx-auto px-4 md:px-12 py-24 flex flex-col items-center justify-center text-center">
      <h2 className="text-4xl md:text-6xl font-serif font-normal text-black mb-8 mt-4">
        Connect with us
      </h2>
      <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
        Want to get in touch?{" "}
        <span className="font-semibold text-[#4a5d13]">
          Email me by visiting my portfolio
        </span>{" "}
        and let's connect about how CodeCureAI can help you!
      </p>
      <button
        className="w-full max-w-3xl bg-[#4a5d13] text-white font-semibold text-lg md:text-xl py-5 rounded-full mb-20 hover:bg-[#37470e] transition"
        onClick={() => window.open(portfolioUrl, "_blank")}
      >
        Connect
        <span className="ml-2" aria-hidden>
          ↗
        </span>
      </button>
      <div className="border-t border-gray-200 w-full mb-8"></div>
      <footer className="w-full flex flex-col gap-4 md:gap-0 md:flex-row md:items-end md:justify-between px-2 md:px-0 pb-4">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-12 w-full">
          <div className="flex flex-col gap-2 md:gap-4 w-full">
            {/* Contact Info (as normal links/icons) */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mt-2 text-left">
              <span className="text-[#4a5d13] font-semibold">Fardeen Khan</span>
              <a
                href="mailto:fardeen@example.com"
                className="text-[#4a5d13] font-medium hover:underline"
              >
                fardeen14122004@gmail.com
              </a>
            </div>
            <div className="flex gap-4 mt-1 md:mt-0">
              <Link
                to="https://www.linkedin.com/in/fardeen-khan-077661290/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#4a5d13"
                  strokeWidth="2"
                >
                  <rect x="4" y="4" width="16" height="16" rx="3" />
                  <path d="M8 11v5M8 8v.01M12 16v-5m0 0a2 2 0 1 1 4 0v5" />
                </svg>
              </Link>
              <Link
                href="https://github.com/Fardeennnnnnnnnnkhan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#4a5d13]"
                  strokeWidth="2"
                >
                  <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.38-2.03 1.01-2.75-.1-.26-.44-1.3.1-2.7 0 0 .83-.27 2.75 1.02A9.38 9.38 0 0 1 12 6.84c.84.004 1.68.11 2.47.32 1.92-1.29 2.75-1.02 2.75-1.02.54 1.4.2 2.44.1 2.7.63.72 1.01 1.63 1.01 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.58.69.48C19.13 20.54 22 16.74 22 12.26 22 6.58 17.52 2 12 2Z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center flex-col gap-2 text-[#8e9c78] text-sm font-mono">
          <span>© CodeCureAI. 2025</span>
          <span>All Rights Reserved</span>
        </div>
        <div className="text-[#8e9c78] text-sm font-mono mt-2 md:mt-0"></div>
      </footer>
      <div className="w-full text-center text-gray-400 text-lg mt-2 ">
        Created and developed by{" "}
        <span className="text-[#8e9c78] font-mono font-bold">
          {" "}
          Fardeen Khan
        </span>
      </div>
    </section>
  );
}
