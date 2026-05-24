"use client";

import { useState } from "react";
import { Copy, Download, Check, FileText, Hash, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

type ContentOutput = {
  article: string;
  twitter: string;
  instagram: string;
  meme: string;
};

export default function MatchPreview({ output }: { output: ContentOutput | null }) {
  const [activeTab, setActiveTab] = useState<"article" | "twitter" | "instagram" | "meme">("article");
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output[activeTab]);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (!output) return;
    
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add title and logo
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // Emerald 500
    doc.text("CricAI Match Preview", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 28);
    
    // Add article text
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    
    // simple word wrap for jsPDF since it doesn't handle markdown automatically
    const cleanText = output.article.replace(/\*\*/g, "").replace(/#/g, "");
    const lines = doc.splitTextToSize(cleanText, 170);
    
    let y = 40;
    for(let i=0; i<lines.length; i++){
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(lines[i], 20, y);
      y += 6;
    }
    
    doc.save(`cricai-preview-${new Date().getTime()}.pdf`);
    toast.success("PDF Downloaded!");
  };

  if (!output) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl"
    >
      <div className="flex border-b border-white/10 bg-black/40 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab("article")}
          className={`flex-1 py-4 px-4 flex justify-center items-center gap-2 font-semibold transition-all min-w-[120px] ${activeTab === "article" ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/10" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
        >
          <FileText className="w-4 h-4" />
          Article
        </button>
        <button
          onClick={() => setActiveTab("twitter")}
          className={`flex-1 py-4 px-4 flex justify-center items-center gap-2 font-semibold transition-all min-w-[120px] ${activeTab === "twitter" ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/10" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
        >
          <Hash className="w-4 h-4" />
          Twitter
        </button>
        <button
          onClick={() => setActiveTab("instagram")}
          className={`flex-1 py-4 px-4 flex justify-center items-center gap-2 font-semibold transition-all min-w-[120px] ${activeTab === "instagram" ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/10" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
        >
          <ImageIcon className="w-4 h-4" />
          Instagram
        </button>
        <button
          onClick={() => setActiveTab("meme")}
          className={`flex-1 py-4 px-4 flex justify-center items-center gap-2 font-semibold transition-all min-w-[120px] ${activeTab === "meme" ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/10" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
        >
          <ImageIcon className="w-4 h-4 text-purple-400" />
          Meme Idea
        </button>
      </div>
      
      <div className="p-4 md:p-6 flex-1 bg-gradient-to-b from-black/20 to-transparent flex flex-col h-[500px]">
        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            Copy
          </button>
          {activeTab === "article" && (
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 rounded-lg transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
          {activeTab === "article" && (
            <div className="prose prose-invert prose-emerald max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-sm md:prose-base">
              <ReactMarkdown>{output.article}</ReactMarkdown>
            </div>
          )}

          {activeTab === "twitter" && (
            <div className="max-w-md mx-auto space-y-4">
              {output.twitter.split("\n\n").map((tweet, i) => (
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
                  <p className="text-white whitespace-pre-wrap text-sm">{tweet}</p>
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
              <div className="aspect-square bg-gradient-to-br from-neutral-900 to-black flex items-center justify-center p-8 text-center border-b border-white/5 relative">
                 <ImageIcon className="w-12 h-12 text-white/20 mb-4" />
                 <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 p-6">
                    <h2 className="text-2xl font-bold text-emerald-400 text-center">SWIPE TO READ</h2>
                    <p className="text-white mt-2 text-center text-sm opacity-80">Our expert analysis 🏏</p>
                 </div>
              </div>
              <div className="p-4">
                <p className="text-white text-sm whitespace-pre-wrap">
                  <span className="font-bold mr-2">cricai_official</span>
                  {output.instagram}
                </p>
              </div>
            </div>
          )}

          {activeTab === "meme" && (
            <div className="max-w-sm mx-auto bg-black/40 border border-purple-500/30 rounded-2xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-purple-900/40 to-black flex flex-col items-center justify-center p-8 text-center border-b border-white/5 relative">
                 <span className="text-6xl mb-4">🤣</span>
                 <h2 className="text-xl font-bold text-purple-400 text-center">AI MEME IDEA</h2>
              </div>
              <div className="p-6 bg-gradient-to-b from-purple-500/10 to-transparent">
                <p className="text-white text-base leading-relaxed italic">
                  "{output.meme}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
