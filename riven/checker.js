const { getAuctions } = require('./fetcher');
const { matchRiven } = require('./matcher');
const { notify } = require('./notifier');
const config = require('./config.json');

const seen = new Set();
let errorCooldown = false;

module.exports = function startRivenChecker(client) {
  setInterval(async () => {
    if (errorCooldown) return;

    try {
      const auctions = await getAuctions();

      for (const auction of auctions) {
        if (seen.has(auction.id)) continue;

        if (matchRiven(auction, config)) {
          await notify(client, auction);
          seen.add(auction.id);
        }
      }
    } catch (err) {
      console.error("Riven checker error:", err.message);

      // ⛔ tránh spam log + tránh bị block
      errorCooldown = true;
      setTimeout(() => errorCooldown = false, 15000);
    }
  }, 5000);
};
