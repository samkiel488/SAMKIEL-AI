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
const path = require("path");
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
const readline = require("readline");
const { rmSync } = require("fs");

// Handle unhandled errors
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

// Bot globals
let XeonBotInc;
global.botname = "𝕊𝔸𝕄𝕂𝕀𝔼𝕃 𝔹𝕆𝕋";
global.themeemoji = "•";
let phoneNumber = "2348087357158";
let owner = JSON.parse(fs.readFileSync("./data/owner.json"));

// Readline interface for interactive prompt
const rl = process.stdin.isTTY
  ? readline.createInterface({ input: process.stdin, output: process.stdout })
  : null;
const question = (text) =>
  rl
    ? new Promise((resolve) => rl.question(text, resolve))
    : Promise.resolve(phoneNumber);

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
      contacts.forEach((c) => {
        if (c.id) this.contacts[c.id] = c;
      });
    });
    ev.on("chats.set", (chats) => (this.chats = chats));
  },
  loadMessage: async (jid, id) => this.messages[jid]?.[id] || null,
};

// Start bot
async function startXeonBotInc() {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`Baileys version: ${version}, isLatest: ${isLatest}`);

  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const msgRetryCounterCache = new NodeCache();

  XeonBotInc = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: true, // Let Baileys handle QR display
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
    syncFullHistory: true,
    getMessage: async (key) => {
      let jid = jidNormalizedUser(key.remoteJid);
      let msg = await store.loadMessage(jid, key.id);
      return msg?.message || "";
    },
    msgRetryCounterCache,
  });

  store.bind(XeonBotInc.ev);

  // Message handler
  XeonBotInc.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      const mek = chatUpdate.messages[0];
      if (!mek.message) return;
      mek.message =
        Object.keys(mek.message)[0] === "ephemeralMessage"
          ? mek.message.ephemeralMessage.message
          : mek.message;

      if (mek.key.remoteJid === "status@broadcast") {
        await handleStatus(XeonBotInc, chatUpdate);
        return;
      }

      try {
        await handleMessages(XeonBotInc, chatUpdate, true);
      } catch (err) {
        console.error("Error in handleMessages:", err);
      }
    } catch (err) {
      console.error("Error in messages.upsert:", err);
    }
  });

  // Connection handling
  XeonBotInc.ev.on(
    "connection.update",
    async ({ connection, lastDisconnect }) => {
      if (connection === "open") {
        console.log(chalk.green("✅ Bot Connected Successfully!"));
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        if ([DisconnectReason.loggedOut, 401].includes(statusCode)) {
          console.log(chalk.red("⚠️ Session invalid. Clearing session..."));
          rmSync("./session", { recursive: true, force: true });
        }
        console.log(chalk.yellow("🔄 Reconnecting..."));
        startXeonBotInc();
      }
    }
  );

  XeonBotInc.ev.on("creds.update", saveCreds);

  // Optional: handle group participants & status
  XeonBotInc.ev.on("group-participants.update", async (update) => {
    await handleGroupParticipantUpdate(XeonBotInc, update);
  });
  XeonBotInc.ev.on("messages.upsert", async (m) => {
    if (m.messages[0].key.remoteJid === "status@broadcast")
      await handleStatus(XeonBotInc, m);
  });
}

startXeonBotInc().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

fs.watchFile(require.resolve(__filename), () => {
  fs.unwatchFile(require.resolve(__filename));
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[require.resolve(__filename)];
  require(__filename);
});
