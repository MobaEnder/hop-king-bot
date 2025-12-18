module.exports.matchRiven = (auction, config) => {
  const item = auction.item;

  if (!item || !item.weapon_url_name) return false;
  if (item.weapon_url_name !== config.weapon) return false;

  const positives = item.attributes
    .filter(a => a.positive)
    .map(a => a.url_name);

  const negative =
    item.attributes.find(a => !a.positive)?.url_name || "";

  for (const stat of config.stats) {
    if (!positives.includes(stat)) return false;
  }

  if (config.negative && !negative.includes(config.negative)) {
    return false;
  }

  return true;
};
