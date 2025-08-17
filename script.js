export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const address = url.searchParams.get("address") || "bc1qd6mfkav3yzztuhpq6qg0kfm5fc2ay7jvy52rdn";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    try {
      // --- CKPool User Data ---
      const userRes = await fetch(`https://solo.ckpool.org/users/${address}`);
      if (!userRes.ok) throw new Error("Failed to fetch CKPool user data");
      const userData = await userRes.json();

      // --- Bitcoin Network Difficulty ---
      const diffRes = await fetch("https://blockchain.info/q/getdifficulty");
      const difficulty = parseFloat(await diffRes.text());

      // --- Latest Block Height ---
      const blockRes = await fetch("https://blockchain.info/q/getblockcount");
      const lastBlock = parseInt(await blockRes.text(), 10);

      // --- Shares from userData ---
      const shares = userData.shares || 0;

      // --- Hashrate 5m ---
      let hashrate5mHps = 0;
      if (userData.hashrate5m && parseFloat(userData.hashrate5m) > 1e5) {
        hashrate5mHps = parseFloat(userData.hashrate5m);
      } else if (userData.workerList?.length > 0) {
        for (const worker of userData.workerList) {
          if (worker.hashrate5m) hashrate5mHps += parseFloat(worker.hashrate5m);
        }
      } else if (userData.hashrate5m) {
        hashrate5mHps = parseFloat(userData.hashrate5m) * 1e12;
      }

      // --- Hashrate 1hr ---
      let hashrateHps = 0;
      if (userData.hashrate1hr && parseFloat(userData.hashrate1hr) > 1e5) {
        hashrateHps = parseFloat(userData.hashrate1hr);
      } else if (userData.workerList?.length > 0) {
        for (const worker of userData.workerList) {
          if (worker.hashrate1hr) {
            hashrateHps += parseFloat(worker.hashrate1hr);
          } else if (worker.hashrate) {
            hashrateHps += parseFloat(worker.hashrate);
          }
        }
      } else if (userData.hashrate1hr) {
        hashrateHps = parseFloat(userData.hashrate1hr) * 1e12;
      }

      // --- Local Chance ---
      const bestShare = parseFloat(userData.bestshare || 0);
      let localChance = null;
      if (bestShare > 0 && difficulty > 0) {
        localChance = (bestShare / (difficulty * Math.pow(2, 32))) * 100;
      }

      // --- Solo Mining Stats ---
      let chancePerBlock = "Unavailable";
      let chancePerDay = "Unavailable";
      let timeEstimate = "Unavailable";
      let soloChance = "Unavailable";

      if (hashrateHps > 0 && difficulty > 0) {
        const targetHashes = difficulty * Math.pow(2, 32);
        const blocksPerDay = 144;

        const probPerBlock = targetHashes / hashrateHps;
        const probPerDay = targetHashes / (hashrateHps * blocksPerDay);

        chancePerBlock = `1 in ${formatLargeNumber(probPerBlock)}`;
        chancePerDay = `1 in ${formatLargeNumber(probPerDay)}`;
        timeEstimate = `${(probPerBlock / blocksPerDay).toFixed(2)} days`;
        soloChance = `${(1 / probPerDay * 100).toFixed(8)}%`;
      }

      // --- Final JSON Output ---
      return new Response(JSON.stringify({
        address,
        bestshare: bestShare,
        shares, // NEW FIELD
        workers: userData.workers || 0,
        workerList: userData.workerList || [],
        difficulty: formatDifficulty(difficulty),
        lastBlock,
        localChance,
        soloChance,
        chancePerBlock,
        chancePerDay,
        timeEstimate,
        hashrate1hr: hashrateHps > 0 ? formatHashrate(hashrateHps) : "Unavailable",
        hashrate5m: hashrate5mHps > 0 ? formatHashrate(hashrate5mHps) : "Unavailable"
      }), { headers: corsHeaders() });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders()
      });
    }
  }
};

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "*"
  };
}

function formatDifficulty(diff) {
  if (diff >= 1e12) return (diff / 1e12).toFixed(2) + "T";
  if (diff >= 1e9) return (diff / 1e9).toFixed(2) + "G";
  if (diff >= 1e6) return (diff / 1e6).toFixed(2) + "M";
  return diff.toFixed(2);
}

function formatHashrate(hps) {
  const units = ["H/s", "KH/s", "MH/s", "GH/s", "TH/s", "PH/s"];
  let i = 0;
  while (hps >= 1000 && i < units.length - 1) {
    hps /= 1000;
    i++;
  }
  return `${hps.toFixed(2)} ${units[i]}`;
}

function formatLargeNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "G";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(2);
}
