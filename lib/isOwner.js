const settings = require("../settings");
const { isSudo } = require("./index");
const fs = require('fs');
const path = require('path');

async function isOwnerOrSudo(senderId) {
  // Normalize senderId to full JID format
  const normalizedSenderId = senderId.includes('@') ? senderId : senderId + '@s.whatsapp.net';

  // Get owner number from settings and normalize
  const ownerJid = settings.ownerNumber.includes('@') ? settings.ownerNumber : settings.ownerNumber + "@s.whatsapp.net";

  if (normalizedSenderId === ownerJid) return true;

  // Check owner.json
  try {
    const ownerDataPath = path.join(__dirname, '../data/owner.json');
    if (fs.existsSync(ownerDataPath)) {
      const ownerData = JSON.parse(fs.readFileSync(ownerDataPath, 'utf8'));
      const ownerNumbers = ownerData.map(num => num.includes('@') ? num : num + '@s.whatsapp.net');
      if (ownerNumbers.includes(normalizedSenderId)) return true;
    }
  } catch (e) {
    console.error('Error checking owner.json:', e);
  }

  // Check sudo
  try {
    return await isSudo(normalizedSenderId);
  } catch (e) {
    return false;
  }
}

module.exports = isOwnerOrSudo;
