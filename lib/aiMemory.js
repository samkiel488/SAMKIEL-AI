const fs = require("fs");
const path = "./data/aiMemory.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

function loadMemory() {
  return JSON.parse(fs.readFileSync(path));
}

function saveMemory(memory) {
  fs.writeFileSync(path, JSON.stringify(memory, null, 2));
}

function appendMessage(userId, role, content) {
  const memory = loadMemory();
  memory[userId] = memory[userId] || [];
  memory[userId].push({ role, content });
  // Keep only last 10 messages to prevent file bloat
  memory[userId] = memory[userId].slice(-10);
  saveMemory(memory);
}

function getContext(userId) {
  const memory = loadMemory();
  return memory[userId] || [];
}

module.exports = { appendMessage, getContext };
