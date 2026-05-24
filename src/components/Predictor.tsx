"use client";

import { useState } from "react";
import { Loader2, TrendingUp, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Predictor() {
  const [match, setMatch] = useState("MI vs RR");
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<any>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!match) return;

    setIsGenerating(true);
    setData(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ match }),
      });
      const result = await response.json();
      setData(result);
      toast.success("Prediction Generated!");
    } catch (error) {
      toast.error("Failed to fetch prediction");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <form onSubmit={handlePredict} className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Enter Match (e.g. MI vs RR)"
          className="flex-1 bg-black/40 border border-white/10 outline-none text-white px-4 py-3 rounded-xl focus:border-purple-500/50"
          value={match}
          onChange={(e) => setMatch(e.target.value)}
          disabled={isGenerating}
        />
        <button
          type="submit"
          disabled={isGenerating || !match}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-3 rounded-xl disabled:opacity-50 flex items-center justify-center min-w-[160px]"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Run Simulation"}
        </button>
      </form>

      {data && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/30 border border-white/10 rounded-2xl p-6 md:p-8 space-y-8"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{data.matchTitle}</h2>
            {data.source === "Demo Mode" && (
              <span className="text-xs font-mono bg-white/10 text-neutral-400 px-2 py-1 rounded">DEMO MODE</span>
            )}
          </div>

          {/* Probability Bar */}
          <div className="relative pt-6 pb-2">
            <div className="flex justify-between mb-4 text-xl font-bold">
              <span style={{ color: data.team1.color }}>{data.team1.name} {data.team1.probability}%</span>
              <span style={{ color: data.team2.color }}>{data.team2.probability}% {data.team2.name}</span>
            </div>
            
            <div className="w-full h-8 bg-neutral-800 rounded-full overflow-hidden flex shadow-inner">
              <motion.div 
                initial={{ width: '50%' }}
                animate={{ width: `${data.team1.probability}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ backgroundColor: data.team1.color }}
                className="h-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
              </motion.div>
              <motion.div 
                initial={{ width: '50%' }}
                animate={{ width: `${data.team2.probability}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ backgroundColor: data.team2.color }}
                className="h-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
              </motion.div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-white/20 z-10"></div>
          </div>

          {/* AI Reasoning */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="flex items-center gap-2 text-white font-bold mb-4">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Algorithmic Reasoning
            </h3>
            <ul className="space-y-3">
              {data.reasoning.map((reason: string, i: number) => (
                <li key={i} className="flex gap-3 text-neutral-300 text-sm md:text-base">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500 justify-center">
            <ShieldAlert className="w-4 h-4" />
            <p>For entertainment purposes only. Does not constitute betting advice.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
