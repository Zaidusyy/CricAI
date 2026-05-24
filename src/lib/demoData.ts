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

  if (lowercaseQuery.includes("rohit") || lowercaseQuery.includes("sharma")) {
    return {
      type: "player",
      name: "Rohit Sharma",
      role: "Opening Batter",
      team: "Mumbai Indians",
      recentForm: "Matches: 5, Runs: 215, Strike Rate: 148.5, Fifties: 2",
      headToHead: "vs RR: 350 runs in 15 innings at SR 135.",
      pitchConditions: "Wankhede Stadium: Flat track, true bounce, excellent for stroke play.",
    };
  }

  if (lowercaseQuery.includes("bumrah")) {
    return {
      type: "player",
      name: "Jasprit Bumrah",
      role: "Fast Bowler",
      team: "Mumbai Indians",
      recentForm: "Matches: 5, Wickets: 12, Economy: 6.2, Best: 4/15",
      headToHead: "vs RR: 18 wickets in 12 matches, avg 15.4.",
      pitchConditions: "Wankhede Stadium: Good bounce, pace bowlers get early assistance.",
    };
  }

  if (lowercaseQuery.includes("sanju") || lowercaseQuery.includes("samson")) {
    return {
      type: "player",
      name: "Sanju Samson",
      role: "Wicketkeeper Batter",
      team: "Rajasthan Royals",
      recentForm: "Matches: 5, Runs: 180, Strike Rate: 155.0, Fifties: 1",
      headToHead: "vs MI: 280 runs in 14 innings, highest score 74*.",
      pitchConditions: "Sawai Mansingh Stadium: Spin friendly, slow outfield.",
    };
  }

  if (lowercaseQuery.includes("csk") || lowercaseQuery.includes("rcb")) {
    return {
      type: "match",
      match: "CSK vs RCB",
      date: "May 22 2026",
      teams: "Chennai Super Kings vs Royal Challengers Bangalore",
      recentForm: "CSK: W, W, L, W, W | RCB: L, L, W, L, W",
      headToHead: "Overall: CSK 21 - 10 RCB.",
      pitchConditions: "Chepauk Stadium: Spin friendly, slow track. Average 1st innings score: 165.",
      keyPlayers: "CSK: Ruturaj Gaikwad, Ravindra Jadeja | RCB: Virat Kohli, Glenn Maxwell",
      result: "CSK won by 6 wickets. Gaikwad scored 85*."
    };
  }
  
  if (lowercaseQuery.includes("kkr") || lowercaseQuery.includes("srh")) {
    return {
      type: "match",
      match: "KKR vs SRH",
      date: "May 25 2026",
      teams: "Kolkata Knight Riders vs Sunrisers Hyderabad",
      recentForm: "KKR: W, L, L, W, W | SRH: W, W, W, L, L",
      headToHead: "Overall: KKR 16 - 9 SRH.",
      pitchConditions: "Eden Gardens: Good batting deck with some assistance for pacers under lights. Average 1st innings score: 195.",
      keyPlayers: "KKR: Shreyas Iyer, Sunil Narine | SRH: Pat Cummins, Travis Head"
    };
  }

  // Default to MI vs RR (Today)
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
};
