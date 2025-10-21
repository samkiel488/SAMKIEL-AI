const settings = require("../settings");
async function aliveCommand(sock, chatId, message) {
    try {
        const message = `*𝕊𝔸𝕄𝕂𝕀𝔼𝕃 𝔹𝕆𝕋 is Active!*\n\n` +
                       `*Version:* ${settings.version}\n` +
                       `*Status:* Online\n` +
                       `*Mode:* Public\n\n` +
                       `*🌟 Features:*\n` +
                       `• Group Management\n` +
                       `• Artificial Intelligence\n` +
                       `• Fun Commands\n` +
                       `• And more!\n\n` +
                       `Type *.menu* for full command list`;

        await global.reply(sock, message, {
            text: message,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363400862271383@newsletter',
                    newsletterName: 'Ԇ・SAMKIEL',
                    serverMessageId: -1
                }
            }
        });
    } catch (error) {
        console.error('Error in alive command:', error);
        await global.reply(sock, message, { text: 'Bot is alive and running!' });
    }
}

module.exports = aliveCommand;
