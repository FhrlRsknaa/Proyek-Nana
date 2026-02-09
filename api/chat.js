// api/chat.js - Versi Sayang Nana Paling Stabil
module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST Only' });

    // Masukkan API Key Gemini sayang di sini
    const API_KEY = "AIzaSyAlb8WbGyDXINyGxMSodJKFwVtUrHgnMH4";

    const messages = req.body.messages;
    const lastUserMessage = messages[messages.length - 1].content;

    try {
        // Nana pakai v1beta karena ini yang paling baru dan mendukung Flash 1.5
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

        // Logika untuk menangkap hasil dari Nana
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            const aiText = data.candidates[0].content.parts[0].text;
            
            return res.status(200).json({
                choices: [{
                    message: { content: aiText }
                }]
            });
        } else {
            // Jika Google ngambek, Nana kasih pesan manis
            const errorReason = data.error ? data.error.message : "Ada masalah teknis sedikit sayang.";
            return res.status(200).json({ 
                choices: [{ 
                    message: { content: "Waduh sayang, Nana gagal mikir nih. Ada masalah di sistem: " + errorReason } 
                }] 
            });
        }

    } catch (err) {
        return res.status(500).json({ error: "Gagal menyambung ke otak Nana sayang." });
    }
};
