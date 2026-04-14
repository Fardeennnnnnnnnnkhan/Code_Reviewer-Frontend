import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import BlurReveal from "./BlurReveal";
import VariableProximity from "./UI/VariableProximity";

export default function WhyChoose() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  return (
    <section className="w-full mx-auto px-4 md:px-12 py-10">
      <div className="border-t border-gray-200 w-full mb-12"></div>
      <BlurReveal stagger={true} className="flex flex-col items-center justify-center text-center">
        <div className="text-[#8e9c78] text-md  mb-8 mt-2">Specs</div>
        <h2 className="text-4xl md:text-7xl mt-2  font-normal text-black mb-8">
          Why Choose CodeCureAI?
        </h2>
        <p 
          ref={containerRef} 
          className="text-lg md:text-2xl text-gray-500 mb-10 max-w-3xl relative"
        >
          <VariableProximity
            label="Powered by Gemini 2.0 Flash"
            className="bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#FF61A6] bg-clip-text text-transparent inline-block"
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 900, 'opsz' 40"
            containerRef={containerRef}
            radius={80}
            falloff="linear"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          />
          <VariableProximity
            label=", CodeCureAI delivers lightning-fast, highly accurate code reviews using the latest in AI technology. Instantly spot bugs, optimize performance, and receive actionable suggestions tailored to your codebase. "
            className="inline"
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 900, 'opsz' 40"
            containerRef={containerRef}
            radius={80}
            falloff="linear"
          />
          <VariableProximity
            label="Let AI supercharge your productivity and code quality today."
            className="text-[#8e9c78] font-semibold inline"
            fromFontVariationSettings="'wght' 600, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            containerRef={containerRef}
            radius={80}
            falloff="linear"
          />
        </p>
        <motion.button
          className="bg-[#eaf4d7] text-black font-semibold px-10 py-4 rounded-full text-lg shadow-none hover:bg-[#d6eac0] transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/review")}
        >
          Discover More
        </motion.button>
      </BlurReveal>
    </section>
  );
}
