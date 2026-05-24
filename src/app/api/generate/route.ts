import { fetchMatchData } from "@/lib/cricData";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query, isPostMatch } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Step 1: Research Agent (Fetch Stats from Real Data Layer)
    const statsData = await fetchMatchData(query);
    const sourceLabel = statsData.source === "Demo Mode" ? "[DEMO MODE - Data is illustrative]" : "[Real Data Fetched]";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json({
        article: `${sourceLabel} This is a demo article for ${query}. Please add your Gemini API key.\n\nStats: ${JSON.stringify(statsData)}`,
        twitter: `${sourceLabel} 🏏 Exciting match for ${query}! #Cricket`,
        instagram: `${sourceLabel} Get ready for ${query}! 🏆🔥`,
        meme: `Imagine a picture of ${query} looking confused. Text: When the API key is missing.`
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Step 2: Writer Agent
    const modeInstruction = isPostMatch 
      ? "Write a POST-MATCH analysis. Focus on the turning point, top performer ratings out of 10, and a summary of the result."
      : "Write a MATCH PREVIEW. Focus on pitch conditions, key matchups, and predicted X-factors.";

    const writerPrompt = `
    You are an expert sports journalist and cricket analyst. 
    ${modeInstruction}
    Based heavily on the following REAL context/stats for: ${query}
    Context Data: ${JSON.stringify(statsData)}

    CRITICAL RULE: You MUST inject actual context from the data into the text.

    Please generate exactly four formats of content. Do NOT include any introductory text. Output strict JSON:
    {
      "article": "A full analysis (500-800 words). MUST include a 'Sources' section at the bottom citing the data.",
      "twitter": "A Twitter thread (8-10 tweets) formatted with numbers, hashtags, and emojis.",
      "instagram": "An Instagram caption (around 150 words) with emojis.",
      "meme": "A hilarious, highly descriptive text idea for a cricket meme based on this match/player. Describe the image and the text overlays."
    }
    `;

    const writerResponse = await model.generateContent(writerPrompt);
    const writerText = writerResponse.response.text();
    
    let draftContent;
    try {
      const jsonMatch = writerText.match(/```json\n([\s\S]*)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : writerText;
      draftContent = JSON.parse(jsonString);
    } catch (e) {
      draftContent = { article: "Error", twitter: "Error", instagram: "Error" };
    }

    // Step 3: Editor Agent
    const editorPrompt = `
    You are a senior sports editor. Review this draft content.
    Ensure facts match the original stats: ${JSON.stringify(statsData)}.
    Ensure the article has a Sources section.
    
    Draft Content:
    ${JSON.stringify(draftContent)}
    
    Output strict JSON without markdown blocks:
    {
      "article": "Polished article.",
      "twitter": "Polished twitter.",
      "instagram": "Polished instagram.",
      "meme": "Polished meme idea."
    }
    `;

    const editorResponse = await model.generateContent(editorPrompt);
    const editorText = editorResponse.response.text();

    // Step 4: Formatter Agent
    let finalContent;
    try {
      const jsonMatch = editorText.match(/```json\n([\s\S]*)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : editorText;
      finalContent = JSON.parse(jsonString);
      
      // Append Demo Mode badge to article if applicable
      if (statsData.source === "Demo Mode") {
        finalContent.article = `**[DEMO MODE] Data used is illustrative.**\n\n` + finalContent.article;
      }
    } catch (e) {
      finalContent = draftContent;
    }

    return NextResponse.json(finalContent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
