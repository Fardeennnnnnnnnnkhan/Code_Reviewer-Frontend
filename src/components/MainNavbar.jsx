import React from "react";

export default function MainNavbar({ onNav, onTryNow, menuOpen, setMenuOpen }) {
  return (
    <>
      {/* Hamburger for mobile (always visible on small screens, top-right) */}
      <button
        className="fixed top-6 right-4 z-50 md:hidden flex items-center justify-center p-2 rounded focus:outline-none bg-white/80 shadow"
        aria-label="Open menu"
        onClick={() => setMenuOpen(true)}
        style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)" }}
      >
        <svg
          width="32"
          height="32"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </button>

      {/* Desktop Pill Navbar */}
      <div className="fixed top-8 left-1/2 z-40 -translate-x-1/2 flex flex-col items-center w-full pointer-events-none md:block hidden">
        <div className="flex items-center justify-center pointer-events-auto">
          <div className="backdrop-blur-md bg-gradient-to-r from-white/80  rounded-full flex gap-10 shadow-lg px-8 py-3 border border-gray-200/60">
            <button
              onClick={onNav("landing")}
              className="font-semibold text-sm text-black hover:underline px-4 py-1 bg-transparent border-none"
            >
              Home
            </button>
            <button
              onClick={onNav("whychoose")}
              className="font-semibold text-sm text-black hover:underline px-4 py-1 bg-transparent border-none"
            >
              Why CodeCureAI?
            </button>
            <button
              onClick={onNav("features")}
              className="font-semibold text-sm text-black hover:underline px-4 py-1 bg-transparent border-none"
            >
              Features
            </button>
            <button
              onClick={onNav("howitworks")}
              className="font-semibold text-sm text-black hover:underline px-4 py-1 bg-transparent border-none"
            >
              How It Works
            </button>
            <button
              onClick={onNav("contact")}
              className="font-semibold text-sm text-black hover:underline px-4 py-1 bg-transparent border-none"
            >
              Contact
            </button>
            <button
              onClick={onTryNow}
              className="bg-[#8e9c78] font-semibold px-4 py-2 rounded-full text-white text-sm shadow hover:bg-[#4a5638] transition text-center ml-4"
              style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)" }}
            >
              Try Now
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Navbar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          boxShadow: menuOpen ? "-8px 0 32px 0 rgba(0,0,0,0.10)" : undefined,
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 pt-7 pb-2">
            <div className="text-2xl font-sans font-normal text-black">
              CodeCureAI
            </div>
            <button
              className="p-2 rounded focus:outline-none"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <svg
                width="28"
                height="28"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-4 px-8 mt-8">
            <button
              onClick={(e) => {
                setMenuOpen(false);
                onNav("landing")(e);
              }}
              className=" text-sm text-black hover:underline py-2 bg-transparent border-none text-left"
            >
              Home
            </button>
            <button
              onClick={(e) => {
                setMenuOpen(false);
                onNav("whychoose")(e);
              }}
              className=" text-sm text-black hover:underline py-2 bg-transparent border-none text-left"
            >
              Why CodeCureAI?
            </button>
            <button
              onClick={(e) => {
                setMenuOpen(false);
                onNav("features")(e);
              }}
              className=" text-sm text-black hover:underline py-2 bg-transparent border-none text-left"
            >
              Features
            </button>
            <button
              onClick={(e) => {
                setMenuOpen(false);
                onNav("howitworks")(e);
              }}
              className=" text-sm text-black hover:underline py-2 bg-transparent border-none text-left"
            >
              How It Works
            </button>
            <button
              onClick={(e) => {
                setMenuOpen(false);
                onNav("contact")(e);
              }}
              className=" text-sm text-black hover:underline py-2 bg-transparent border-none text-left"
            >
              Contact
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onTryNow();
              }}
              className="mt-8 bg-[#8e9c78] font-semibold px-4 py-2 rounded-full text-white text-sm shadow hover:bg-[#4a5638] transition text-center"
              style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)" }}
            >
              Try Now
            </button>
          </nav>
        </div>
      </div>
      {/* Overlay when menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
}
