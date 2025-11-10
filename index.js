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
const qrcode = require("qrcode-terminal");
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
    printQRInTerminal: false,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    // use the multi-file auth state directly — this is the recommended pattern
    auth: state,
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
  // QR/pairing will be handled on connection.update below. Do not request
  // pairing codes manually here. We display the QR when Baileys emits it.

  // Connection handling
  XeonBotInc.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // When QR is available, print it in the terminal for scanning
    if (qr) {
      console.log(chalk.green("⚡ Scan this QR to link the bot:"));
      try {
        qrcode.generate(qr, { small: true });
      } catch (e) {
        // fallback: print raw QR string
        console.log(qr);
      }
      console.log(
        "Open WhatsApp > Settings > Linked Devices > Link a Device, then scan the QR above."
      );
    }

    if (connection === "open") {
      console.log(
        chalk.yellow(`🌿 Connected as ${XeonBotInc.user?.id || "unknown"}`)
      );
    } else if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
        // remove session and request fresh auth
        try {
          rmSync("./session", { recursive: true, force: true });
        } catch {}
        console.log(
          chalk.red(
            "Session logged out. Cleared session, re-authentication required."
          )
        );
      }
      console.log(
        chalk.yellow("Connection closed — attempting to reconnect in 3s...")
      );
      await delay(3000);
      try {
        await startXeonBotInc();
      } catch (e) {
        console.error("Reconnection failed:", e);
      }
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
