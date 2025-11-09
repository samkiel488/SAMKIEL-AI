const {
  addWelcome,
  delWelcome,
  isWelcomeOn,
  addGoodbye,
  delGoodBye,
  isGoodByeOn,
} = require("../lib/index");
const { delay } = require("@whiskeysockets/baileys");

async function handleWelcome(sock, chatId, message, match) {
  if (!match) {
    return global.reply(sock, message, {
      text: `📥 *Welcome Message Setup*\n\nUse the following commands:\n\n✅ *.welcome on* — Enable welcome messages\n🛠️ *.welcome set Your custom message* — Set a custom welcome message\n🚫 *.welcome off* — Disable welcome messages`,
    });
  }

  const [command, ...args] = match.split(" ");
  const lowerCommand = command.toLowerCase();
  const customMessage = args.join(" ");

  if (lowerCommand === "on") {
    if (await isWelcomeOn(chatId)) {
      return global.reply(sock, message, {
        text: "⚠️ Welcome messages are *already enabled*.",
      });
    }
    await addWelcome(chatId, true, null);
    return global.reply(sock, message, {
      text: "✅ Welcome messages *enabled*. Use *.welcome set [your message]* to customize.",
    });
  }

  if (lowerCommand === "off") {
    if (!(await isWelcomeOn(chatId))) {
      return global.reply(sock, message, {
        text: "⚠️ Welcome messages are *already disabled*.",
      });
    }
    await delWelcome(chatId);
    return global.reply(sock, message, {
      text: "✅ Welcome messages *disabled* for this group.",
    });
  }

  if (lowerCommand === "set") {
    if (!customMessage) {
      return global.reply(sock, message, {
        text: "⚠️ Please provide a custom welcome message. Example: *.welcome set Welcome to the group!*",
      });
    }
    await addWelcome(chatId, true, customMessage);
    return global.reply(sock, message, {
      text: "✅ Custom welcome message *set successfully*.",
    });
  }

  // If no valid command is provided
  return global.reply(sock, message, {
    text: `❌ Invalid command. Use:\n*.welcome on* - Enable\n*.welcome set [message]* - Set custom message\n*.welcome off* - Disable`,
  });
}

async function handleGoodbye(sock, chatId, message, match) {
  const lower = match?.toLowerCase();

  if (!match) {
    return global.reply(sock, message, {
      text: `📤 *Goodbye Message Setup*\n\nUse the following commands:\n\n✅ *.goodbye on* — Enable goodbye messages\n🛠️ *.goodbye Your custom message* — Set a custom goodbye message\n🚫 *.goodbye off* — Disable goodbye messages`,
    });
  }

  if (lower === "on") {
    if (await isGoodByeOn(chatId)) {
      return global.reply(sock, message, {
        text: "⚠️ Goodbye messages are *already enabled*.",
      });
    }
    await addGoodbye(chatId, true, null);
    return global.reply(sock, message, {
      text: "✅ Goodbye messages *enabled*. Use *.goodbye [your message]* to customize.",
    });
  }

  if (lower === "off") {
    if (!(await isGoodByeOn(chatId))) {
      return global.reply(sock, message, {
        text: "⚠️ Goodbye messages are *already disabled*.",
      });
    }
    await delGoodBye(chatId);
    return global.reply(sock, message, {
      text: "✅ Goodbye messages *disabled* for this group.",
    });
  }

  await delay(2000);
  await addGoodbye(chatId, true, match);
  return global.reply(sock, message, {
    text: "✅ Custom goodbye message *set successfully*.",
  });
}

module.exports = { handleWelcome, handleGoodbye };
