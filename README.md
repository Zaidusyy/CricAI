<div align="center">
  <img src="https://img.ipl.com/upload/20260311/afa031ab112b67a568d8108d988defbf.webp" alt="CricAI Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />
  
  <h1 align="center">🏏 CricAI: The Ultimate AI Cricket Companion</h1>
  <p align="center">
    <strong>Data-Grounded Match Previews, Fantasy XI generation, and AI Predictions on Autopilot.</strong>
  </p>
  
  <p align="center">
    <a href="#features">✨ Features</a> •
    <a href="#how-it-works">⚙️ How it Works</a> •
    <a href="#tech-stack">🛠 Tech Stack</a> •
    <a href="#getting-started">🚀 Getting Started</a>
  </p>
</div>

---

## 🌟 The Vision
**CricAI** isn't just another AI wrapper—it is a **data-grounded agentic engine**. Built to serve cricket analysts, social media managers, and hardcore fans, CricAI actively scrapes the web for live match context, eliminates AI hallucinations, and builds intelligent output spanning from post-match reviews to mathematically optimal Fantasy XI teams.

Whether you're building a grand league team or drafting a viral tweet about a historic rivalry, CricAI brings the intelligence directly to your fingertips through a stunning, cinematic user interface.

---

## ✨ Flagship Features

### 1. 🤖 Match Previews on Autopilot
Type in any upcoming or past match (e.g., *"MI vs CSK May 2026"*) and watch CricAI go to work.
- **Pre-Match & Post-Match Modes**: Toggle between analyzing what *will* happen and reviewing what *did* happen.
- **Meme Generation**: Instantly creates witty, context-aware meme ideas tailored for Instagram and X (Twitter) engagement.
- **Social-Ready Content**: Automatically formats data into clean, engaging reports.

### 2. 🏟️ Visual Fantasy XI Builder
Stop guessing. CricAI generates mathematically optimal 11-player squads based on live form and pitch conditions.
- **Visual Pitch Layout**: See your team rendered beautifully on a virtual cricket pitch.
- **Smart Captaincy**: AI-driven logic selects your Captain (C) and Vice-Captain (VC) for maximum points.
- **Export Ready**: Built-in functionality to download your team as an image.

### 3. ⚔️ Player Head-to-Head & Predictor
- **H2H Analysis**: Pit any two players against each other. CricAI scrapes their latest stats and uses LLMs to structure the numeric data into beautiful comparative UI charts.
- **Match Predictor**: Get simulated win probabilities (e.g., 55% vs 45%) backed by logical, data-driven reasoning.

---

## ⚙️ How it Works (The Data Engine)
Most AI tools suffer from *hallucinations* when asked about sports stats. **CricAI solves this.**
When you request an analysis, our custom backend:
1. **Scrapes the Web**: Uses `Cheerio` and `Axios` to fetch the most recent context and data from live sources (like Wikipedia).
2. **Context Injection**: Feeds this raw, grounded text into the **Google Gemini 1.5 Flash** model.
3. **Structured Output**: Forces the LLM to output highly precise JSON data (numeric stats, probabilities, player roles).
4. **Beautiful Rendering**: Renders the JSON into interactive Framer Motion charts and layouts.

---

## 🛠 Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (Cinematic scroll-expansion heroes)
- **AI Engine**: [Google Generative AI](https://ai.google.dev/) (Gemini 1.5)
- **Data Scraping**: `axios` + `cheerio`
- **Language**: TypeScript

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Zaidusyy/CricAI.git
cd CricAI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to experience the immersive cinematic landing page and start generating stats!

---
<div align="center">
  <i>Built to win. Powered by AI. Designed for Cricket. 🏆</i>
</div>
