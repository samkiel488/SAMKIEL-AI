# Baileys Migration Plan

## Completed
- [x] Update package.json: Remove "@whiskeysockets/baileys" and add "baileys": "github:nstar-y/bail"
- [x] Run dependency commands: npm uninstall @whiskeysockets/baileys && rm -rf node_modules package-lock.json && npm install --legacy-peer-deps

## In Progress
- [ ] Replace all imports: Change every "@whiskeysockets/baileys" to "baileys" in all affected files
- [ ] Update JID filtering: Replace strict '@s.whatsapp.net' checks with regex to accept LID groups
- [ ] Add version logging: Insert console.log after fetchLatestBaileysVersion call
- [ ] Verify migration: Test with node index.js --pairing-code

## Files to Edit
- settings.js, index.js, main.js
- lib/ files: antilink.js, isOwner.js, myfunc.js, welcome.js
- Commands: antidelete.js, groupmanage.js, img-blur.js, removebg.js, setpp.js, remini.js, simage-alt.js, simage.js, sticker.js, tag.js, sticker-alt.js, take.js, url.js, viewonce.js, vcf.js
