"use client";

import React, { useState, useRef } from "react";
import { Loader2, Search, Download, Swords, Image as ImageIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PlayerH2H() {
  const [player1, setPlayer1] = useState("Rohit Sharma");
  const [player2, setPlayer2] = useState("Sanju Samson");
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<any>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!player1 || !player2) return;

    setIsGenerating(true);
    setData(null);

    try {
      const response = await fetch("/api/h2h", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player1, player2 }),
      });

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to generate H2H:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsGenerating(false);
    }
  };

  const exportAsImage = async () => {
    if (!exportRef.current) return;
    
    toast.loading("Generating Image Card...", { id: "export" });
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        backgroundColor: "#030712",
      });
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `cricai-h2h-${player1}-vs-${player2}.png`;
      link.href = image;
      link.click();
      toast.success("Image Card Downloaded!", { id: "export" });
    } catch (err) {
      toast.error("Failed to generate image", { id: "export" });
    }
  };

  const getChartData = () => {
    if (!data) return null;
    
    const p1Stats = data.player1.stats;
    const p2Stats = data.player2.stats;
    
    // Determine if it's a batter vs batter or bowler vs bowler based on stats keys
    const isBatter = p1Stats.runs !== undefined;
    
    const labels = isBatter ? ['Matches', 'Runs (x10)', 'Strike Rate', 'Average'] : ['Matches', 'Wickets', 'Economy (x10)', 'Average'];
    
    const p1Data = isBatter 
      ? [p1Stats.matches, p1Stats.runs / 10, p1Stats.strikeRate, p1Stats.average]
      : [p1Stats.matches, p1Stats.wickets, p1Stats.economy * 10, p1Stats.average];
      
    const p2Data = isBatter 
      ? [p2Stats.matches, p2Stats.runs / 10, p2Stats.strikeRate, p2Stats.average]
      : [p2Stats.matches, p2Stats.wickets, p2Stats.economy * 10, p2Stats.average];

    return {
      labels,
      datasets: [
        {
          label: data.player1.name,
          data: p1Data,
          backgroundColor: 'rgba(16, 185, 129, 0.8)', // emerald
        },
        {
          label: data.player2.name,
          data: p2Data,
          backgroundColor: 'rgba(6, 182, 212, 0.8)', // cyan
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: 'white' }
      },
    },
    scales: {
      y: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      x: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { display: false } }
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Player 1 (e.g. Rohit Sharma)"
            className="w-full bg-black/40 border border-white/10 outline-none text-white px-4 py-3 rounded-xl focus:border-emerald-500/50"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            disabled={isGenerating}
          />
        </div>
        <div className="flex items-center justify-center shrink-0">
          <Swords className="w-6 h-6 text-neutral-500" />
        </div>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Player 2 (e.g. Sanju Samson)"
            className="w-full bg-black/40 border border-white/10 outline-none text-white px-4 py-3 rounded-xl focus:border-cyan-500/50"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            disabled={isGenerating}
          />
        </div>
        <button
          type="submit"
          disabled={isGenerating || !player1 || !player2}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold px-6 py-3 rounded-xl disabled:opacity-50 flex items-center justify-center min-w-[120px]"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
        </button>
      </form>

      {/* Results View */}
      {data && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex justify-end mb-4">
            <button
              onClick={exportAsImage}
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 rounded-lg transition-colors text-sm font-semibold"
            >
              <ImageIcon className="w-4 h-4" /> Export WhatsApp Card
            </button>
          </div>

          {/* Exportable Area */}
          <div ref={exportRef} className="p-6 bg-[#030712] rounded-xl border border-white/5 space-y-8">
            
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
                ULTIMATE SHOWDOWN
              </h2>
              {data.source === "Demo Mode" && (
                <span className="inline-block mt-2 text-xs font-mono bg-white/10 text-neutral-400 px-2 py-1 rounded">DEMO MODE - ILLUSTRATIVE DATA</span>
              )}
            </div>

            {/* Table */}
            <div className="grid grid-cols-3 gap-2 text-center items-center bg-white/5 p-4 rounded-xl">
              <div className="text-xl font-bold text-emerald-400">{data.player1.name}</div>
              <div className="text-sm text-neutral-500 uppercase tracking-widest">VS</div>
              <div className="text-xl font-bold text-cyan-400">{data.player2.name}</div>
              
              <div className="text-sm text-neutral-400">{data.player1.role}</div>
              <div className="text-xs text-neutral-600">ROLE</div>
              <div className="text-sm text-neutral-400">{data.player2.role}</div>

              {Object.keys(data.player1.stats).map((key) => (
                <React.Fragment key={key}>
                  <div className="text-lg font-mono text-white">{data.player1.stats[key]}</div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className="text-lg font-mono text-white">{data.player2.stats[key]}</div>
                </React.Fragment>
              ))}
            </div>

            {/* Chart */}
            <div className="h-[250px] w-full">
               <Bar data={getChartData()!} options={chartOptions} />
            </div>

            {/* AI Verdict */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 p-6 rounded-xl">
              <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Verdict
              </h4>
              <p className="text-white leading-relaxed text-sm md:text-base">
                {data.aiVerdict}
              </p>
            </div>
            
            <div className="text-center text-xs text-neutral-600 font-mono pt-4 border-t border-white/5">
              Powered by CricAI • From Stats to Story in Seconds
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
