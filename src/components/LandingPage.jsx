import React from "react";
import { motion } from "framer-motion";
import BlurText from "./UI/BlurText";
import TextType from "./UI/TextType";
import Galaxy from "./UI/Galaxy";
import Code from "../../public/newCode.png"; 
import RotatingText from "./UI/RotatingText";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate= useNavigate()
  return (
    <div className=" relative min-h-screen bg-[#fafaf9] overflow-x-hidden">
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        {/* Soft light gradient overlay using olive green tones */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#fafaf9] to-[#edf0e6] pointer-events-none"></div>
        
        {/* Light Minimal Galaxy Layer: We invert the colors so bright stars become elegant dark particles */}
        <div className="absolute inset-0 pointer-events-auto" style={{ filter: "invert(1) hue-rotate(180deg)", opacity: 0.25 }}>
          <Galaxy
            hueShift={120} // Creates soft colored particles matching the olive tone after hue-rotate
            density={1.5}
            starSpeed={0.8}
            glowIntensity={0.6}
            focal={[0.5, 0.5]}
            transparent={true}
            mouseInteraction={true}
            mouseRepulsion={true}
            repulsionStrength={2.5}
            twinkleIntensity={0.4}
            rotationSpeed={0.05}
            autoCenterRepulsion={0}
          />
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#8d9a7b33_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>
      </div>

      {/* Top Header */}
      <motion.nav
        className="relative z-30 w-full flex justify-between items-center px-6 md:px-16 pt-7 pb-2"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      >
        <div className="text-3xl font-normal text-black tracking-tight flex items-center">
          <BlurText
            text="CodeCureAI"
            delay={50}
            animateBy="words"
            direction="top"
            className="text-2xl"
          />
        </div>
      </motion.nav>

      {/* Main Hero Content */}
      <main className="relative z-20 flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 md:px-16 pt-20 md:pt-24 lg:pt-32 pb-20 max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
        
        {/* Left Side: Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 mb-20 lg:mb-0 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="px-4 py-1.5 rounded-full border border-[#8d9a7b]/30 bg-[#8d9a7b]/10 backdrop-blur-md shadow-[0_4px_15px_rgba(141,154,123,0.1)]"
          >
            <span className="text-xs sm:text-sm font-medium text-[#4a5638] tracking-wider uppercase">✨ Next-Gen Code Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal leading-[1.1] tracking-tight text-black flex flex-col items-center lg:items-start gap-3 sm:gap-4"
          >
            <div>Ship flawless</div>
            <RotatingText
              texts={['Features', 'Functions', 'Frameworks', 'Codebases', 'Software']}
              mainClassName="inline-flex text-semi px-4 sm:px-6 text-[#8E9C78] overflow-hidden py-1 sm:py-2 md:py-2 justify-center "
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2500}
              splitBy="characters"
              auto
              loop
            />
            <div>at Superhuman Speed.</div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed font-light mt-2"
          >
            Stop merging tech debt. CodeCureAI autonomously hunts down hidden vulnerabilities, refactors spaghetti logic, and enforces elite architectural standards—acting as your senior pair programmer that never sleeps.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-8 py-4 rounded-xl md:rounded-2xl bg-[#8d9a7b] text-white font-normal tracking-wide text-lg relative overflow-hidden shadow-[0_10px_20px_rgba(141,154,123,0.3)] hover:shadow-[0_15px_25px_rgba(141,154,123,0.4)] hover:bg-[#7b8969] transition-all duration-300 flex items-center gap-2"
            onClick={() => navigate("/review")}
          >
            Cure Your Codebase
            <svg className="w-5 h-5 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </motion.button>
        </div>

        {/* Right Side: Code Preview Card */}
        <div className="w-full sm:w-[85%] lg:w-[45%] relative z-10 perspective-1000">
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, delay: 0.7, type: "spring", stiffness: 80 }}
            whileHover={{ y: -5, boxShadow: "0 40px 80px -12px rgba(141,154,123,0.3), inset 0 1px 1px rgba(255,255,255,0.8)" }}
            className="w-full relative rounded-2xl md:rounded-3xl border border-[#8d9a7b]/20 bg-white/90 backdrop-blur-2xl p-5 sm:p-6 md:p-8 transition-all duration-300 transform-gpu"
            style={{
              boxShadow: "0 30px 60px -12px rgba(141,154,123,0.25), inset 0 1px 1px rgba(255,255,255,0.5)",
            }}
          >
            {/* Card Header (MacOS buttons) */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[0_0_8px_rgba(255,95,86,0.2)]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[0_0_8px_rgba(255,189,46,0.2)]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[0_0_8px_rgba(39,201,63,0.2)]"></div>
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 font-mono tracking-widest uppercase">Intelligent Audit</div>
            </div>
            
            {/* Code Content */}
            <div className="font-mono text-[11px] sm:text-xs md:text-[14px] leading-relaxed text-gray-700 space-y-[6px] overflow-x-hidden">
                <div className="flex hover:bg-gray-50 px-2 -mx-2 rounded transition-colors group">
                    <span className="text-gray-400 mr-4 w-4 text-right select-none group-Hover:text-gray-500">1</span>
                    <div className="break-all"><span className="text-[#a13251]">async function</span> <span className="text-[#2c5282]">parseToken</span>(<span className="text-[#d97706]">token</span>) {"{"}</div>
                </div>
                <div className="flex hover:bg-gray-50 px-2 -mx-2 rounded transition-colors group">
                    <span className="text-gray-400 mr-4 w-4 text-right select-none group-Hover:text-gray-500">2</span>
                    <div className="pl-4 break-all"><span className="text-[#a13251]">const</span> <span className="text-[#2c5282]">data</span> <span className="text-[#059669]">=</span> <span className="text-[#a13251]">await</span> auth.<span className="text-[#2c5282]">verify</span>(token);</div>
                </div>
                {/* Diff removal line */}
                <div className="flex bg-red-50 border-l-2 border-red-400 px-2 -mx-2 group mt-2">
                    <span className="text-red-400 mr-4 w-4 text-right select-none group-Hover:text-red-500">3</span>
                    <div className="pl-4 break-all relative inline-block">
                        <span className="text-gray-500 line-through">
                            <span className="text-[#a13251] opacity-60">if</span> (data.<span className="text-[#2c5282]">role</span> <span className="text-[#059669] opacity-60">==</span> <span className="text-[#d97706] opacity-60">"admin"</span>) {"{"}
                        </span>
                    </div>
                </div>
                {/* Diff addition line */}
                <div className="flex bg-[#eaf4d7]/60 border-l-2 border-[#8d9a7b] px-2 -mx-2 group mb-2">
                    <span className="text-[#8d9a7b] mr-4 w-4 text-right select-none group-Hover:text-[#6a7556]">4</span>
                    <div className="pl-4 break-all"><span className="text-[#a13251]">if</span> (data.<span className="text-[#2c5282]">role</span> <span className="text-[#059669]">===</span> <span className="text-[#d97706]">"admin"</span>) {"{"}</div>
                </div>
                <div className="flex hover:bg-gray-50 px-2 -mx-2 rounded transition-colors group">
                    <span className="text-gray-400 mr-4 w-4 text-right select-none group-Hover:text-gray-500">5</span>
                    <div className="pl-8 break-all"><span className="text-[#2c5282]">grantRootAccess</span>(data);</div>
                </div>
                <div className="flex hover:bg-gray-50 px-2 -mx-2 rounded transition-colors group">
                    <span className="text-gray-400 mr-4 w-4 text-right select-none group-Hover:text-gray-500">6</span>
                    <div className="pl-4 break-all">{"}"}</div>
                </div>
                <div className="flex hover:bg-gray-50 px-2 -mx-2 rounded transition-colors group">
                    <span className="text-gray-400 mr-4 w-4 text-right select-none group-Hover:text-gray-500">7</span>
                    <div className="pl-4 break-all"><span className="text-[#a13251]">return</span> <span className="text-[#2c5282]">data</span>.<span className="text-[#2c5282]">permissions</span>;</div>
                </div>
                <div className="flex hover:bg-gray-50 px-2 -mx-2 rounded transition-colors group">
                    <span className="text-gray-400 mr-4 w-4 text-right select-none group-Hover:text-gray-500">8</span>
                    <div className="">{"}"}</div>
                </div>
            </div>

            {/* Floating pop-over element */}
            <motion.div
               animate={{ y: [0, -8, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -right-4 -bottom-6 sm:-right-8 sm:-bottom-8 w-56 sm:w-64 rounded-xl border border-gray-100 bg-white/95 backdrop-blur-xl p-3 sm:p-4 shadow-[0_20px_40px_-5px_rgba(141,154,123,0.3)] z-20"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#eaf4d7] flex items-center justify-center text-[#4a5638] shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h4 className="text-[11px] sm:text-xs font-semibold text-gray-800 tracking-wide">Critical Security Patch</h4>
                </div>
                <p className="text-[10px] sm:text-[11px] text-gray-500 leading-relaxed mt-1">
                    Replaced loose equality to prevent privilege escalation via type coercion in authentication checks.
                </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
