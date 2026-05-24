import { getDemoData } from "@/lib/demoData";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Step 1: Research Agent (Fetch Stats)
    const statsData = getDemoData(query);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      // Return a simulated response if API key is not set to prevent crashing demo
      return NextResponse.json({
        article: `[DEMO MODE - API KEY REQUIRED] This is a demo article for ${query}. Since no valid Gemini API key was provided, this is placeholder text. To see the AI in action, please add your key to the .env file.\n\nStats used: ${JSON.stringify(statsData)}`,
        twitter: `[DEMO MODE] 🏏 Exciting match ahead for ${query}! #Cricket #Demo\n\nStats: ${statsData.recentForm || statsData.headToHead}`,
        instagram: `[DEMO MODE] Get ready for ${query}! 🏆🔥\n\n${statsData.pitchConditions || statsData.recentForm}\n\n#Cricket #IPL2026 #CricketFans`
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Step 2: Writer Agent
    const writerPrompt = `
    You are an expert sports journalist and cricket analyst. 
    Write content based on the following stats for: ${query}
    Stats Data: ${JSON.stringify(statsData)}

    Please generate exactly three formats of content. Do NOT include any introductory or concluding text, just output the content in the following strict JSON format:
    {
      "article": "A full match preview/analysis article (500-800 words).",
      "twitter": "A Twitter/X thread (8-10 tweets) formatted with numbers, hashtags, and emojis.",
      "instagram": "An Instagram caption (around 150 words) with emojis and relevant hashtags."
    }
    Make sure the response is a valid JSON object.
    `;

    const writerResponse = await model.generateContent(writerPrompt);
    const writerText = writerResponse.response.text();
    
    // Parse the writer response
    let draftContent;
    try {
      // Find the JSON block if it's wrapped in markdown
      const jsonMatch = writerText.match(/```json\n([\s\S]*)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : writerText;
      draftContent = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse writer output:", writerText);
      draftContent = {
        article: "Error generating article draft.",
        twitter: "Error generating twitter draft.",
        instagram: "Error generating instagram draft."
      };
    }

    // Step 3: Editor Agent
    const editorPrompt = `
    You are a senior sports editor. Review the following draft content for accuracy, tone, and readability.
    Ensure the cricket facts are correct, the tone is engaging, and the formatting is perfect for publishing.
    
    Draft Content:
    ${JSON.stringify(draftContent)}
    
    Provide the final polished content in the following strict JSON format without any markdown blocks or extra text:
    {
      "article": "Polished article text.",
      "twitter": "Polished twitter thread text.",
      "instagram": "Polished instagram caption text."
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
    } catch (e) {
      console.error("Failed to parse editor output, falling back to draft:", editorText);
      finalContent = draftContent;
    }

    return NextResponse.json(finalContent);
  } catch (error: any) {
    console.error("Error in generate API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
