// Initialize Supabase
const SUPABASE_URL = "https://hnpjwuhcekiecxpvsjyg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_uedrHkz8UEYeVk5JdSH8Cg_HTHuKjqx";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchMatches() {
  // Fetch all matches
  const { data: matches, error } = await supabase
    .from("matches")
    .select("*")
    .order("time", { ascending: true });

  if (error) {
    console.error("Error fetching matches:", error);
    return;
  }

  const matchesList = document.getElementById("matches-list");
  matchesList.innerHTML = "";

  for (let match of matches) {
    const div = document.createElement("div");
    div.className = "match-card";
    div.innerHTML = `
      <h3>Match ID: ${match.matchId}</h3>
      <p>Tournament ID: ${match.tournamentId}</p>
      <p>Room ID: ${match.roomId}</p>
      <p>Time: ${new Date(match.time).toLocaleString()}</p>
      <button onclick="verifyResults('${match.matchId}')">Verify Results</button>
    `;
    matchesList.appendChild(div);
  }
}

async function verifyResults(matchId) {
  // Fetch results for this match
  const { data: results, error } = await supabase
    .from("results")
    .select("*")
    .eq("matchId", matchId);

  if (error) {
    console.error("Error fetching results:", error);
    return;
  }

  for (let result of results) {
    // Admin manual verification logic here
    // Example: auto-approve all for testing
    await supabase
      .from("results")
      .update({ status: "verified" })
      .eq("resultId", result.resultId);
  }

  alert("Results verified for match: " + matchId);
  fetchMatches();
}

// Initial fetch
fetchMatches();