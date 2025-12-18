module.exports.matchRiven = (auction, config) => {
  const item = auction.item;

  if (!item.weapon_url_name.includes(config.weapon.toLowerCase()))
    return false;

  const positives = item.attributes
    .filter(a => a.positive)
    .map(a => a.url_name);

  const negative = item.attributes.find(a => !a.positive)?.url_name || "";

  for (const stat of config.stats) {
    if (!positives.includes(stat)) return false;
  }

  if (config.negative && !negative.includes(config.negative))
    return false;

  return true;
};
