"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Navigation from "@/components/Navigation";
import AgentActivity from "@/components/AgentActivity";
import MatchPreview from "@/components/MatchPreview";
import PlayerH2H from "@/components/PlayerH2H";
import Predictor from "@/components/Predictor";
import FantasyXI from "@/components/FantasyXI";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { quickMatches } from "@/lib/demoData";

type ContentOutput = {
  article: string;
  twitter: string;
  instagram: string;
  meme: string;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"preview" | "h2h" | "predictor" | "fantasy">("preview");
  
  // Match Preview State
  const [query, setQuery] = useState("");
  const [isPostMatch, setIsPostMatch] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [output, setOutput] = useState<ContentOutput | null>(null);

  const agentTasks = [
    { name: "Research Agent", action: "Fetching real-time stats & head-to-head records..." },
    { name: "Writer Agent", action: "Drafting article and injecting factual data..." },
    { name: "Editor Agent", action: "Fact-checking claims and adding sources..." },
    { name: "Formatter Agent", action: "Generating social media threads..." }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsGenerating(true);
    setIsComplete(false);
    setOutput(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, isPostMatch }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setOutput(data);
    } catch (error) {
      console.error("Failed to generate:", error);
      setOutput({
        article: "**[Error]** Failed to generate content. Check API key or logs.",
        twitter: "Error generating content.",
        instagram: "Error generating content.",
        meme: "Error generating meme."
      });
    } finally {
      setIsGenerating(false);
      setIsComplete(true);
    }
  };

  const handleQuickMatch = (matchTitle: string) => {
    setQuery(matchTitle);
    // Auto-submit after setting query by calling a synthetic event or just calling fetch
    // To keep it simple, we just set the query and user clicks Generate
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/30 overflow-x-hidden relative">
      <Toaster position="top-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      
      {/* Fixed Navigation so it never hides */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-black/60 backdrop-blur-lg border-b border-white/10">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === "preview" ? (
        <ScrollExpandMedia
          mediaType="image"
          mediaSrc="https://img.ipl.com/upload/20260311/afa031ab112b67a568d8108d988defbf.webp"
          bgImageSrc="https://www.mumbaiindians.com/static-assets/images/cssimages/banner-1.jpg"
          title="CricAI Intelligence"
          date="Live Stats Engine"
          scrollToExpand="Scroll to Explore the Platform"
          textBlend
        >
          <div className="pb-20 pt-10">
            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {activeTab === "preview" && (
          <div className="space-y-12">
            {/* Header & Search */}
            <div className="text-center max-w-3xl mx-auto">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
              >
                Match Previews on <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Autopilot</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-neutral-400 text-lg md:text-xl mb-8"
              >
                Grounded in real stats. Ready for social media.
              </motion.p>

              <div className="flex justify-center items-center gap-4 mb-6">
                <button
                  onClick={() => setIsPostMatch(false)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${!isPostMatch ? "bg-emerald-500 text-black" : "bg-white/10 text-white"}`}
                >
                  Match Preview
                </button>
                <button
                  onClick={() => setIsPostMatch(true)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${isPostMatch ? "bg-emerald-500 text-black" : "bg-white/10 text-white"}`}
                >
                  Post-Match Review
                </button>
              </div>

              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleGenerate} 
                className="relative flex items-center shadow-2xl"
              >
                <div className="absolute left-4 text-neutral-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. MI vs RR May 24 2026"
                  className="w-full bg-black/40 border border-white/10 outline-none text-white pl-12 pr-36 py-4 rounded-2xl focus:border-emerald-500/50 transition-colors text-lg backdrop-blur-sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isGenerating}
                />
                <button
                  type="submit"
                  disabled={isGenerating || !query}
                  className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold px-6 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate"}
                </button>
              </motion.form>

              {/* Quick Matches */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex flex-wrap justify-center gap-3"
              >
                {quickMatches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => handleQuickMatch(match.title)}
                    className="flex flex-col items-start px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-left"
                  >
                    <span className="text-xs text-emerald-400 font-semibold">{match.label}</span>
                    <span className="text-sm text-white font-medium">{match.title}</span>
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Results Area */}
            {(isGenerating || isComplete) && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 sticky top-24">
                  <AgentActivity 
                    isGenerating={isGenerating} 
                    isComplete={isComplete} 
                    tasks={agentTasks} 
                  />
                </div>
                <div className="lg:col-span-8">
                  {output ? (
                    <MatchPreview output={output} />
                  ) : (
                    <div className="h-full min-h-[400px] border border-white/10 bg-black/30 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-neutral-500">
                      <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                      <p className="font-semibold text-lg text-emerald-400 animate-pulse">Agents are working...</p>
                      <p className="text-sm mt-2 text-neutral-500">Compiling real stats and drafting content.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
          </div>
        </ScrollExpandMedia>
      ) : (
        <div className="pb-20 pt-24">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {activeTab === "h2h" && (
              <div className="space-y-12">
                <div className="text-center max-w-3xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-black mb-4">Player <span className="text-cyan-400">Head-to-Head</span></h1>
                  <p className="text-neutral-400 text-lg mb-8">Compare real player stats and AI-driven match-ups.</p>
                </div>
                <PlayerH2H />
              </div>
            )}

            {activeTab === "predictor" && (
              <div className="space-y-12">
                <div className="text-center max-w-3xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-black mb-4">AI Match <span className="text-purple-400">Predictor</span></h1>
                  <p className="text-neutral-400 text-lg mb-8">Data-driven win probability simulations.</p>
                </div>
                <Predictor />
              </div>
            )}

            {activeTab === "fantasy" && (
              <div className="space-y-12">
                <div className="text-center max-w-3xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-black mb-4">Fantasy <span className="text-amber-400">XI Builder</span></h1>
                  <p className="text-neutral-400 text-lg mb-8">Mathematically optimal teams based on live stats.</p>
                </div>
                <FantasyXI />
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
