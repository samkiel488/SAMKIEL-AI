const { jidNormalizedUser } = require("@whiskeysockets/baileys");

const settings = {
  packname: "𝕊𝔸𝕄𝕂𝕀𝔼𝕃 𝔹𝕆𝕋",
  author: "‎",
  botName: "𝕊𝔸𝕄𝕂𝕀𝔼𝕃 𝔹𝕆𝕋",
  botOwner: "ѕαмкιєℓ.∂єν", // Your name
  ownerNumber: jidNormalizedUser("2348087357158@s.whatsapp.net"), // Normalized JID for owner
  botNumber: " ", // Set the bot's WhatsApp number for pairing (without + symbol, just country code & number)
  giphyApiKey: "qnl7ssQChTdPjsKta2Ax2LMaGXz303tq",
  commandMode: "public",
  description:
    "This is a bot for managing group commands and automating tasks.",
  version: "2.0",
};

module.exports = settings;
