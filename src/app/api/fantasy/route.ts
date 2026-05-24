import { fetchMatchData } from "@/lib/cricData";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { match } = await request.json();

    if (!match) {
      return NextResponse.json({ error: "Match is required" }, { status: 400 });
    }

    const statsData = await fetchMatchData(match);
    const sourceLabel = statsData.source === "Demo Mode" ? "[DEMO MODE]" : "[LIVE SCRAPED]";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json({
        players: ["Player 1 (C)", "Player 2 (VC)", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8", "Player 9", "Player 10", "Player 11"],
        captain: "Player 1",
        viceCaptain: "Player 2",
        analysis: "Please add your Gemini API key for real fantasy analysis.",
        source: statsData.source
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an expert Fantasy Cricket Analyst (Dream11/My11Circle).
    Based on the following context for: ${match}
    Context: ${JSON.stringify(statsData)}

    Generate the mathematically optimal playing 11 for a fantasy team.
    Output strict JSON:
    {
      "players": ["List exactly 11 player names"],
      "captain": "Best player name for Captain (2x points)",
      "viceCaptain": "Best player name for Vice-Captain (1.5x points)",
      "analysis": "A brief explanation of why this team was chosen based on the pitch/context."
    }
    `;

    const response = await model.generateContent(prompt);
    const text = response.response.text();
    
    let finalContent;
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : text;
      finalContent = JSON.parse(jsonString);
      finalContent.source = statsData.source;
    } catch (e) {
      throw new Error("Failed to parse fantasy JSON");
    }

    return NextResponse.json(finalContent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
