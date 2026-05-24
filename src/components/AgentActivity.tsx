"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

type AgentTask = {
  name: string;
  action: string;
};

type AgentActivityProps = {
  isGenerating: boolean;
  isComplete: boolean;
  tasks: AgentTask[];
  onComplete?: () => void;
};

export default function AgentActivity({ isGenerating, isComplete, tasks, onComplete }: AgentActivityProps) {
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  useEffect(() => {
    if (isGenerating && currentAgentIndex === -1) {
      setStartTime(Date.now());
      setEndTime(null);
      setCurrentAgentIndex(0);
    }

    if (isGenerating && currentAgentIndex >= 0 && currentAgentIndex < tasks.length) {
      const interval = setTimeout(() => {
        setCurrentAgentIndex((prev) => prev + 1);
      }, 1500 + Math.random() * 1000); // Random delay between 1.5s and 2.5s per task to feel real
      
      return () => clearTimeout(interval);
    }

    if (currentAgentIndex === tasks.length && isGenerating) {
      setEndTime(Date.now());
      if (onComplete) onComplete();
    }
  }, [isGenerating, currentAgentIndex, tasks.length, onComplete]);

  // Reset when not generating and not complete
  useEffect(() => {
    if (!isGenerating && !isComplete) {
      setCurrentAgentIndex(-1);
      setStartTime(null);
      setEndTime(null);
    }
  }, [isGenerating, isComplete]);

  const progress = isComplete ? 100 : Math.max(0, Math.min(100, (currentAgentIndex / tasks.length) * 100));
  const timeTaken = startTime && endTime ? ((endTime - startTime) / 1000).toFixed(1) : null;

  return (
    <div className="border border-white/10 bg-black/30 backdrop-blur-md rounded-2xl p-6 h-full min-h-[400px] shadow-xl flex flex-col">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
        <Sparkles className="w-5 h-5 text-emerald-400" />
        Live Generation Log
      </h3>
      
      {/* Progress Bar */}
      <div className="w-full bg-neutral-800 rounded-full h-2 mb-6">
        <motion.div 
          className="bg-emerald-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
        <AnimatePresence>
          {tasks.map((agent, index) => {
            const isActive = currentAgentIndex === index && isGenerating;
            const isDone = currentAgentIndex > index || isComplete;
            
            return (
              <motion.div 
                key={agent.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isDone ? 1 : isActive ? 1 : 0.2, x: 0 }}
                className="flex gap-4"
              >
                <div className="relative flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isDone ? "bg-emerald-500 border-emerald-500" : isActive ? "bg-transparent border-emerald-400" : "bg-neutral-800 border-neutral-700"}`}>
                    {isActive && <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />}
                    {isDone && <Check className="w-3 h-3 text-black" />}
                  </div>
                  {index < tasks.length - 1 && (
                    <div className={`w-0.5 h-full mt-2 rounded-full ${isDone ? "bg-emerald-500/50" : "bg-white/5"}`}></div>
                  )}
                </div>
                <div className="pb-4 pt-0.5">
                  <p className={`font-mono text-sm font-semibold ${isDone || isActive ? "text-emerald-400" : "text-neutral-500"}`}>
                    {'>'} {agent.name}
                  </p>
                  <p className="text-sm text-neutral-300 mt-1">
                    {isDone ? <span className="text-neutral-500 line-through">{agent.action}</span> : isActive ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                        <Typewriter text={agent.action} />
                      </span>
                    ) : "..."}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {isComplete && timeTaken && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="mt-4 pt-4 border-t border-white/10 text-center"
        >
          <span className="text-sm font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
            Generated in {timeTaken} seconds
          </span>
        </motion.div>
      )}
    </div>
  );
}

// Simple typewriter effect component
function Typewriter({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i > text.length - 1) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}
