// api/chat.js (Update Fix untuk Gemini)
module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST Only' });

    // Gunakan API Key Gemini kamu
    const API_KEY = "AIzaSyAlb8WbGyDXINyGxMSodJKFwVtUrHgnMH4";

    const messages = req.body.messages;
    const lastUserMessage = messages[messages.length - 1].content;

    try {
        // Kita gunakan versi v1 (lebih stabil) dan model gemini-1.5-flash
        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: lastUserMessage }]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        const data = await response.json();

        // Jika berhasil mengambil data
        if (data.candidates && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            
            return res.status(200).json({
                choices: [{
                    message: { content: aiText }
                }]
            });
        } else {
            // Tampilkan error jika gagal respon
            const errorMsg = data.error ? data.error.message : "Nana Ai bingung, coba kirim lagi pesan kamu.";
            return res.status(200).json({ 
                choices: [{ 
                    message: { content: "Waduh cik: " + errorMsg } 
                }] 
            });
        }

    } catch (err) {
        return res.status(500).json({ error: "Gagal menyambung ke otak Nana Ai." });
    }
};
