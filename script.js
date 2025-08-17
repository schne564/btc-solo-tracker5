function formatWithSuffix(value) {
  if (value >= 1e12) return (value / 1e12).toFixed(2) + " T";
  if (value >= 1e9) return (value / 1e9).toFixed(2) + " G";
  if (value >= 1e6) return (value / 1e6).toFixed(2) + " M";
  if (value >= 1e3) return (value / 1e3).toFixed(2) + " K";
  return value?.toLocaleString?.() ?? "Unavailable";
}

let previousShares = 0;

function updateStats(address) {
  const endpoint = `https://broad-cell-151e.schne564.workers.dev/?address=${address}`;
  fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("address").textContent = data.address;
      document.getElementById("workers").textContent = formatWithSuffix(data.workers);
      document.getElementById("bestshare").textContent = formatWithSuffix(data.bestshare);

      const currentShares = parseFloat(data.shares.replace(/[^\d.]/g, ''));
      if (currentShares > previousShares) {
        showNotification(`🎉 Shares increased to ${data.shares}`);
        previousShares = currentShares;
      }
      document.getElementById("shares").textContent = formatWithSuffix(data.shares);

      document.getElementById("difficulty").textContent = formatWithSuffix(data.difficulty);
      document.getElementById("lastBlock").textContent = formatWithSuffix(data.lastBlock);
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

function showNotification(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "toast";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function handleAddressSubmit() {
  const address = document.getElementById("btcAddressInput").value.trim();
  if (address) {
    updateStats(address);
  }
}
