function formatWithSuffix(value) {
  if (value >= 1e12) return (value / 1e12).toFixed(2) + " T";
  if (value >= 1e9) return (value / 1e9).toFixed(2) + " G";
  if (value >= 1e6) return (value / 1e6).toFixed(2) + " M";
  if (value >= 1e3) return (value / 1e3).toFixed(2) + " K";
  return value?.toLocaleString?.() ?? "Unavailable";
}

function calculateSoloOdds(userHashrateTH) {
  const networkHashrateEH = 907;
  const blocksPerDay = 144;
  const userHashrateH = userHashrateTH * 1e12;
  const networkHashrateH = networkHashrateEH * 1e18;
  const chancePerBlock = userHashrateH / networkHashrateH;
  const oddsPerBlock = 1 / chancePerBlock;
  const chancePerDay = chancePerBlock * blocksPerDay;
  const oddsPerDay = 1 / chancePerDay;
  const oddsPerHour = oddsPerDay / 24;

  return {
    chancePerBlock: `1 in ${Math.round(oddsPerBlock).toLocaleString()}`,
    chancePerHour: `1 in ${Math.round(oddsPerHour).toLocaleString()}`,
    chancePerDay: `1 in ${Math.round(oddsPerDay).toLocaleString()}`,
    timeEstimate: `${(oddsPerDay / 365).toFixed(2)} years`
  };
}

let previousBestShare = 0;
let previousShares = 0;

function notifyMilestone(elementId, message) {
  const elem = document.getElementById(elementId);
  elem.classList.add("highlight", "pulse");

  const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg");
  audio.play();

  const banner = document.getElementById("milestoneBanner");
  banner.textContent = message;
  banner.style.display = "block";

  setTimeout(() => {
    elem.classList.remove("highlight", "pulse");
    banner.style.display = "none";
  }, 3000);
}

function updateStats(address) {
  const endpoint = `https://broad-cell-151e.schne564.workers.dev/?address=${address}`;
  fetch(endpoint)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log("Fetched data:", data); // ✅ Debug log

      document.getElementById("address").textContent = data.address ?? "Unavailable";
      document.getElementById("workers").textContent = formatWithSuffix(data.workers);

      const newBestShare = parseFloat(data.bestshare);
      document.getElementById("bestshare").textContent = formatWithSuffix(newBestShare);
      if (newBestShare > previousBestShare) {
        notifyMilestone("bestshare", `🎉 New Best Share: ${formatWithSuffix(newBestShare)}`);
        previousBestShare = newBestShare;
      }

      const newShares = parseFloat(data.shares);
      document.getElementById("shares").textContent = formatWithSuffix(newShares);
      if (newShares > previousShares) {
        notifyMilestone("shares", `📈 Shares Increased: ${formatWithSuffix(newShares)}`);
        previousShares = newShares;
      }

      document.getElementById("difficulty").textContent = formatWithSuffix(data.difficulty);
      document.getElementById("lastBlock").textContent = formatWithSuffix(data.lastBlock);
      document.getElementById("soloChance").textContent = data.soloChance ?? "Unavailable";
      document.getElementById("hashrate1hr").textContent = data.hashrate1hr ?? "Unavailable";
      document.getElementById("hashrate5m").textContent = data.hashrate5m ?? "Unavailable";

      document.getElementById("chancePerBlock").textContent = data.chancePerBlock ?? "Unavailable";
      document.getElementById("chancePerDay").textContent = data.chancePerDay ?? "Unavailable";
      document.getElementById("timeEstimate").textContent = data.timeEstimate
        ? `${(parseFloat(data.timeEstimate) / 365).toFixed(2)} years`
        : "Unavailable";

      const hashrateTH = parseFloat(data.hashrate1hr?.replace(/[^\d.]/g, ""));
      if (!isNaN(hashrateTH)) {
        const odds = calculateSoloOdds(hashrateTH);
        document.getElementById("chancePerHour").textContent = odds.chancePerHour;
      } else {
        document.getElementById("chancePerHour").textContent = "Unavailable";
      }

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

const silentAudio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEA...");
silentAudio.play(); // triggers audio context

let soundUnlocked = false;
function unlockSound() {
  if (soundUnlocked) return;
  soundUnlocked = true;

  const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg");
  audio.play().catch(() => {
    console.warn("Audio unlock attempt failed.");
  });
}

document.addEventListener("click", unlockSound);
document.addEventListener("touchstart", unlockSound);

window.onload = () => {
  const defaultAddress = "bc1qd6mfkav3yzztuhpq6qg0kfm5fc2ay7jvy52rdn";
  document.getElementById("btcAddressInput").value = defaultAddress;
  updateStats(defaultAddress);
  setInterval(() => {
    const currentAddress = document.getElementById("btcAddressInput").value.trim();
    if (currentAddress) updateStats(currentAddress);
  }, 5000);
};
