"use client";

import { useState, useEffect } from "react";
import { Loader2, Search, Copy, Download, Check, Sparkles, FileText, Hash, Image as ImageIcon, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { quickMatches } from "@/lib/demoData";

type ContentOutput = {
  article: string;
  twitter: string;
  instagram: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"article" | "twitter" | "instagram">("article");
  const [output, setOutput] = useState<ContentOutput | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  
  const [agentStatus, setAgentStatus] = useState<string[]>([]);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);

  const AGENTS = [
    { name: "Research Agent", action: "Scraping stats & recent form..." },
    { name: "Writer Agent", action: "Drafting multi-format content..." },
    { name: "Editor Agent", action: "Fact-checking & refining tone..." },
    { name: "Formatter Agent", action: "Structuring output for UI..." }
  ];

  const handleGenerate = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = customQuery || query;
    if (!searchQuery) return;

    if (customQuery && query !== customQuery) {
      setQuery(customQuery);
    }

    setIsGenerating(true);
    setOutput(null);
    setAgentStatus([]);
    setCurrentAgentIndex(0);

    // Simulate agent progress visually
    const interval = setInterval(() => {
      setCurrentAgentIndex((prev) => {
        if (prev < AGENTS.length - 1) {
          setAgentStatus((status) => [...status, AGENTS[prev].action]);
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();
      
      clearInterval(interval);
      setAgentStatus((status) => [...status, AGENTS[3].action, "Content ready!"]);
      setCurrentAgentIndex(4);
      
      setOutput(data);
    } catch (error) {
      console.error("Failed to generate content:", error);
      setAgentStatus((status) => [...status, "Error generating content."]);
      clearInterval(interval);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const element = document.createElement("a");
    const file = new Blob([output[activeTab]], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `cricai-${activeTab}-${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <main className="min-h-screen bg-[#030712] text-neutral-50 font-sans selection:bg-emerald-500/30 overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-xl tracking-tight text-white">CricAI</span>
          </motion.div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 space-y-6"
        >
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter bg-gradient-to-br from-white via-emerald-100 to-emerald-500 text-transparent bg-clip-text pb-2">
            From Stats to Story<br />in Seconds.
          </h1>
          <p className="text-lg text-neutral-400 font-medium max-w-xl mx-auto">
            The ultimate AI-powered sports content engine. Instantly generate articles, tweets, and Instagram captions.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <form onSubmit={handleGenerate} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50"></div>
            <div className="relative flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-2xl focus-within:border-emerald-500/50 transition-all">
              <Search className="w-6 h-6 text-emerald-400/70 ml-3" />
              <input
                type="text"
                placeholder="Enter match (e.g., 'MI vs RR') or player name..."
                className="w-full bg-transparent border-none outline-none text-lg text-white px-4 placeholder:text-neutral-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isGenerating}
              />
              <button
                type="submit"
                disabled={isGenerating || !query}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Quick Selectors */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-16 flex flex-wrap justify-center gap-4"
        >
          {quickMatches.map((match) => (
            <button
              key={match.id}
              onClick={() => handleGenerate(undefined, match.title)}
              disabled={isGenerating}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 rounded-full pr-4 pl-1 py-1 transition-all group"
            >
              <div className="bg-black/50 rounded-full px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-emerald-400 border border-white/5">
                <Calendar className="w-3 h-3" />
                {match.label}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{match.title}</span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">{match.status}</span>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Agent Activity Log */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1 border border-white/10 bg-black/30 backdrop-blur-md rounded-2xl p-6 h-[500px] overflow-y-auto custom-scrollbar shadow-xl"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Live Generation Log
            </h3>
            
            <div className="space-y-6">
              <AnimatePresence>
                {AGENTS.map((agent, index) => {
                  const isActive = currentAgentIndex === index && isGenerating;
                  const isDone = currentAgentIndex > index || (!isGenerating && output !== null);
                  
                  return (
                    <motion.div 
                      key={agent.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: isDone ? 1 : isActive ? 1 : 0.4, y: 0 }}
                      className="flex gap-4"
                    >
                      <div className="relative flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isDone ? "bg-emerald-500 border-emerald-500" : isActive ? "bg-transparent border-emerald-400" : "bg-neutral-800 border-neutral-700"}`}>
                          {isActive && <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />}
                          {isDone && <Check className="w-3 h-3 text-black" />}
                        </div>
                        {index < AGENTS.length - 1 && (
                          <div className={`w-0.5 h-full mt-2 rounded-full ${isDone ? "bg-emerald-500/50" : "bg-white/5"}`}></div>
                        )}
                      </div>
                      <div className="pb-4 pt-0.5">
                        <p className={`font-semibold ${isDone || isActive ? "text-white" : "text-neutral-500"}`}>{agent.name}</p>
                        <p className="text-sm text-neutral-400 mt-1">
                          {isDone ? "Completed" : isActive ? agent.action : "Waiting in queue..."}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 border border-white/10 bg-black/30 backdrop-blur-md rounded-2xl overflow-hidden min-h-[500px] flex flex-col shadow-xl"
          >
            {output ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col h-full"
              >
                <div className="flex border-b border-white/10 bg-black/40">
                  <button
                    onClick={() => setActiveTab("article")}
                    className={`flex-1 py-4 px-4 flex justify-center items-center gap-2 font-semibold transition-all ${activeTab === "article" ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/10" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
                  >
                    <FileText className="w-4 h-4" />
                    Article
                  </button>
                  <button
                    onClick={() => setActiveTab("twitter")}
                    className={`flex-1 py-4 px-4 flex justify-center items-center gap-2 font-semibold transition-all ${activeTab === "twitter" ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/10" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
                  >
                    <Hash className="w-4 h-4" />
                    Twitter Thread
                  </button>
                  <button
                    onClick={() => setActiveTab("instagram")}
                    className={`flex-1 py-4 px-4 flex justify-center items-center gap-2 font-semibold transition-all ${activeTab === "instagram" ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/10" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    Instagram Post
                  </button>
                </div>
                
                <div className="p-6 flex-1 bg-gradient-to-b from-black/20 to-transparent flex flex-col">
                  <div className="flex justify-end gap-3 mb-6">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all active:scale-95"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 rounded-lg transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {activeTab === "article" && (
                      <div className="prose prose-invert prose-emerald max-w-none prose-p:leading-relaxed prose-headings:font-bold">
                        <ReactMarkdown>{output.article}</ReactMarkdown>
                      </div>
                    )}

                    {activeTab === "twitter" && (
                      <div className="max-w-md mx-auto space-y-4">
                        {output.twitter.split("\\n\\n").map((tweet, i) => (
                          <div key={i} className="bg-black/40 border border-white/10 p-5 rounded-2xl relative">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-black">
                                CA
                              </div>
                              <div>
                                <p className="font-bold text-white text-sm">CricAI Bot</p>
                                <p className="text-neutral-500 text-xs">@cric_ai</p>
                              </div>
                              <Hash className="w-4 h-4 text-[#1DA1F2] absolute top-5 right-5" />
                            </div>
                            <p className="text-white whitespace-pre-wrap">{tweet}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "instagram" && (
                      <div className="max-w-sm mx-auto bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                           <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center font-bold text-white text-xs">
                              CA
                            </div>
                            <p className="font-bold text-white text-sm">cricai_official</p>
                           </div>
                        </div>
                        <div className="aspect-square bg-gradient-to-br from-neutral-900 to-black flex items-center justify-center p-8 text-center border-b border-white/5">
                           <ImageIcon className="w-12 h-12 text-white/20 mb-4" />
                        </div>
                        <div className="p-4">
                          <p className="text-white text-sm whitespace-pre-wrap">
                            <span className="font-bold mr-2">cricai_official</span>
                            {output.instagram}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 p-8 text-center h-full">
                {isGenerating ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                      <Loader2 className="w-16 h-16 animate-spin text-emerald-400 mb-6 relative z-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Generating Content</h2>
                    <p className="text-lg text-emerald-400 font-medium">{agentStatus[agentStatus.length - 1]}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                      <Sparkles className="w-10 h-10 text-neutral-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Ready to generate</h2>
                    <p className="text-lg max-w-md">Enter a query or select a quick match above to unleash the AI agents.</p>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
