import React, { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "../../src/App.css";
// import { act } from "react";

// Statistics calculation functions
const calculateStatistics = (responses) => {
  const stats = {
    gemini: analyzeResponse(responses.gemini, "Gemini"),
    cohere: analyzeResponse(responses.cohere, "Cohere"),
    openai: analyzeResponse(responses.openai, "OpenAI"),
  };

  // Calculate comparative metrics
  const wordCounts = [
    stats.gemini.wordCount,
    stats.cohere.wordCount,
    stats.openai.wordCount,
  ];
  const avgWordCount =
    wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length;

  const detailScores = [
    stats.gemini.detailScore,
    stats.cohere.detailScore,
    stats.openai.detailScore,
  ];
  const avgDetailScore =
    detailScores.reduce((a, b) => a + b, 0) / detailScores.length;

  // Find best performing model
  const bestModel = Object.entries(stats).reduce((best, [model, data]) => {
    const currentScore = data.overallScore;
    const bestScore = best ? stats[best].overallScore : 0;
    return currentScore > bestScore ? model : best;
  }, null);

  return {
    individual: stats,
    comparative: {
      averageWordCount: Math.round(avgWordCount),
      averageDetailScore: Math.round(avgDetailScore * 100) / 100,
      bestModel: bestModel,
      totalResponses: 3,
    },
  };
};

const analyzeResponse = (response, modelName) => {
  if (!response || response.trim() === "") {
    return {
      model: modelName,
      wordCount: 0,
      sentenceCount: 0,
      detailScore: 0,
      technicalScore: 0,
      overallScore: 0,
      hasCodeExamples: false,
      hasImprovements: false,
      classification: "No Response",
    };
  }

  const words = response.split(/\s+/).filter((word) => word.length > 0);
  const sentences = response
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim().length > 0);
  const wordCount = words.length;
  const sentenceCount = sentences.length;

  // IMPROVED: More balanced detail score calculation
  // Base score from content length (more generous)
  const baseDetailScore = Math.min(8, wordCount / 30 + sentenceCount / 3);

  // Bonus for structured content (headings, sections)
  const structureBonus = (response.match(/#{1,6}\s/g) || []).length * 0.5;
  const listBonus = (response.match(/[-*+]\s/g) || []).length * 0.2;

  const detailScore = Math.min(
    10,
    baseDetailScore + structureBonus + listBonus
  );

  // IMPROVED: More comprehensive technical terms
  const technicalTerms = [
    // Basic programming terms
    "function",
    "variable",
    "algorithm",
    "complexity",
    "performance",
    "optimization",
    "bug",
    "error",
    "exception",
    "async",
    "await",
    "promise",
    "callback",
    "recursion",
    "iteration",
    "loop",
    "condition",
    "statement",
    "expression",
    "scope",
    "closure",
    "prototype",
    "inheritance",
    "polymorphism",
    "encapsulation",

    // Advanced technical terms
    "time complexity",
    "space complexity",
    "big o",
    "o(n)",
    "o(1)",
    "o(log n)",
    "memory",
    "heap",
    "stack",
    "garbage collection",
    "reference",
    "value",
    "mutable",
    "immutable",
    "pure function",
    "side effect",
    "dependency",

    // Modern development terms
    "typescript",
    "es6",
    "es2015",
    "arrow function",
    "destructuring",
    "spread",
    "rest",
    "template literal",
    "class",
    "module",
    "import",
    "export",
    "react",
    "vue",
    "angular",
    "framework",
    "library",
    "npm",
    "package",

    // Architecture and design patterns
    "mvc",
    "mvp",
    "mvvm",
    "singleton",
    "factory",
    "observer",
    "strategy",
    "adapter",
    "decorator",
    "facade",
    "proxy",
    "command",
    "state",

    // Quality and testing terms
    "test",
    "testing",
    "unit test",
    "integration",
    "coverage",
    "quality",
    "maintainability",
    "readability",
    "scalability",
    "reliability",
    "security",

    // Business and practical terms
    "business",
    "value",
    "roi",
    "cost",
    "benefit",
    "implementation",
    "practical",
    "user experience",
    "usability",
    "accessibility",
    "performance",
    "efficiency",
  ];

  const technicalMentions = technicalTerms.filter((term) =>
    response.toLowerCase().includes(term.toLowerCase())
  ).length;

  // IMPROVED: More balanced technical score
  const baseTechnicalScore = Math.min(8, technicalMentions / 3);
  const codeBlockBonus = response.includes("```") ? 1.5 : 0;
  const inlineCodeBonus = (response.match(/`[^`]+`/g) || []).length * 0.3;

  const technicalScore = Math.min(
    10,
    baseTechnicalScore + codeBlockBonus + inlineCodeBonus
  );

  // Check for code examples (more comprehensive)
  const hasCodeExamples =
    response.includes("```") ||
    response.includes("`") ||
    /function\s+\w+|const\s+\w+|let\s+\w+|var\s+\w+|class\s+\w+/.test(response);

  // Check for improvement suggestions (more comprehensive)
  const hasImprovements =
    /improve|better|optimize|refactor|suggest|recommend|consider|should|could|would|enhance|upgrade|fix|resolve|address/.test(
      response.toLowerCase()
    );

  // IMPROVED: Better classification detection
  let classification = "Good";
  const responseLower = response.toLowerCase();

  if (
    responseLower.includes("excellent") ||
    responseLower.includes("perfect") ||
    responseLower.includes("outstanding") ||
    responseLower.includes("great") ||
    responseLower.includes("well-written")
  ) {
    classification = "Excellent";
  } else if (
    responseLower.includes("needs improvement") ||
    responseLower.includes("problem") ||
    responseLower.includes("issue") ||
    responseLower.includes("bug") ||
    responseLower.includes("error") ||
    responseLower.includes("fix")
  ) {
    classification = "Needs Improvement";
  }

  // IMPROVED: Much more balanced scoring system
  // Base scores are now more generous
  const baseScore = 40; // Start with 40 points instead of 0

  // Content quality (0-30 points)
  const contentScore = Math.min(
    30,
    detailScore * 2 + // Detail contributes more
      technicalScore * 1.5 + // Technical depth
      (wordCount > 100 ? 5 : 0) + // Length bonus
      (sentenceCount > 5 ? 3 : 0) // Structure bonus
  );

  // Feature bonuses (0-20 points)
  const featureScore =
    (hasCodeExamples ? 8 : 0) +
    (hasImprovements ? 8 : 0) +
    (response.includes("```") ? 4 : 0); // Code blocks are valuable

  // Classification bonus (0-10 points)
  const classificationBonus =
    classification === "Excellent" ? 10 : classification === "Good" ? 5 : 0;

  // MODEL-SPECIFIC SCORING ADJUSTMENTS
  // This ensures different models get different scores based on their specializations
  let modelBonus = 0;

  if (modelName === "Gemini") {
    // Gemini excels at comprehensive analysis - reward detailed, educational content
    const comprehensiveBonus =
      (response.match(/##|###|####/g) || []).length * 2 + // Structured analysis
      (response.includes("Analysis") || response.includes("Summary") ? 3 : 0) +
      (response.includes("Learning") || response.includes("Educational")
        ? 2
        : 0);
    modelBonus = Math.min(8, comprehensiveBonus);
  } else if (modelName === "Cohere") {
    // Cohere excels at technical depth - reward technical innovation
    const technicalBonus =
      (response.includes("optimization") || response.includes("performance")
        ? 3
        : 0) +
      (response.includes("architecture") || response.includes("scalability")
        ? 3
        : 0) +
      (response.includes("innovation") || response.includes("cutting-edge")
        ? 2
        : 0);
    modelBonus = Math.min(8, technicalBonus);
  } else if (modelName === "OpenAI") {
    // GPT-4 excels at practical implementation - reward business value
    const businessBonus =
      (response.includes("business") || response.includes("value") ? 3 : 0) +
      (response.includes("practical") || response.includes("implementation")
        ? 3
        : 0) +
      (response.includes("ROI") || response.includes("cost") ? 2 : 0);
    modelBonus = Math.min(8, businessBonus);
  }

  const overallScore = Math.min(
    100,
    Math.round(
      baseScore + contentScore + featureScore + classificationBonus + modelBonus
    )
  );

  return {
    model: modelName,
    wordCount,
    sentenceCount,
    detailScore: Math.round(detailScore * 100) / 100,
    technicalScore: Math.round(technicalScore * 100) / 100,
    overallScore,
    hasCodeExamples,
    hasImprovements,
    classification,
    technicalMentions,
  };
};

// Statistics View Component
const StatisticsView = ({ statistics }) => {
  if (!statistics) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No Analytics Available
        </h3>
        <p className="text-slate-600 text-center">
          Run a code review to see detailed performance analytics
        </p>
      </div>
    );
  }

  const { individual, comparative } = statistics;
  const models = Object.values(individual);

  return (
    <div className="space-y-6">
      {/* Best Model Highlight */}
      <div className="bg-slate-900 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Best Performing Model</h3>
              <p className="text-slate-300 capitalize">
                {comparative.bestModel}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {individual[comparative.bestModel]?.overallScore || 0}/100
            </div>
            <div className="text-slate-300">Overall Score</div>
          </div>
        </div>
      </div>

      {/* Model Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {models.map((model) => (
          <div
            key={model.model}
            className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                    model.model === "Gemini"
                      ? "bg-blue-600"
                      : model.model === "Cohere"
                      ? "bg-purple-600"
                      : "bg-green-600"
                  }`}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {model.model}
                  </h4>
                  <p className="text-sm text-slate-500">AI Model</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">
                  {model.overallScore}/100
                </div>
                <div className="text-sm text-slate-500">Score</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>Overall Performance</span>
                <span>{model.overallScore}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    model.model === "Gemini"
                      ? "bg-blue-600"
                      : model.model === "Cohere"
                      ? "bg-purple-600"
                      : "bg-green-600"
                  }`}
                  style={{ width: `${model.overallScore}%` }}
                ></div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-slate-500">Words</div>
                <div className="font-semibold text-slate-900">
                  {model.wordCount}
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-slate-500">Detail Score</div>
                <div className="font-semibold text-slate-900">
                  {model.detailScore}/10
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-slate-500">Technical</div>
                <div className="font-semibold text-slate-900">
                  {model.technicalScore}/10
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-slate-500">Features</div>
                <div className="flex space-x-1">
                  {model.hasCodeExamples && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Code
                    </span>
                  )}
                  {model.hasImprovements && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Tips
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Quality Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Response Quality
          </h4>
          <div className="space-y-4">
            {models.map((model) => (
              <div
                key={model.model}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      model.model === "Gemini"
                        ? "bg-blue-500"
                        : model.model === "Cohere"
                        ? "bg-purple-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-slate-700">
                    {model.model}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-slate-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(model.detailScore / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-600 w-12 text-right">
                    {model.detailScore}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Depth Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            Technical Depth
          </h4>
          <div className="space-y-4">
            {models.map((model) => (
              <div
                key={model.model}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      model.model === "Gemini"
                        ? "bg-blue-500"
                        : model.model === "Cohere"
                        ? "bg-purple-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-slate-700">
                    {model.model}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-slate-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(model.technicalScore / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-600 w-12 text-right">
                    {model.technicalScore}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-slate-50 rounded-lg p-6">
        <h4 className="font-semibold text-slate-900 mb-6 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Summary Analytics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {comparative.averageWordCount}
            </div>
            <div className="text-sm text-slate-600">Avg Words</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {comparative.averageDetailScore}
            </div>
            <div className="text-sm text-slate-600">Avg Detail Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {comparative.totalResponses}
            </div>
            <div className="text-sm text-slate-600">AI Models</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1 capitalize">
              {comparative.bestModel}
            </div>
            <div className="text-sm text-slate-600">Best Performer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Model = () => {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1;\n}`);
  const [loading, setLoading] = useState(false);
  const [geminiReview, setGeminiReview] = useState("");
  const [cohereReview, setCohereReview] = useState("");
  const [openaiReview, setOpenaiReview] = useState("");
  const [activeTab, setActiveTab] = useState("gemini"); // For AI model reviews
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  const reviewCode = async () => {
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

    try {
      // Call both endpoints simultaneously
      const [geminiRes, cohereRes, openaiRes] = await Promise.all([
        axios.post(
          "https://code-reviewer-by-fardeen.onrender.com/ai/get-review",
          { code }
        ),
        axios.post("http://localhost:3000/ai/get-cohere-review", { code }),
        axios.post("http://localhost:3000/ai/get-openai-review", { code }),
      ]);

      setGeminiReview(geminiRes.data.response);
      setCohereReview(cohereRes.data.response);
      setOpenaiReview(openaiRes.data.response);

      // Calculate statistics after getting all responses
      const responses = {
        gemini: geminiRes.data.response,
        cohere: cohereRes.data.response,
        openai: openaiRes.data.response,
      };
      const calculatedStats = calculateStatistics(responses);
      setStatistics(calculatedStats);
    } catch (err) {
      Toastify({
        text: "Failed to fetch reviews",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff4d4f",
      }).showToast();
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Code Review Assistant
              </h1>
              <p className="text-slate-600 mt-1">
                Get comprehensive code reviews from multiple AI models
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Input Section */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Code Input
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                  <span className="text-slate-300 text-sm font-medium">
                    JavaScript
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">
                      Lines: {code.split("\n").length}
                    </span>
                    <span className="text-xs text-slate-400">
                      Chars: {code.length}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <Editor
                    value={code}
                    onValueChange={setCode}
                    highlight={(code) =>
                      prism.highlight(
                        code,
                        prism.languages.javascript,
                        "javascript"
                      )
                    }
                    padding={0}
                    style={{
                      fontFamily:
                        '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                      fontSize: 14,
                      background: "transparent",
                      minHeight: 300,
                      outline: "none",
                      color: "#e2e8f0",
                      lineHeight: "1.6",
                    }}
                  />
                </div>
              </div>
              <button
                onClick={reviewCode}
                disabled={loading}
                className="mt-6 w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing Code...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Analyze Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Reviews Section */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                AI Reviews
              </h2>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("gemini")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "gemini"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Gemini
                </button>
                <button
                  onClick={() => setActiveTab("cohere")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "cohere"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Cohere
                </button>
                <button
                  onClick={() => setActiveTab("gpt")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "gpt"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  GPT-4
                </button>
              </nav>
            </div>

            <div className="p-6 min-h-[400px] max-h-[600px] overflow-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mt-4">
                    Analyzing your code...
                  </h3>
                  <p className="text-slate-600 mt-2">
                    Getting insights from AI models
                  </p>
                </div>
              ) : activeTab === "gemini" ? (
                <div className="prose prose-slate max-w-none">
                  {geminiReview ? (
                    <Markdown rehypePlugins={[rehypeHighlight]}>
                      {geminiReview}
                    </Markdown>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 mb-2">
                        No review available
                      </h3>
                      <p className="text-slate-600">
                        Run a code analysis to see Gemini's review
                      </p>
                    </div>
                  )}
                </div>
              ) : activeTab === "cohere" ? (
                <div className="prose prose-slate max-w-none">
                  {cohereReview ? (
                    <Markdown rehypePlugins={[rehypeHighlight]}>
                      {cohereReview}
                    </Markdown>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 mb-2">
                        No review available
                      </h3>
                      <p className="text-slate-600">
                        Run a code analysis to see Cohere's review
                      </p>
                    </div>
                  )}
                </div>
              ) : activeTab === "gpt" ? (
                <div className="prose prose-slate max-w-none">
                  {openaiReview ? (
                    <Markdown rehypePlugins={[rehypeHighlight]}>
                      {openaiReview}
                    </Markdown>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 mb-2">
                        No review available
                      </h3>
                      <p className="text-slate-600">
                        Run a code analysis to see GPT-4's review
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Performance Analytics
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-slate-600">
                    Real-time metrics
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <StatisticsView statistics={statistics} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Model;
