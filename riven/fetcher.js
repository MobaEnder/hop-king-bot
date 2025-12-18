const fetch = require('node-fetch');

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": "https://warframe.market/auctions",
  "Connection": "keep-alive"
};

module.exports.getAuctionsByWeapon = async (weapon) => {
  const url =
    `https://api.warframe.market/v1/auctions/search` +
    `?type=riven&weapon_url_name=${weapon}&status=open`;

  const res = await fetch(url, {
    method: "GET",
    headers: HEADERS
  });

  const text = await res.text();

  // ❌ Cloudflare block / challenge
  if (!text || text.startsWith("<")) {
    throw new Error("Cloudflare block (HTML response)");
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("JSON parse failed");
  }

  if (!json?.payload?.auctions) {
    throw new Error("Invalid API payload");
  }

  return json.payload.auctions;
};
