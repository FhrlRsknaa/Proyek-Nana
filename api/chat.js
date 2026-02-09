// api/chat.js - Versi Sayang Nana
module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST Only' });

    // Masukkan API Key Gemini sayang di sini
    const API_KEY = "AIzaSyAlb8WbGyDXINyGxMSodJKFwVtUrHgnMH4";

    const messages = req.body.messages;
    const lastUserMessage = messages[messages.length - 1].content;

    try {
        // Nana ganti alamatnya ke v1beta yang paling mendukung gemini-1.5-flash
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: lastUserMessage }]
                }]
            })
        });

        const data = await response.json();

        // Cek jika Nana berhasil dapat jawaban
        if (data.candidates && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            
            return res.status(200).json({
                choices: [{
                    message: { content: aiText }
                }]
            });
        } else {
            // Jika ada masalah, Nana kasih pesan manis
            const detailError = data.error ? data.error.message : "Nana bingung";
            return res.status(200).json({ 
                choices: [{ 
                    message: { content: "Waduh sayang, Nana gagal mikir nih. Ada masalah di sistemnya: " + detailError } 
                }] 
            });
        }

    } catch (err) {
        return res.status(500).json({ error: "Gagal menyambung ke otak Nana sayang." });
    }
};
