// Backend Aman untuk Vercel
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    // API Key aman di sisi server (Backend)
    const API_KEY = "sk-Y8zGe0teVChzUK8OkTV1YjC24K2jvfaKIhaNYRgKM0wiZeto";

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: req.body.messages,
                temperature: 0.7
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Koneksi ke Caca API bermasalah" });
    }
}
