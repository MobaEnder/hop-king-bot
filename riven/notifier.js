const { EmbedBuilder } = require('discord.js');

module.exports.notify = async (client, auction) => {
  const item = auction.item;

  const stats = item.attributes.map(a =>
    `${a.positive ? "➕" : "➖"} ${a.value} ${a.url_name.replace(/_/g, " ")}`
  ).join("\n");

  const embed = new EmbedBuilder()
    .setTitle(item.name)
    .setURL(`https://warframe.market/auction/${auction.id}`)
    .setColor("Green")
    .addFields(
      { name: "📊 Stats", value: stats },
      { name: "💰 Giá bán", value: auction.buyout_price ? `${auction.buyout_price}p` : "PM Offer", inline: true },
      { name: "👤 Người bán", value: auction.owner.ingame_name, inline: true }
    )
    .setTimestamp();

  await client.channels.cache
    .get(process.env.RIVEN_CHANNEL_ID)
    .send({ embeds: [embed] });
};

