const fs = require("fs");
const path = require("path");

async function vcfCommand(sock, chatId) {
  try {
    const groupMetadata = await sock.groupMetadata(chatId);
    const participants = groupMetadata.participants;

    if (!participants || participants.length === 0) {
      await sock.sendMessage(chatId, {
        text: "No participants found in this group.",
      });
      return;
    }

    let vcfContent = "";

    for (const member of participants) {
      const jid = member.id;
      const number = jid.split("@")[0];
      const contact = sock.store?.contacts?.[jid] || {};
      const name = contact.name || contact.notify || `samkielvcf_${number}`;
      const displayName = name.replace(/\s+/g, "_");

      vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${displayName}\nTEL;TYPE=CELL:+${number}\nEND:VCARD\n`;
    }

    const filePath = path.join(__dirname, "../temp", `samkielvcf.vcf`);
    fs.writeFileSync(filePath, vcfContent);

    await sock.sendMessage(chatId, {
      document: { url: filePath },
      mimetype: "text/vcard",
      fileName: `samkielvcf.vcf`,
      caption: "📇 Group contacts exported successfully!",
    });

    fs.unlinkSync(filePath); // clean up
  } catch (err) {
    console.error("Error generating VCF:", err);
    await sock.sendMessage(chatId, { text: "❌ Failed to create VCF file." });
  }
}

module.exports = { vcfCommand };
