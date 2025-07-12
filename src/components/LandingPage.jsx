import React from "react";
import { motion } from "framer-motion";
import Code from "../../public/Code.jpg";
import MainNavbar from "./MainNavbar";

export default function LandingPage() {
  return (
    <motion.div
      className="min-h-screen bg-white overflow-x-hidden px-6 md:px-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Top Header */}
      <motion.div
        className="w-full flex justify-between items-center px-2 pt-7 pb-2 md:px-10"
        style={{ position: "relative", zIndex: 30 }}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      >
        <div className="text-3xl font-sans font-normal text-black">
          CodeCureAI
        </div>
        {/* Desktop Learn More button */}
      </motion.div>

      <motion.h1
        className="
          w-full text-center font-medium text-black
          text-2xl xs:text-3xl sm:text-4xl md:text-6xl lg:text-8xl
          leading-[1.1] tracking-tight mb-8 mt-10 md:mt-16 lg:mt-10
        "
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
      >
        <span>Review code Instantly </span>
        <br />
        <span>
          with <span style={{ color: "#8e9c78" }}>CodeCureAI</span>
        </span>
      </motion.h1>

      <main className="flex flex-col items-center pb-20">
        <div
          className="relative w-full flex justify-center mt-16 md:mt-32 mb-16"
          style={{ height: "370px" }}
        >
          {/* Green rounded rectangle background */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[90vw] h-[320px] md:w-[98vw] md:h-[350px] bg-[#8d9a7b] rounded-[36px] md:rounded-[48px] z-0"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          ></motion.div>
          {/* Device mockup: phone on mobile, laptop on desktop */}
          <motion.div
            className="
              absolute left-1/2 -translate-x-1/2 bottom-0
              z-10
              w-[220px] h-[420px] border-t-[10px] border-l-[10px] border-r-[10px] rounded-t-[28px]
              md:w-[900px] md:h-[500px] md:border-t-[18px] md:border-l-[18px] md:border-r-[18px] md:rounded-t-[40px]
              border-black
              bg-white
              shadow-2xl
              overflow-hidden
              flex items-center justify-center
            "
            style={{
              boxShadow: "0 8px 40px 0 rgba(0,0,0,0.18)",
              borderBottom: "none",
            }}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          >
            <motion.img
              src={Code}
              alt="Code Review Dashboard"
              className="w-full h-full object-cover"
              style={{ objectFit: "cover" }}
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 1.0 }}
            />
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}
