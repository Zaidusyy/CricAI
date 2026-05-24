"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

type NavigationProps = {
  activeTab: "preview" | "h2h" | "predictor" | "fantasy";
  setActiveTab: (tab: "preview" | "h2h" | "predictor" | "fantasy") => void;
};

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  return (
    <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-2xl">🏏</span>
          <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1">
            CricAI <Sparkles className="w-4 h-4 text-emerald-400" />
          </span>
        </motion.div>
        
        <div className="flex gap-1 md:gap-4">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 md:px-4 md:py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "preview" ? "bg-white/10 text-emerald-400 border border-white/10" : "text-neutral-400 hover:text-white"}`}
          >
            Match Preview
          </button>
          <button
            onClick={() => setActiveTab("h2h")}
            className={`px-3 py-1.5 md:px-4 md:py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "h2h" ? "bg-white/10 text-emerald-400 border border-white/10" : "text-neutral-400 hover:text-white"}`}
          >
            Player H2H
          </button>
          <button
            onClick={() => setActiveTab("predictor")}
            className={`px-3 py-1.5 md:px-4 md:py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "predictor" ? "bg-white/10 text-emerald-400 border border-white/10" : "text-neutral-400 hover:text-white"}`}
          >
            Predictor
          </button>
          <button
            onClick={() => setActiveTab("fantasy")}
            className={`px-3 py-1.5 md:px-4 md:py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "fantasy" ? "bg-white/10 text-emerald-400 border border-white/10" : "text-neutral-400 hover:text-white"}`}
          >
            Fantasy XI
          </button>
        </div>
      </div>
    </nav>
  );
}
