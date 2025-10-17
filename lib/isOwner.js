const settings = require("../settings");
const { isSudo } = require("./index");

async function isOwnerOrSudo(senderId) {
  // Normalize senderId to full JID format
  const normalizedSenderId = senderId.includes('@') ? senderId : senderId + '@s.whatsapp.net';

  // Get owner number from settings and normalize
  const ownerJid = settings.ownerNumber.includes('@') ? settings.ownerNumber : settings.ownerNumber + "@s.whatsapp.net";

  if (normalizedSenderId === ownerJid) return true;

  try {
    return await isSudo(normalizedSenderId);
  } catch (e) {
    return false;
  }
}

module.exports = isOwnerOrSudo;
