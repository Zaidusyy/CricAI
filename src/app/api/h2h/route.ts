import { fetchH2HData } from "@/lib/cricData";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { player1, player2 } = await request.json();

    if (!player1 || !player2) {
      return NextResponse.json({ error: "Both players required" }, { status: 400 });
    }

    const data = await fetchH2HData(player1, player2);
    
    // If it's demo data, just return it directly
    if (data.source === "Demo Mode") {
      return NextResponse.json(data);
    }

    // Otherwise, use Gemini to convert the raw scraped text into structured stats
    const prompt = `
      You are a cricket stats expert. Analyze the following context for two players and generate realistic or factual head-to-head stats.
      Context Player 1 (${player1}): ${JSON.stringify(data.player1.stats)}
      Context Player 2 (${player2}): ${JSON.stringify(data.player2.stats)}
      
      Respond EXACTLY with valid JSON. Do not include markdown formatting or backticks.
      Format:
      {
        "player1": {
          "name": "${player1}",
          "role": "Batsman/Bowler/All-rounder",
          "stats": { "matches": 100, "runs": 3000, "average": 45.5, "strikeRate": 130.2 }
        },
        "player2": {
          "name": "${player2}",
          "role": "Batsman/Bowler/All-rounder",
          "stats": { "matches": 90, "runs": 2800, "average": 42.1, "strikeRate": 135.4 }
        },
        "aiVerdict": "A short 1-2 sentence comparison verdict based on the data."
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith("```json")) {
      text = text.substring(7, text.length - 3);
    } else if (text.startsWith("```")) {
      text = text.substring(3, text.length - 3);
    }

    const parsedData = JSON.parse(text);
    parsedData.source = "Live Web Scrape (AI Processed)";

    return NextResponse.json(parsedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
