function formatWithSuffix(value) {
  if (value >= 1e12) return (value / 1e12).toFixed(2) + " T";
  if (value >= 1e9) return (value / 1e9).toFixed(2) + " G";
  if (value >= 1e6) return (value / 1e6).toFixed(2) + " M";
  if (value >= 1e3) return (value / 1e3).toFixed(2) + " K";
  return value?.toLocaleString?.() ?? "Unavailable";
}

let previousBestShare = 0;

function notifyNewBestShare(newShare) {
  const shareElem = document.getElementById("bestshare");
  shareElem.classList.add("highlight");

  const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  audio.play();

  setTimeout(() => {
    shareElem.classList.remove("highlight");
  }, 3000);
}

function updateStats(address) {
  const endpoint = `https://broad-cell-151e.schne564.workers.dev/?address=${address}`;
  fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("address").textContent = data.address;
      document.getElementById("workers").textContent = formatWithSuffix(data.workers);

      const newBestShare = parseFloat(data.bestshare);
      document.getElementById("bestshare").textContent = formatWithSuffix(newBestShare);
      if (newBestShare > previousBestShare) {
        notifyNewBestShare(newBestShare);
        previousBestShare = newBestShare;
      }

      document.getElementById("shares").textContent = data.shares;
      document.getElementById("difficulty").textContent = data.difficulty;
      document.getElementById("lastBlock").textContent = data.lastBlock;
      document.getElementById("soloChance").textContent = data.soloChance;
      document.getElementById("hashrate1hr").textContent = data.hashrate1hr;
      document.getElementById("hashrate5m").textContent = data.hashrate5m;
      document.getElementById("chancePerBlock").textContent = data.chancePerBlock;
      document.getElementById("chancePerDay").textContent = data.chancePerDay;
      document.getElementById("timeEstimate").textContent = data.timeEstimate;

      document.getElementById("lastUpdated").textContent = "Last updated: " + new Date().toLocaleTimeString();
   })
 .catch((err) => {
    console.error("Error fetching data:", err);
      document.getElementById("lastUpdated").textContent = "Error fetching data";
    });
}

function handleAddressSubmit() {
  const address = document.getElementById("btcAddressInput").value.trim();
  if (address) {
    updateStats(address);
  } else {
    alert("Please enter a valid BTC address.");
  }
}

window.onload = () => {
  const defaultAddress = "bc1qd6mfkav3yzztuhpq6qg0kfm5fc2ay7jvy52rdn";
  document.getElementById("btcAddressInput").value = defaultAddress;
  updateStats(defaultAddress);
  setInterval(() => {
    const currentAddress = document.getElementById("btcAddressInput").value.trim();
    if (currentAddress) updateStats(currentAddress);
  }, 5000);
};const endpoint = "https://broad-cell-151e.schne564.workers.dev//api?rate=151&unit=TH";

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
setInterval(fetchStats, 5000); // Refresh every 5 seconds
