async function githubCommand(sock, chatId) {
    const repoInfo = `*🤖SAMKIEL BOT*

*📂 GitHub Repository:*
https://github.com/samkiel488/SAMKIEL-AI 

_Star ⭐ the repository if you like the bot!_`;

    try {
        await sock.sendMessage(chatId, {
            text: repoInfo,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363400862271383@newsletter',
                    newsletterName: '𝕊𝔸𝕄𝕂𝕀𝔼𝕃 𝔹𝕆𝕋',
                    serverMessageId: -1
                }
            }
        });
    } catch (error) {
        console.error('Error in github command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error fetching repository information.' 
        });
    }
}

module.exports = githubCommand; 