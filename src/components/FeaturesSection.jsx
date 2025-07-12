import React from "react";

const features = [
  {
    icon: (
      <svg
        width="40"
        height="40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="black"
        strokeWidth="2"
        className="inline-block"
      >
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          stroke="black"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M8 9h8M8 13h5"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Amplify Code Insights",
    desc: "Unlock AI-powered code analysis to reveal bugs, code smells, and improvement opportunities instantly.",
  },
  {
    icon: (
      <svg
        width="40"
        height="40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="black"
        strokeWidth="2"
        className="inline-block"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="black"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M8 15c1.333-2 6.667-2 8 0"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="9" cy="10" r="1" fill="black" />
        <circle cx="15" cy="10" r="1" fill="black" />
      </svg>
    ),
    title: "Seamless Collaboration",
    desc: "Share reviews and suggestions with your team, ensuring consistent code quality across every project.",
  },
  {
    icon: (
      <svg
        width="40"
        height="40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="black"
        strokeWidth="2"
        className="inline-block"
      >
        <rect
          x="7"
          y="11"
          width="10"
          height="7"
          rx="2"
          stroke="black"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M12 7a2 2 0 0 1 2 2v2h-4V9a2 2 0 0 1 2-2z"
          stroke="black"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
    title: "Security First",
    desc: "Detect vulnerabilities and receive actionable security tips to keep your codebase safe and robust.",
  },
  {
    icon: (
      <svg
        width="40"
        height="40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="black"
        strokeWidth="2"
        className="inline-block"
      >
        <path
          d="M4 17V7m4 10V11m4 6V13m4 4V9m4 12H4"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Visualize Progress",
    desc: "Generate clear, visual reports that track your code quality and improvements over time.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full mx-auto  px-6 md:px-16 py-10">
      <div className="mb-16">
        <div className="text-[#8e9c78] text-lg  mb-8">Benefits</div>
        <h2 className="text-4xl md:text-7xl mb-14">We’ve cracked the code.</h2>
        <p className="text-2xl text-gray-500 mb-6">
          CodeCureAI provides real insights, without the data overload.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {features.map((f, i) => (
          <div
            key={i}
            className="border-t border-gray-100 pt-10 pl-2 md:pl-4 flex flex-col items-start bg-transparent shadow-none rounded-none h-full"
          >
            <div className="mb-6">{f.icon}</div>
            <div className="text-2xl md:text-3xl   mb-4 text-black text-left">
              {f.title}
            </div>
            <div className="text-xl text-gray-500 N text-left">
              {f.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
