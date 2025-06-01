const axios = require('axios'); const fetch = require('node-fetch');

async function aiCommand(sock, chatId, message) { try { const text = message.message?.conversation || message.message?.extendedTextMessage?.text;

if (!text) {
        return await sock.sendMessage(chatId, { 
            text: "Please provide a question after .gpt or .gemini\n\nExample: .gpt write a basic html code"
        });
    }

    // Get the command and query
    const parts = text.split(' ');
    const command = parts[0].toLowerCase();
    const query = parts.slice(1).join(' ').trim();

    if (!query) {
        return await sock.sendMessage(chatId, { 
            text: "Please provide a question after .gpt or .gemini"
        });
    }

    try {
        // Show processing message
        await sock.sendMessage(chatId, {
            react: { text: '🤖', key: message.key }
        });

        if (command === '.gpt') {
            // Array of GPT API endpoints
            const gptApis = [
                `https://api.giftedtech.web.id/api/ai/ai?apikey=gifted&q=${encodeURIComponent(query)}`,
                `https://api.giftedtech.web.id/api/ai/blackbox?apikey=gifted&q=${encodeURIComponent(query)}`,
                `https://api.giftedtech.web.id/api/ai/gpt4o?apikey=gifted&q=${encodeURIComponent(query)}`,
                `https://api.giftedtech.web.id/api/ai/openai?apikey=gifted&q=${encodeURIComponent(query)}`,
                `https://api.giftedtech.web.id/api/ai/gpt4?apikey=gifted&q=${encodeURIComponent(query)}`
            ];

            for (const api of gptApis) {
                try {
                    const response = await axios.get(api);

                    if (response.data && (response.data.message || response.data.result || response.data.answer || response.data.prompt)) {
                        const answer = response.data.message || response.data.result || response.data.answer || response.data.prompt;
                        await sock.sendMessage(chatId, {
                            text: answer
                        }, {
                            quoted: message
                        });
                        return;
                    }
                } catch (e) {
                    console.warn(`GPT API failed: ${api}`, e);
                    continue; // Try the next API if this one fails
                }
            }

            await sock.sendMessage(chatId, {
                text: "❌ All GPT APIs failed, Elon musk hasnt paid up. Please try again later."
            });
            return;
        } else if (command === '.gemini') {
            const geminiApis = [
                 `https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${encodeURIComponent(query)}`,
                   
                `https://bk9.fun/ai/deepseek-r1?q=${encodeURIComponent(query)}`
            ];

            for (const api of geminiApis) {
                try {
                    const response = await fetch(api);
                    const data = await response.json();

                    if (data.message || data.data || data.answer || data.result) {
                        const answer = data.message || data.data || data.answer || data.result;
                        await sock.sendMessage(chatId, {
                            text: answer
                        }, {
                            quoted: message
                        });
                        return;
                    }
                } catch (e) {
                    console.warn(`Gemini API failed: ${api}`, e);
                    continue; // Try the next API if this one fails
                }
            }

            await sock.sendMessage(chatId, {
                text: "❌ All Gemini APIs failed. Please try again later."
            });
            return;
        }
    } catch (error) {
        console.error('API Error:', error);
        await sock.sendMessage(chatId, {
            text: "❌ Failed to get response. Please try again later.",
            contextInfo: {
                mentionedJid: [message.key.participant || message.key.remoteJid],
                quotedMessage: message.message
            }
        });
    }
} catch (error) {
    console.error('AI Command Error:', error);
    await sock.sendMessage(chatId, {
        text: "❌ An error occurred. Please try again later.",
        contextInfo: {
            mentionedJid: [message.key.participant || message.key.remoteJid],
            quotedMessage: message.message
        }
    });
}

}

module.exports = aiCommand;

