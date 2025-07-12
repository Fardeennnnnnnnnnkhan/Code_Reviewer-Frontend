import React from "react";

export default function WhyChoose() {
  return (
    <section className="w-full mx-auto h-[60vh] px-4 md:px-12 py-10">
      <div className="border-t border-gray-200 w-full mb-12"></div>
      <div className="flex flex-col items-center justify-center text-center">
        <div className="text-[#8e9c78] text-md  mb-8 mt-2">Specs</div>
        <h2 className="text-4xl md:text-7xl mt-2  font-normal text-black mb-8">
          Why Choose CodeCureAI?
        </h2>
        <p className="text-lg md:text-2xl text-gray-500 mb-10 max-w-3xl">
          You need a solution that keeps up. That’s why we developed
          CodeCureAI. A developer-friendly approach to streamline your
          workflow.
        </p>
        <button className="bg-[#eaf4d7] text-black font-semibold px-10 py-4 rounded-full text-lg shadow-none hover:bg-[#d6eac0] transition">
          Discover More
        </button>
      </div>
    </section>
  );
}
