const settings = require("../settings");

async function helpCommand(sock, chatId, channelLink) {
  try {
    await sock.sendMessage(chatId, {
      text: `*🤖 ${
        settings.botName || "𝕊𝔸𝕄𝕂𝕀𝔼𝕃 𝔹𝕆𝕋"
      }\n    Command Menu*\n\n _Follow Channel_\nhttps://whatsapp.com/channel/0029VbAhWo3C6Zvf2t4Rne0h`,
      footer: "Made with 🤍 by ѕαмкιєℓ.∂єν",
      buttonText: "📜 Open Menu",
      sections: [
        {
          title: "🌐 General Commands",
          rows: [
            {
              title: ".help",
              rowId: ".help",
              description: "Show all available commands",
            },
            {
              title: ".ping",
              rowId: ".ping",
              description: "Check bot speed and latency",
            },
            {
              title: ".alive",
              rowId: ".alive",
              description: "Check if bot is running",
            },
            {
              title: ".tts <text>",
              rowId: ".tts Hello",
              description: "Convert text to speech",
            },
            {
              title: ".quote",
              rowId: ".quote",
              description: "Get a random quote",
            },
            {
              title: ".fact",
              rowId: ".fact",
              description: "Random interesting fact",
            },
          ],
        },
        {
          title: "👮‍♂️ Admin Commands",
          rows: [
            {
              title: ".ban @user",
              rowId: ".ban @user",
              description: "Ban a member from using the bot",
            },
            {
              title: ".promote @user",
              rowId: ".promote @user",
              description: "Promote member to admin",
            },
            {
              title: ".demote @user",
              rowId: ".demote @user",
              description: "Demote admin to member",
            },
            {
              title: ".kick @user",
              rowId: ".kick @user",
              description: "Remove user from group",
            },
            {
              title: ".tagall",
              rowId: ".tagall",
              description: "Mention all members in group",
            },
            {
              title: ".antilink",
              rowId: ".antilink",
              description: "Enable or disable anti-link protection",
            },
          ],
        },
        {
          title: "🎮 Game Commands",
          rows: [
            {
              title: ".tictactoe @user",
              rowId: ".tictactoe",
              description: "Play Tic Tac Toe with a friend",
            },
            {
              title: ".hangman",
              rowId: ".hangman",
              description: "Start a game of Hangman",
            },
            {
              title: ".trivia",
              rowId: ".trivia",
              description: "Answer random trivia questions",
            },
            {
              title: ".truth",
              rowId: ".truth",
              description: "Get a truth question",
            },
            {
              title: ".dare",
              rowId: ".dare",
              description: "Get a dare challenge",
            },
          ],
        },
        {
          title: "🤖 AI Commands",
          rows: [
            {
              title: ".gpt <question>",
              rowId: ".gpt What is AI?",
              description: "Chat with GPT AI",
            },
            {
              title: ".gemini <question>",
              rowId: ".gemini Explain quantum computing",
              description: "Ask Google Gemini AI",
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error("Error in help command:", error);
    await sock.sendMessage(chatId, {
      text: "❌ Failed to load menu. Please try again later.",
    });
  }
}

module.exports = helpCommand;
