"use client";

import { useState } from "react";
import { Loader2, Crown, Star } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function FantasyXI() {
  const [match, setMatch] = useState("MI vs RR");
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!match) return;

    setIsGenerating(true);
    setData(null);

    try {
      const response = await fetch("/api/fantasy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ match }),
      });
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setData(result);
      toast.success("Fantasy Team Generated!");
    } catch (error) {
      toast.error("Failed to generate fantasy team");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Enter Match (e.g. IND vs AUS)"
          className="flex-1 bg-black/40 border border-white/10 outline-none text-white px-4 py-3 rounded-xl focus:border-amber-500/50"
          value={match}
          onChange={(e) => setMatch(e.target.value)}
          disabled={isGenerating}
        />
        <button
          type="submit"
          disabled={isGenerating || !match}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold px-8 py-3 rounded-xl disabled:opacity-50 flex items-center justify-center min-w-[180px]"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Build Optimal XI"}
        </button>
      </form>

      {data && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 border border-white/10 rounded-2xl p-6 md:p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-amber-400">AI Dream Team</h2>
            {data.source !== "Demo Mode" ? (
              <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">LIVE DATA SCRAPED</span>
            ) : (
              <span className="text-xs font-mono bg-white/10 text-neutral-400 px-3 py-1 rounded-full">DEMO DATA</span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative bg-green-900/40 rounded-xl border border-green-500/30 p-6 flex flex-wrap justify-center items-center gap-4 min-h-[400px]">
               {/* Simplified Pitch Background */}
               <div className="absolute inset-4 border-2 border-white/10 rounded-full opacity-50 pointer-events-none"></div>
               <div className="absolute inset-y-12 inset-x-20 border-2 border-white/10 opacity-30 pointer-events-none"></div>
               
               {data.players?.map((player: string, index: number) => {
                 const isCaptain = player === data.captain || player.includes("(C)");
                 const isVC = player === data.viceCaptain || player.includes("(VC)");
                 return (
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ delay: index * 0.1 }}
                     key={index} 
                     className="bg-black/80 border border-white/20 px-3 py-2 rounded-lg text-sm font-semibold flex flex-col items-center justify-center z-10 w-[120px] shadow-lg"
                   >
                     {isCaptain && <Crown className="w-4 h-4 text-amber-400 mb-1" />}
                     {isVC && <Star className="w-4 h-4 text-orange-400 mb-1" />}
                     <span className="text-center truncate w-full text-xs">{player}</span>
                   </motion.div>
                 );
               })}
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-6 rounded-xl">
                <h3 className="text-amber-400 font-bold flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5" /> Captain Pick
                </h3>
                <p className="text-white text-xl font-black">{data.captain}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 p-6 rounded-xl">
                <h3 className="text-orange-400 font-bold flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5" /> Vice-Captain Pick
                </h3>
                <p className="text-white text-xl font-black">{data.viceCaptain}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                <h3 className="text-white font-bold mb-3">AI Analysis</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">{data.analysis}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
