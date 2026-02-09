export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Hanya POST sayang 😒" });
  }

  const API_KEY = process.env.GOOGLE_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({
      choices: [{ message: { content: "API key belum dipasang 😤" } }]
    });
  }

  const messages = req.body.messages || [];
  const lastUserMessage =
    messages[messages.length - 1]?.content || "hai";

  try {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: lastUserMessage }]
          }
        ]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return res.status(200).json({
        choices: [
          {
            message: {
              content: data.candidates[0].content.parts[0].text
            }
          }
        ]
      });
    } else {
      const errMsg =
        data.error?.message || "Nana/Caca lagi bad mood 😒";
      return res.status(200).json({
        choices: [
          {
            message: {
              content: "Duh, error nih: " + errMsg
            }
          }
        ]
      });
    }
  } catch (err) {
    return res.status(500).json({
      choices: [
        {
          message: {
            content: "Server capek, aku ikut bete 😤"
          }
        }
      ]
    });
  }
}
