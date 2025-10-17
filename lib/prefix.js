const fs = require("fs");
const path = require("path");

const PREFIX_FILE = path.join(__dirname, "../data/prefix.json");

// Load prefix from file, default to "." if not exists
function loadPrefix() {
  try {
    const data = JSON.parse(fs.readFileSync(PREFIX_FILE, "utf8"));
    return data.prefix || ".";
  } catch (error) {
    // File doesn't exist or invalid, use default
    return ".";
  }
}

// Save prefix to file
function savePrefix(newPrefix) {
  try {
    const data = { prefix: newPrefix };
    fs.writeFileSync(PREFIX_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving prefix:", error);
    return false;
  }
}

// Check if message is a command
function isCommand(messageText) {
  const prefix = loadPrefix();
  if (!prefix || prefix === "none" || prefix === "off") {
    return true; // No prefix required
  }
  return messageText.startsWith(prefix);
}

// Get command without prefix
function getCommand(messageText) {
  const prefix = loadPrefix();
  if (!prefix || prefix === "none" || prefix === "off") {
    return messageText.trim().replace(/^\./, '').toLowerCase();
  }
  if (messageText.startsWith(prefix)) {
    return messageText.slice(prefix.length).trim().toLowerCase();
  }
  return "";
}

module.exports = {
  loadPrefix,
  savePrefix,
  isCommand,
  getCommand,
};
