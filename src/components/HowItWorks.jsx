import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Get Started Instantly",
    desc: "With CodeCursorAI’s intuitive onboarding, you’re up and running in minutes—no complex setup required.",
  },
  {
    number: "02",
    title: "Customize Your Experience",
    desc: "Tailor CodeCursorAI to your workflow and coding standards for personalized, actionable AI reviews.",
  },
  {
    number: "03",
    title: "Accelerate Your Success",
    desc: "Leverage CodeCursorAI’s insights to improve code quality and achieve your development goals faster.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const numberVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HowItWorks() {
  const navigate = useNavigate();
  return (
    <section className="w-full  mx-auto px-4 md:px-12 py-24">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
        <h2 className="text-4xl md:text-6xl font-serif font-normal text-black mb-8 md:mb-0">
          Map Your Success
        </h2>
        <button
          onClick={() => navigate("/review")}
          className="self-start md:self-auto bg-[#eaf4d7] text-black font-semibold px-8 py-3 rounded-full text-lg shadow-none hover:bg-[#d6eac0] transition"
        >
          Discover More
        </button>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className={`flex flex-col border-t border-gray-200 items-start pt-12 pb-8 px-2 md:px-8 ${
              i < steps.length - 1 ? " " : ""
            }`}
            variants={cardVariants}
          >
            <motion.div
              className="text-9xl text-gray-400 mb-8"
              variants={numberVariants}
            >
              {step.number}
            </motion.div>
            <div className="text-2xl  font-normal text-black mb-4">
              {step.title}
            </div>
            <div className="text-lg text-gray-500 ">{step.desc}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
