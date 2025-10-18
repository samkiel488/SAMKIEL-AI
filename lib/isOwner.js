const { jidNormalizedUser } = require('@whiskeysockets/baileys');
const fs = require('fs');

function isOwner(senderId) {
  console.log(`🔑 Checking owner status for sender: ${senderId}`);
  try {
    console.log(`📂 Reading owner list from data/owner.json`);
    const rawOwnerList = JSON.parse(fs.readFileSync("./data/owner.json"));
    console.log(`📋 Raw owner list:`, rawOwnerList);

    const ownerList = rawOwnerList.map(j => jidNormalizedUser(`${j}@s.whatsapp.net`));
    console.log(`🔄 Normalized owner list:`, ownerList);

    const normalizedSender = jidNormalizedUser(senderId);
    console.log(`👤 Normalized sender: ${normalizedSender}`);

    const isOwnerCheck = ownerList.includes(normalizedSender);
    console.log(`👑 isOwner result: ${isOwnerCheck}`);

    return isOwnerCheck;
  } catch (error) {
    console.error("❌ Error checking owner status:", error);
    return false;
  }
}

module.exports = isOwner;
