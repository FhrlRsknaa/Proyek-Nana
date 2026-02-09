export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST doang ya 😒" });
  }

  const API_KEY = process.env.OPENAI_API_KEY;
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
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Kamu adalah Nana AI. Gaya santai, ramah, agak nyebelin dikit, selalu jawab pakai emoji."
            },
            {
              role: "user",
              content: lastUserMessage
            }
          ],
          temperature: 0.8
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ??
      "Hai… aku di sini kok 😌";

    return res.status(200).json({
      choices: [
        {
          message: {
            content: reply
          }
        }
      ]
    });
  } catch (err) {
    return res.status(500).json({
      choices: [
        {
          message: {
            content: "Server OpenAI lagi ngambek 😒"
          }
        }
      ]
    });
  }
}
