export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST doang 😒" });
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
            { role: "system", content: "Kamu adalah Nana AI yang ramah dan membantu." },
            { role: "user", content: lastUserMessage }
          ]
        })
      }
    );

    const data = await response.json();

    return res.status(200).json({
      choices: [
        {
          message: {
            content:
              data.choices?.[0]?.message?.content ||
              "Aku diem dulu 😒"
          }
        }
      ]
    });
  } catch (err) {
    return res.status(500).json({
      choices: [
        {
          message: {
            content: "Server OpenAI rese 😤"
          }
        }
      ]
    });
  }
}
