const { getAuctions } = require('./fetcher');
const { matchRiven } = require('./matcher');
const { notify } = require('./notifier');
const config = require('./config.json');

const seen = new Set();

module.exports = function startRivenChecker(client) {
  setInterval(async () => {
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
    }
  }, 5000);
};
