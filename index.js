// Global reply function
global.reply = async (sock, message, content) => {
  try {
    const chatId = message.key.remoteJid;
    await sock.sendMessage(chatId, { ...content }, { quoted: message });
  } catch (err) {
    console.error("Error in global.reply:", err);
  }
};

require("./settings");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const chalk = require("chalk");
const {
  handleMessages,
  handleGroupParticipantUpdate,
  handleStatus,
} = require("./main");
const PhoneNumber = require("awesome-phonenumber");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  jidDecode,
  jidNormalizedUser,
  makeCacheableSignalKeyStore,
  delay,
} = require("@whiskeysockets/baileys");
const NodeCache = require("node-cache");
const pino = require("pino");
const { rmSync } = require("fs");

const settings = require("./settings");

let XeonBotInc;

// Lightweight in-memory store
const store = {
  messages: {},
  contacts: {},
  chats: {},
  groupMetadata: async (jid) => {
    try {
      const metadata = await XeonBotInc.groupMetadata(jid);
      return metadata;
    } catch {
      return {};
    }
  },
  bind: function (ev) {
    ev.on("messages.upsert", ({ messages }) => {
      messages.forEach((msg) => {
        if (msg.key && msg.key.remoteJid) {
          this.messages[msg.key.remoteJid] =
            this.messages[msg.key.remoteJid] || {};
          this.messages[msg.key.remoteJid][msg.key.id] = msg;
        }
      });
    });

    ev.on("contacts.update", (contacts) => {
      contacts.forEach((contact) => {
        if (contact.id) this.contacts[contact.id] = contact;
      });
    });

    ev.on("chats.set", (chats) => {
      this.chats = chats;
    });
  },
  loadMessage: async (jid, id) => this.messages[jid]?.[id] || null,
};

process.on("unhandledRejection", (err) => {
  const message = String(err);
  if (message.includes("conflict") || message.includes("Connection Closed")) {
    console.log("⚠️ Connection conflict detected — restarting session...");
  } else {
    console.error("Unhandled Rejection:", err);
  }
});

async function startXeonBotInc() {
  let { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState(`./session`);
  const msgRetryCounterCache = new NodeCache();

  XeonBotInc = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false, // pairing code will be used
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(
        state.keys,
        pino({ level: "fatal" }).child({ level: "fatal" })
      ),
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      let jid = jidNormalizedUser(key.remoteJid);
      let msg = await store.loadMessage(jid, key.id);
      return msg?.message || "";
    },
    msgRetryCounterCache,
    defaultQueryTimeoutMs: undefined,
  });

  store.bind(XeonBotInc.ev);

  // Handle pairing code
  if (!XeonBotInc.authState.creds.registered) {
    let botNumber = settings.botNumber || "";
    botNumber = botNumber.replace(/[^0-9]/g, "");

    if (!new PhoneNumber("+" + botNumber).isValid()) {
      console.error(
        chalk.red("❌ Invalid botNumber in settings. Check the format.")
      );
      process.exit(1);
    }

    try {
      const code = await XeonBotInc.requestPairingCode(botNumber);
      const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
      console.log(
        chalk.green("✅ Pairing code generated:"),
        chalk.yellow(formattedCode)
      );
      console.log(
        "Open WhatsApp > Settings > Linked Devices > Link a Device, and enter the code above."
      );
    } catch (err) {
      console.error("Failed to request pairing code:", err);
      process.exit(1);
    }
  }

  // Connection handling
  XeonBotInc.ev.on("connection.update", async (s) => {
    const { connection, lastDisconnect } = s;
    if (connection === "open") {
      console.log(chalk.yellow(`🌿 Connected as ${XeonBotInc.user.id}`));
    } else if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
        rmSync("./session", { recursive: true, force: true });
        console.log(
          chalk.red("Session logged out. Re-authentication required.")
        );
      }
      console.log(chalk.yellow("Attempting to reconnect..."));
      startXeonBotInc();
    }
  });

  XeonBotInc.ev.on("creds.update", saveCreds);

  // Message handler
  XeonBotInc.ev.on("messages.upsert", async (m) => {
    const mek = m.messages[0];
    if (!mek.message) return;
    mek.message =
      Object.keys(mek.message)[0] === "ephemeralMessage"
        ? mek.message.ephemeralMessage.message
        : mek.message;

    if (mek.key && mek.key.remoteJid === "status@broadcast") {
      await handleStatus(XeonBotInc, m);
      return;
    }

    try {
      await handleMessages(XeonBotInc, m, true);
    } catch (err) {
      console.error("Error in handleMessages:", err);
    }
  });

  // Group participants
  XeonBotInc.ev.on("group-participants.update", async (update) => {
    await handleGroupParticipantUpdate(XeonBotInc, update);
  });

  return XeonBotInc;
}

// Start bot
startXeonBotInc().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) =>
  console.error("Uncaught Exception:", err)
);
process.on("unhandledRejection", (err) =>
  console.error("Unhandled Rejection:", err)
);
