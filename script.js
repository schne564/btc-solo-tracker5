const wallet = "bc1qd6mfkav3yzztuhpq6qg0kfm5fc2ay7jvy52rdn";
const endpoint = `https://your-cloudflare-worker-url.com/api?wallet=${wallet}`;

async function fetchStats() {
  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    document.getElementById("workers").textContent = data.workers ?? "Unavailable";
    document.getElementById("bestShare").textContent = data.bestShare ?? "Unavailable";
    document.getElementById("shares").textContent = data.shares ?? "Unavailable";
    document.getElementById("difficulty").textContent = data.difficulty ?? "Unavailable";
    document.getElementById("lastBlock").textContent = data.lastBlock ?? "Unavailable";
    document.getElementById("hashrate1hr").textContent = data.hashrate1hr ?? "Unavailable";
    document.getElementById("hashrate5m").textContent = data.hashrate5m ?? "Unavailable";
    document.getElementById("chanceBlock").textContent = data.chanceBlock ?? "Unavailable";
    document.getElementById("chanceDay").textContent = data.chanceDay ?? "Unavailable";
    document.getElementById("timeEstimate").textContent = data.timeEstimate ?? "Unavailable";
    document.getElementById("lastUpdated").textContent = new Date().toLocaleString();
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

fetchStats();
setInterval(fetchStats, 30000); // Refresh every 30 seconds
