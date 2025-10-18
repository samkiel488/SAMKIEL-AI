const { jidNormalizedUser } = require('@whiskeysockets/baileys');
const fs = require('fs');

function isOwner(senderId) {
  console.log(`🔍 Checking owner status for sender: ${senderId}`);
  try {
    const rawOwnerList = JSON.parse(fs.readFileSync("./data/owner.json"));
    console.log(`📋 Raw owner list:`, rawOwnerList);

    // Extract the number part from the sender's JID (remove @s.whatsapp.net or @lid)
    const senderNumber = senderId.split('@')[0];
    console.log(`📱 Extracted sender number: ${senderNumber}`);

    // Check if the extracted number is in the raw owner list
    const isOwnerCheck = rawOwnerList.includes(senderNumber);
    console.log(`👑 isOwner result: ${isOwnerCheck}`);

    return isOwnerCheck;
  } catch (error) {
    console.error("❌ Error checking owner status:", error);
    return false;
  }
}

module.exports = isOwner;
