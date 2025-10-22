const settings = require("../settings");
const os = require("os");

// helper function to format uptime nicely
function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

async function helpCommand(sock, chatId, channelLink) {
  try {
    // Calculate uptime
    const uptime = formatUptime(process.uptime());

    // Count total commands (keep updated or compute dynamically)
    const totalCommands = 96;

    await sock.sendMessage(chatId, {
      text: `╭───〔 🤖 ${settings.botName || "𝕊𝔸𝕄𝕂𝕀𝔼𝕃 𝔹𝕆𝕋"} 〕───╮
│ ⏱️ Uptime: ${uptime}
│ ⚙️ Commands: ${totalCommands}
│ 🌟 Version: ${settings.version || "3.2"}
│ 🛠️ Developer: ${settings.botOwner || "ѕαмкιєℓ.∂єν"}
│ 🌐 Website: https://samkiel.dev
│ 
│ 📣 Follow Channel:
│ https://whatsapp.com/channel/0029VbAhWo3C6Zvf2t4Rne0h
╰──────────────────╯`,
      footer: "Made with 🤍 by ѕαмкιєℓ.∂єν",
      buttonText: "📜 Open Menu",
      sections: [
        {
          title: "🌐 General Commands",
          rows: [
            {
              title: "help",
              rowId: ".help",
              description: "Show all available commands",
            },
            {
              title: "ping",
              rowId: ".ping",
              description: "Check bot speed and latency",
            },
            {
              title: "alive",
              rowId: ".alive",
              description: "Check if bot is running",
            },
            {
              title: "tts <text>",
              rowId: ".tts Hello",
              description: "Convert text to speech",
            },
            {
              title: "owner",
              rowId: ".owner",
              description: "Show bot owner details",
            },
            {
              title: "joke",
              rowId: ".joke",
              description: "Send a random joke",
            },
            {
              title: "quote",
              rowId: ".quote",
              description: "Get a random quote",
            },
            {
              title: "fact",
              rowId: ".fact",
              description: "Random interesting fact",
            },
            {
              title: "weather <city>",
              rowId: ".weather Lagos",
              description: "Weather info for a city",
            },
            {
              title: "news",
              rowId: ".news",
              description: "Get latest news headlines",
            },
          ],
        },
        {
          title: "👮‍♂️ Admin Commands",
          rows: [
            {
              title: "ban @user",
              rowId: ".ban @user",
              description: "Ban a member from using the bot",
            },
            {
              title: "promote @user",
              rowId: ".promote @user",
              description: "Promote member to admin",
            },
            {
              title: "demote @user",
              rowId: ".demote @user",
              description: "Demote admin to member",
            },
            {
              title: "mute <minutes>",
              rowId: ".mute 10",
              description: "Mute group for N minutes",
            },
            { title: "unmute", rowId: ".unmute", description: "Unmute group" },
            {
              title: "delete / del",
              rowId: ".delete",
              description: "Delete a bot message",
            },
            {
              title: "kick @user",
              rowId: ".kick @user",
              description: "Remove user from group",
            },
            {
              title: "warnings @user",
              rowId: ".warnings @user",
              description: "Show warnings for user",
            },
            {
              title: "warn @user",
              rowId: ".warn @user",
              description: "Warn a user",
            },
            {
              title: "antilink",
              rowId: ".antilink",
              description: "Enable or disable anti-link protection",
            },
          ],
        },
        {
          title: "🔒 Owner Commands",
          rows: [
            {
              title: "mode",
              rowId: ".mode",
              description: "Switch between public and private modes",
            },
            {
              title: "autostatus",
              rowId: ".autostatus",
              description: "Toggle automatic status updates",
            },
            {
              title: "clearsession",
              rowId: ".clearsession",
              description: "Clear all login sessions",
            },
            {
              title: "antidelete",
              rowId: ".antidelete",
              description: "Toggle anti-delete feature",
            },
            {
              title: "cleartmp",
              rowId: ".cleartmp",
              description: "Clear temporary files",
            },
            {
              title: "setpp",
              rowId: ".setpp",
              description: "Set bot profile picture",
            },
            {
              title: "autoreact",
              rowId: ".areact",
              description: "Enable/disable auto reactions",
            },
          ],
        },
        {
          title: "🎨 Image / Sticker",
          rows: [
            {
              title: "blur <image>",
              rowId: ".blur",
              description: "Blur an image",
            },
            {
              title: "simage",
              rowId: ".simage",
              description: "Convert sticker to image",
            },
            {
              title: "sticker",
              rowId: ".sticker",
              description: "Convert image to sticker",
            },
            {
              title: "tgsticker <link>",
              rowId: ".tgsticker <link>",
              description: "Telegram sticker link",
            },
            { title: "meme", rowId: ".meme", description: "Generate a meme" },
            {
              title: "take <packname>",
              rowId: ".take mypack",
              description: "Change sticker pack info",
            },
            {
              title: "emojimix",
              rowId: ".emojimix 😊+🔥",
              description: "Mix two emojis together",
            },
          ],
        },
        {
          title: "🎮 Game Commands",
          rows: [
            {
              title: "tictactoe",
              rowId: ".tictactoe",
              description: "Play Tic Tac Toe with a friend",
            },
            {
              title: "hangman",
              rowId: ".hangman",
              description: "Start a game of Hangman",
            },
            {
              title: "guess <letter>",
              rowId: ".guess a",
              description: "Guess a letter for hangman",
            },
            {
              title: "trivia",
              rowId: ".trivia",
              description: "Start a trivia game",
            },
            {
              title: "answer <answer>",
              rowId: ".answer theAnswer",
              description: "Answer a trivia question",
            },
            {
              title: "truth",
              rowId: ".truth",
              description: "Get a truth question",
            },
            {
              title: "dare",
              rowId: ".dare",
              description: "Get a dare challenge",
            },
          ],
        },
        {
          title: "🤖 AI Commands",
          rows: [
            {
              title: "gpt <question>",
              rowId: ".gpt What is AI?",
              description: "Chat with GPT",
            },
            {
              title: "gemini <question>",
              rowId: ".gemini Explain quantum computing",
              description: "Ask Google Gemini",
            },
          ],
        },
        {
          title: "🎯 Fun Commands",
          rows: [
            {
              title: "compliment @user",
              rowId: ".compliment @user",
              description: "Compliment a user",
            },
            {
              title: "insult @user",
              rowId: ".insult @user",
              description: "Funny insult",
            },
            {
              title: "flirt",
              rowId: ".flirt",
              description: "Send a flirt line",
            },
            {
              title: "shayari",
              rowId: ".shayari",
              description: "Send a shayari",
            },
            {
              title: "goodnight",
              rowId: ".goodnight",
              description: "Send a goodnight message",
            },
            {
              title: "roseday",
              rowId: ".roseday",
              description: "Send rose greeting",
            },
            {
              title: "character @user",
              rowId: ".character @user",
              description: "Create a character for user",
            },
            {
              title: "wasted @user",
              rowId: ".wasted @user",
              description: "Wasted meme effect",
            },
            {
              title: "ship @user",
              rowId: ".ship @user",
              description: "Ship two users",
            },
            {
              title: "simp @user",
              rowId: ".simp @user",
              description: "Check simp level",
            },
          ],
        },
        {
          title: "🔤 Textmaker (A)",
          rows: [
            {
              title: "metallic <text>",
              rowId: ".metallic Hello",
              description: "Metallic text effect",
            },
            {
              title: "ice <text>",
              rowId: ".ice Hello",
              description: "Icy text effect",
            },
            {
              title: "snow <text>",
              rowId: ".snow Hello",
              description: "Snow text effect",
            },
            {
              title: "impressive <text>",
              rowId: ".impressive Hello",
              description: "Impressive style text",
            },
            {
              title: "matrix <text>",
              rowId: ".matrix Hello",
              description: "Matrix style text",
            },
            {
              title: "light <text>",
              rowId: ".light Hello",
              description: "Light effect text",
            },
            {
              title: "neon <text>",
              rowId: ".neon Hello",
              description: "Neon glowing text",
            },
            {
              title: "devil <text>",
              rowId: ".devil Hello",
              description: "Devil style text",
            },
            {
              title: "purple <text>",
              rowId: ".purple Hello",
              description: "Purple text effect",
            },
          ],
        },
        {
          title: "🔤 Textmaker (B)",
          rows: [
            {
              title: "thunder <text>",
              rowId: ".thunder Hello",
              description: "Thunder style text",
            },
            {
              title: "leaves <text>",
              rowId: ".leaves Hello",
              description: "Leaves text effect",
            },
            {
              title: "1917 <text>",
              rowId: ".1917 Hello",
              description: "1917 style text",
            },
            {
              title: "arena <text>",
              rowId: ".arena Hello",
              description: "Arena text style",
            },
            {
              title: "hacker <text>",
              rowId: ".hacker Hello",
              description: "Hacker / terminal style",
            },
            {
              title: "sand <text>",
              rowId: ".sand Hello",
              description: "Sand text effect",
            },
            {
              title: "blackpink <text>",
              rowId: ".blackpink Hello",
              description: "Blackpink style text",
            },
            {
              title: "glitch <text>",
              rowId: ".glitch Hello",
              description: "Glitch text effect",
            },
            {
              title: "fire <text>",
              rowId: ".fire Hello",
              description: "Fire text effect",
            },
          ],
        },
        {
          title: "📥 Downloader Commands",
          rows: [
            {
              title: "play <song_name>",
              rowId: ".play Perfect",
              description: "Download song audio",
            },
            {
              title: "song <song_name>",
              rowId: ".song Perfect",
              description: "Download by name",
            },
            {
              title: "instagram <link>",
              rowId: ".instagram <link>",
              description: "Instagram downloader",
            },
            {
              title: "facebook <link>",
              rowId: ".facebook <link>",
              description: "Facebook video downloader",
            },
            {
              title: "tiktok <link>",
              rowId: ".tiktok <link>",
              description: "TikTok downloader",
            },
          ],
        },
        {
          title: "💻 GitHub Commands",
          rows: [
            { title: "git", rowId: ".git", description: "Show GitHub info" },
            {
              title: "github",
              rowId: ".github",
              description: "Show developer GitHub",
            },
            {
              title: "repo",
              rowId: ".repo",
              description: "Get bot repository",
            },
            {
              title: "script",
              rowId: ".script",
              description: "Get bot script",
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error("Error in help command:", error);
    await sock.sendMessage(chatId, {
      text: "❌ Failed to load menu. Try again later.",
    });
  }
}

module.exports = helpCommand;
