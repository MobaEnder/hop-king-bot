const fetch = require('node-fetch');

module.exports.getAuctions = async () => {
  const res = await fetch(
    "https://api.warframe.market/v1/auctions/search?type=riven&status=open",
    {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://warframe.market/auctions"
      }
    }
  );

  const text = await res.text();

  // 🛑 Nếu bị trả HTML thì bỏ vòng này
  if (text.startsWith("<!doctype")) {
    throw new Error("Cloudflare HTML response");
  }

  const json = JSON.parse(text);

  if (!json?.payload?.auctions) {
    throw new Error("Invalid API response structure");
  }

  return json.payload.auctions;
};
