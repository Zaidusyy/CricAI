import { fetchPredictorData } from "@/lib/cricData";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { match } = await request.json();

    if (!match) {
      return NextResponse.json({ error: "Match required" }, { status: 400 });
    }

    const data = await fetchPredictorData(match);

    // If it's demo data, just return it directly
    if (data.source === "Demo Mode") {
      return NextResponse.json(data);
    }

    // Otherwise, use Gemini to convert the raw scraped text into structured stats
    const prompt = `
      You are an AI cricket prediction engine. Analyze the following context for a cricket match and generate a realistic win probability and reasoning.
      Match: ${match}
      Context: ${data.reasoning?.join(" ") || "No context available"}
      
      Respond EXACTLY with valid JSON. Do not include markdown formatting or backticks.
      Format:
      {
        "matchTitle": "${match}",
        "team1": {
          "name": "First Team Name",
          "probability": 55,
          "color": "#10B981"
        },
        "team2": {
          "name": "Second Team Name",
          "probability": 45,
          "color": "#06B6D4"
        },
        "reasoning": [
          "Reason 1 based on recent form.",
          "Reason 2 based on head-to-head.",
          "Reason 3 based on conditions."
        ]
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
