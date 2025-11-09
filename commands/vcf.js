const fs = require("fs");
const path = require("path");
const { jidNormalizedUser } = require("@whiskeysockets/baileys");

async function vcfCommand(sock, chatId) {
  try {
    // Send waiting message
    await sock.sendMessage(chatId, {
      text: "⏳ Generating group VCF, please wait...",
    });

    // Fetch group metadata
    const groupMetadata = await sock.groupMetadata(chatId);
    const participants = groupMetadata.participants;

    console.log(
      `Total participants fetched: ${participants ? participants.length : 0}`
    );

    if (!participants || participants.length === 0) {
      await sock.sendMessage(chatId, {
        text: "❌ Failed to create VCF file.",
      });
      return;
    }

    // Generate VCF content
    let vcfContent = "";
    let count = 1;
    const uniqueNumbers = new Set();

    for (const member of participants) {
      let jid = member.id;
      console.log("Processing JID:", jid);

      // Normalize @lid → @s.whatsapp.net
      jid = jidNormalizedUser(jid);

      if (!jid.endsWith("@s.whatsapp.net")) {
        console.log("Skipping non-user JID:", jid);
        continue;
      }

      const number = jid.split("@")[0];
      if (!/^\d{10,15}$/.test(number)) {
        console.log("Skipping invalid number:", number);
        continue;
      }

      if (uniqueNumbers.has(number)) continue;
      uniqueNumbers.add(number);

      let name;
      if (number === "2348087357158") {
        name = "ѕαмкιєℓ.∂єν";
      } else {
        const contact = sock.store?.contacts?.[jid] || {};
        name = contact.name || contact.notify || `samkielvcf_${count}`;
      }

      vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;TYPE:CELL:+${number}\nEND:VCARD\n`;
      count++;
    }

    console.log(`Valid contacts found: ${count - 1}`);

    if (vcfContent.length === 0) {
      await sock.sendMessage(chatId, {
        text: "❌ Failed to create VCF file.",
      });
      return;
    }

    // Save file in /temp folder as group_contacts.vcf
    const filePath = path.join(__dirname, "../temp", "group_contacts.vcf");
    fs.writeFileSync(filePath, vcfContent);

    // Send the file
    await sock.sendMessage(chatId, {
      document: { url: filePath },
      mimetype: "text/vcard",
      fileName: "group_contacts.vcf",
      caption: `📇 Group contacts exported successfully! ✅\nTotal: ${
        count - 1
      } contacts`,
    });

    // Delete the file
    fs.unlinkSync(filePath);

    // Console log total contacts
    console.log(`Total contacts exported: ${count - 1}`);
  } catch (err) {
    console.error("Error generating VCF:", err);
    await sock.sendMessage(chatId, { text: "❌ Failed to create VCF file." });
  }
}

module.exports = { vcfCommand };
