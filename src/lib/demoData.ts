export const quickMatches = [
  {
    id: "match-1",
    label: "Past 2 Days",
    title: "CSK vs RCB",
    date: "May 22",
    status: "Completed",
    winner: "CSK won by 6 wickets"
  },
  {
    id: "match-2",
    label: "Today",
    title: "MI vs RR",
    date: "May 24",
    status: "Live 7:30 PM",
    winner: ""
  },
  {
    id: "match-3",
    label: "Tomorrow",
    title: "KKR vs SRH",
    date: "May 25",
    status: "Upcoming",
    winner: ""
  }
];

export const getDemoData = (query: string) => {
  const lowercaseQuery = query.toLowerCase();

  // Match Preview Data
  if (lowercaseQuery.includes("mi vs rr") || lowercaseQuery.includes("mumbai") || lowercaseQuery.includes("rajasthan")) {
    return {
      type: "match",
      match: "MI vs RR",
      date: "May 24 2026",
      teams: "Mumbai Indians vs Rajasthan Royals",
      recentForm: "MI: W, L, W, W, L | RR: L, W, W, L, W",
      headToHead: "Overall: MI 15 - 13 RR. Last 5 matches: MI 3 - 2 RR.",
      pitchConditions: "Wankhede Stadium: High scoring ground, chasing is preferred. Average 1st innings score: 185.",
      keyPlayers: "MI: Rohit Sharma, Jasprit Bumrah | RR: Sanju Samson, Trent Boult"
    };
  }

  // Fallback
  return {
    type: "match",
    match: "CSK vs RCB",
    date: "May 22 2026",
    teams: "Chennai Super Kings vs Royal Challengers Bangalore",
    recentForm: "CSK: W, W, L, W, W | RCB: L, L, W, L, W",
    headToHead: "Overall: CSK 21 - 10 RCB.",
    pitchConditions: "Chepauk Stadium: Spin friendly, slow track. Average 1st innings score: 165.",
    keyPlayers: "CSK: Ruturaj Gaikwad, Ravindra Jadeja | RCB: Virat Kohli, Glenn Maxwell",
  };
};

// V3 Head to Head Data
export const getDemoH2HData = (player1: string, player2: string) => {
  const p1 = player1.toLowerCase();
  const p2 = player2.toLowerCase();

  if (
    (p1.includes("rohit") || p1.includes("sharma")) && 
    (p2.includes("sanju") || p2.includes("samson"))
  ) {
    return {
      player1: {
        name: "Rohit Sharma",
        role: "Opening Batter",
        stats: { matches: 254, runs: 6522, strikeRate: 131.2, average: 29.8, highest: "109*" }
      },
      player2: {
        name: "Sanju Samson",
        role: "Wicketkeeper Batter",
        stats: { matches: 162, runs: 4120, strikeRate: 137.5, average: 30.5, highest: "119" }
      },
      aiVerdict: "While Rohit brings unparalleled experience and big-match temperament, Sanju currently holds a slight edge in raw strike rate in the middle overs. Expect fireworks from both."
    };
  }

  if (
    (p1.includes("jasprit") || p1.includes("bumrah")) && 
    (p2.includes("trent") || p2.includes("boult"))
  ) {
    return {
      player1: {
        name: "Jasprit Bumrah",
        role: "Fast Bowler",
        stats: { matches: 135, wickets: 162, economy: 7.3, average: 22.8, best: "5/10" }
      },
      player2: {
        name: "Trent Boult",
        role: "Fast Bowler",
        stats: { matches: 98, wickets: 115, economy: 8.1, average: 25.4, best: "4/18" }
      },
      aiVerdict: "Boult is statistically more lethal in the powerplay with the swinging ball, but Bumrah's exceptional economy and death-bowling yorkers make him the ultimate match-winner."
    };
  }

  // Generic fallback
  return {
    player1: {
      name: player1 || "Player A",
      role: "Batter",
      stats: { matches: 100, runs: 3000, strikeRate: 135.0, average: 30.0, highest: "100*" }
    },
    player2: {
      name: player2 || "Player B",
      role: "Bowler",
      stats: { matches: 100, wickets: 120, economy: 7.5, average: 24.0, best: "4/20" }
    },
    aiVerdict: `An intriguing matchup between ${player1 || "Player A"} and ${player2 || "Player B"}. Both have significant match-winning potential.`
  };
};

// V3 Match Predictor Data
export const getDemoPredictorData = (match: string) => {
  const m = match.toLowerCase();
  
  if (m.includes("mi") || m.includes("rr") || m.includes("mumbai")) {
    return {
      matchTitle: "MI vs RR - May 24, Wankhede",
      team1: { name: "Mumbai Indians", probability: 61, color: "#004BA0" },
      team2: { name: "Rajasthan Royals", probability: 39, color: "#EA1A85" },
      reasoning: [
        "MI's phenomenal record at Wankhede gives them a massive home advantage.",
        "Jasprit Bumrah's exceptional form poses a huge threat to RR's top order.",
        "RR has struggled slightly in high-scoring chases on flat tracks recently."
      ]
    };
  }

  // Fallback
  return {
    matchTitle: "CSK vs RCB - Chepauk",
    team1: { name: "Chennai Super Kings", probability: 55, color: "#FFFF3C" },
    team2: { name: "Royal Challengers", probability: 45, color: "#EC1C24" },
    reasoning: [
      "CSK's spin attack is tailor-made for the slow Chepauk surface.",
      "RCB's top heavy batting line-up could struggle if they lose early wickets.",
      "MS Dhoni's tactical brilliance on home turf is unparalleled."
    ]
  };
};
