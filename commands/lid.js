// ✅ Authorized LIDs list
const AUTHORIZED_LIDS = new Set([
    '43581469397148@lid', // Max (bot)
    '2349019593175@s.whatsapp.net',
    '210720037851177@lid', // Me (bot owner)
    //italy
    '205321096179894@lid',
    '393273904169@s.whatsapp.net',
    //2K27 AIR FORCE

    //Danny

'2349012555196@lid',

'145054299635779@lid',
    //mubh

     '178954661011643@lid',

      '2348134650142@lid',
    //Ghanaian

'233542230589@lid',

'272761108856940@lid',
    //FF guy
' 33509938831517@lid',

'2348078842327@lid',
]);

module.exports = async function lidCommand(sock, chatId, senderId, message) {
    console.log('\n=== .LID COMMAND STARTED ===');
    console.log('📌 Chat ID:', chatId);
    console.log('📌 Sender ID:', senderId);

    try {
        // Step 1 - Check for mentioned user
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        console.log('[1] Mentioned JID:', mentioned);

        // Step 2 - Determine target
        const targetId = mentioned || senderId;
        console.log('[2] Target JID:', targetId);

        // Step 3 - Convert to LID format
        const normalizeToLid = (jid) => {
            if (jid.endsWith('@lid')) return jid;
            if (jid.endsWith('@s.whatsapp.net')) {
                return jid.replace('@s.whatsapp.net', '@lid');
            }
            return jid;
        };

        const lidFormat = normalizeToLid(targetId);
        console.log('[3] Normalized LID:', lidFormat);

        // Step 4 - Check if authorized
        const isAuthorized = AUTHORIZED_LIDS.has(lidFormat);
        console.log('[4] Authorized:', isAuthorized);

        // Step 5 - Send result
        console.log('[5] Sending result message...');
        await sock.sendMessage(chatId, {
            text: `🔍 *LID Check Result*  
👤 User: @${targetId.split('@')[0]}  
🆔 LID: ${lidFormat}  
✅ Authorized: ${isAuthorized ? 'Yes' : 'No'}`,
            mentions: [targetId]
        });

        console.log('✅ Message sent.');
        console.log('=== .LID COMMAND COMPLETE ===\n');

    } catch (err) {
        console.error('❌ LID check error:', err);
        await sock.sendMessage(chatId, { text: '❌ Error checking LID' });
    }
};
