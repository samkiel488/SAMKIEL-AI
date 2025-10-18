# Privilege System Refactor TODO

## Tasks
- [ ] Update `lib/isAdmin.js` with specific debug logs (🔧 Checking sudo/admin..., 👤 Normalized sender, 👑 isSenderAdmin, 🤖 isBotAdmin)
- [ ] Rewrite `lib/isOwner.js` to match Max Bot's simple owner check logic
- [ ] Update `main.js` privilege logic:
  - [ ] Define separate command arrays: adminOnlyCommands, ownerOnlyCommands, hybridCommands
  - [ ] Implement proper checks for each category
  - [ ] Remove owner bypass for admin commands
- [ ] Test admin commands (.tagall, .ban, .mute, etc.)
- [ ] Test owner commands (.mode, .setpp, etc.)
- [ ] Test hybrid commands (.chatbot, .welcome)
- [ ] Verify LID compatibility
