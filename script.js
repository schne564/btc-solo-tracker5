const endpoint = "https://broad-cell-151e.schne564.workers.dev/";

async function fetchStats() {
  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    document.getElementById("blockHeight").textContent = data.lastBlock ?? "Unavailable";
    document.getElementById("difficulty").textContent = data.difficulty ?? "Unavailable";
    document.getElementById("soloChance").textContent = data.soloChance ?? "Unavailable";
    document.getElementById("chanceBlock").textContent = data.chancePerBlock ?? "Unavailable";
    document.getElementById("chanceDay").textContent = data.chancePerDay ?? "Unavailable";
    document.getElementById("timeEstimate").textContent = data.timeEstimate ?? "Unavailable";
    document.getElementById("hashrate1hr").textContent = data.hashrate1hr ?? "Unavailable";
    document.getElementById("hashrate5m").textContent = data.hashrate5m ?? "Unavailable";
    document.getElementById("bestShare").textContent = data.bestshare ?? "Unavailable";
    document.getElementById("shares").textContent = data.shares ?? "Unavailable";
    document.getElementById("workers").textContent = data.workers ?? "Unavailable";
    document.getElementById("lastUpdated").textContent = new Date().toLocaleString();
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

fetchStats();
setInterval(fetchStats, 30000); // Refresh every 30 seconds
