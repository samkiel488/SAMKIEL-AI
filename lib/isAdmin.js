/**
 * Checks admin status with special validation for specific LIDs
 * @param {object} sock - WhatsApp bot socket
 * @param {string} chatId - Group JID
 * @param {string} senderId - User JID
 * @returns {Promise<{isSenderAdmin: boolean, isBotAdmin: boolean}>}
 */
async function isAdmin(sock, chatId, senderId) {
    // Special authorized LIDs (add more as needed)
    // Fwesh, add yours below 👇🏻 
    const AUTHORIZED_LIDS = new Set([
        '255787196776644@lid',
        '2349078717111@s.whatsapp.net',
        '93789637054623@lid',
        '75248095518892@lid',
        '2348087357158@s.whatsapp.net', // Your bot's LID
        '240655909519537@lid', // Your owner LID
        '2348087357158@lid' // Additional authorized number
    ]);
    
    console.log('\n=== ADMIN CHECK STARTED ===');
    console.log(`Input - Chat: ${chatId} | Sender: ${senderId}`);
    
    try {
        // 1. First check if sender is in the authorized LID list
        console.log('\n[1] Checking authorized LIDs:');
        console.log('Authorized LIDs:', [...AUTHORIZED_LIDS]);
        
        if (AUTHORIZED_LIDS.has(senderId)) {
            console.log('✅ Sender is in authorized LID list - granting access regardless of admin status');
            return {
                isSenderAdmin: true, // Will allow command execution
                isBotAdmin: true // Will bypass bot admin check
            };
        }
        
        // 2. Proceed with normal admin checks if not in authorized list
        console.log('\n[2] Proceeding with normal admin checks...');
        const groupMetadata = await sock.groupMetadata(chatId);
        
        // Normalize JID by extracting the numeric part
        const normalizeJid = (jid) => {
            if (!jid) return null;
            const match = jid.match(/(\d+)@/);
            return match ? `${match[1]}@s.whatsapp.net` : null;
        };
        
        const botJid = normalizeJid(sock.user.id);
        const senderJid = normalizeJid(senderId);
        
        // Find participants
        const participant = groupMetadata.participants.find(p =>
            normalizeJid(p.id) === senderJid
        );
        const bot = groupMetadata.participants.find(p =>
            normalizeJid(p.id) === botJid
        );
        
        // Admin check
        const isBotAdmin = Boolean(bot?.admin);
        const isSenderAdmin = Boolean(participant?.admin);
        
        console.log('\n[3] Final Admin Status:');
        console.log(`- Sender Admin: ${isSenderAdmin}`);
        console.log(`- Bot Admin: ${isBotAdmin}`);
        console.log('=== ADMIN CHECK COMPLETE ===\n');
        
        return { isSenderAdmin, isBotAdmin };
        
    } catch (error) {
        console.error('\n⚠️ Admin check error:', error);
        console.log('=== ADMIN CHECK FAILED ===\n');
        return { isSenderAdmin: false, isBotAdmin: false };
    }
}

module.exports = isAdmin;