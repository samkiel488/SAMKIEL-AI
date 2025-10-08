
const axios = require('axios');
const yts = require('yt-search');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function songCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();
        
        if (!searchQuery) {
            return await sock.sendMessage(chatId, { 
                text: "What song do you want to download?"
            });
        }

        // Search for the song
        const { videos } = await yts(searchQuery);
        if (!videos || videos.length === 0) {
            return await sock.sendMessage(chatId, { 
                text: "No songs found!"
            });
        }

        const video = videos[0];
        const videoUrl = video.url;

        // Send loading message
        await sock.sendMessage(chatId, {
            text: `*${video.title}*\n\n*Duration:* ${formatDuration(video.duration.seconds)}\n*Views:* ${formatNumber(video.views)}\n\n_Downloading your song..._`
        }, { quoted: message });

        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        const tempFile = path.join(tempDir, `${Date.now()}.mp3`);
        const tempM4a = path.join(tempDir, `${Date.now()}.m4a`);

        try {
            // Use the new API endpoint
            const apiRes = await fetch(`https://apis-keith.vercel.app/download/dlmp3?url=${encodeURIComponent(videoUrl)}`);
            const apiData = await apiRes.json();
            
            if (apiData && apiData.downloadUrl) {
                // Download the file first
                const response = await fetch(apiData.downloadUrl);
                const buffer = await response.arrayBuffer(); // Changed from buffer() to arrayBuffer()
                
                // Write to temp file
                fs.writeFileSync(tempM4a, Buffer.from(buffer));
                
                // Convert to MP3 with proper WhatsApp-compatible settings
                await execPromise(`ffmpeg -i "${tempM4a}" -vn -acodec libmp3lame -ac 2 -ab 128k -ar 44100 "${tempFile}"`);
                
                // Check file size (increased minimum size check)
                const stats = fs.statSync(tempFile);
                if (stats.size < 5000) { // Changed from 1024 to 5000 bytes
                    throw new Error('Conversion failed - file too small');
                }

                await sock.sendMessage(chatId, {
                    audio: { url: tempFile },
                    mimetype: "audio/mpeg",
                    fileName: `${video.title}.mp3`,
                    ptt: false
                }, { quoted: message });

                // Clean up temp files
                setTimeout(() => {
                    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
                    if (fs.existsSync(tempM4a)) fs.unlinkSync(tempM4a);
                }, 5000);
                return;
            } else {
                throw new Error('API response format unexpected');
            }
        } catch (error) {
            console.error('Error with API:', error);
            throw new Error("Failed to download the song from API");
        }
    } catch (error) {
        console.error('Error in song command:', error);
        await sock.sendMessage(chatId, { 
            text: "Failed to download the song. Please try again later or try a different song."
        });
    }
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = songCommand;