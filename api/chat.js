export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST doang 😒" });
  }

  const API_KEY = process.env.GOOGLE_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({
      choices: [{ message: { content: "API key belum ada 😤" } }]
    });
  }

  const messages = req.body.messages || [];
  const lastUserMessage =
    messages[messages.length - 1]?.content || "hai";

  try {
    const response = await fetch(
      `https://generativeai.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
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
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      choices: [
        {
          message: {
            content: text || "Aku diem dulu 😒"
          }
        }
      ]
    });
  } catch (e) {
    return res.status(500).json({
      choices: [
        {
          message: {
            content: "Server Google rese 😤"
          }
        }
      ]
    });
  }
}
