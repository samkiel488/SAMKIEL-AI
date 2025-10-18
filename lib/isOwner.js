const { jidNormalizedUser } = require('@whiskeysockets/baileys');
const settings = require('../settings');

function isOwner(senderId) {
  const ownerJid = settings.ownerNumber + '@s.whatsapp.net';
  return jidNormalizedUser(senderId) === jidNormalizedUser(ownerJid);
}

module.exports = isOwner;
