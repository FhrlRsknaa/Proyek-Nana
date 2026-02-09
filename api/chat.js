// api/chat.js (Khusus Gemini API)
module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST Only' });

    // Salin API Key dari gambar Google AI Studio kamu tadi ke sini
    const API_KEY = "AIzaSyAlb8WbGyDXINyGxMSodJKFwVtUrHgnMH4";

    // Menyiapkan pesan terakhir dari user
    const lastUserMessage = req.body.messages[req.body.messages.length - 1].content;

    try {
        // Endpoint Google Gemini 1.5 Flash (Sangat Cepat & Gratis)
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: lastUserMessage }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        // Mengambil teks balasan dari struktur data Gemini
        if (data.candidates && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            
            // Format disesuaikan agar frontend tetap jalan (seperti OpenAI format)
            return res.status(200).json({
                choices: [{
                    message: { content: aiText }
                }]
            });
        } else {
            console.error("Gemini Error:", data);
            return res.status(200).json({ 
                choices: [{ 
                    message: { content: "Waduh cik, Nana gagal mikir: " + (data.error ? data.error.message : "Gagal respon") } 
                }] 
            });
        }

    } catch (err) {
        console.error("System Error:", err);
        return res.status(500).json({ error: "Gagal menyambung ke otak Gemini." });
    }
};
