module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Hanya POST sayang' });

    // Tempel API KEY BARU kamu di sini (Rahasia ya sayang)
    const API_KEY = "AIzaSyAmxpiIHRQHNj0GIXwRHSXGeVYJfK8XcXc";

    const messages = req.body.messages;
    const lastUserMessage = messages[messages.length - 1].content;

    try {
        // Alamat resmi untuk Gemini 1.5 Flash
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

        // Mengolah balasan Nana
        if (data.candidates && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            
            return res.status(200).json({
                choices: [{
                    message: { content: aiText }
                }]
            });
        } else {
            // Nana lapor kalau Google ada masalah
            const errorPesan = data.error ? data.error.message : "Ada masalah sinyal sayang.";
            return res.status(200).json({ 
                choices: [{ 
                    message: { content: "Duh sayang, Nana pusing nih: " + errorPesan } 
                }] 
            });
        }

    } catch (err) {
        return res.status(500).json({ error: "Sistem Nana error sayang." });
    }
};
