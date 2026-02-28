import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

console.log("Starting server...");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({ status: "Server running" });
});

app.get("/openai-test", async (req, res) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: "Say hello in French." }
    ],
  });

  res.json(response.choices[0].message);
});

async function detectMode(input) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
Classify the user request into one of these:

- phrase_translation
- word_translation
- french_meaning
- general

Return JSON only:
{
  "mode": "..."
}
        `,
      },
      { role: "user", content: input },
    ],
  });

  return JSON.parse(response.choices[0].message.content).mode;
}

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // 1️⃣ Detect mode
    const mode = await detectMode(message);

    let systemPrompt = "";

    // 2️⃣ Route based on detected mode
    if (mode === "phrase_translation") {
      systemPrompt = `
You are a French tutor.

User gives an English phrase.
Return 3–4 natural French equivalents.

Rules:
- Bold ALL French phrases using **markdown bold**
- Label tone (neutral, informal, idiomatic)
- Keep explanations short.
`;
    }

    if (mode === "word_translation") {
      systemPrompt = `
User gives a single English word.

Return:
- Main French translation (bolded)
- Part of speech
- 2 short example sentences (French + English translation)
`;
    }

    if (mode === "french_meaning") {
      systemPrompt = `
User gives a French phrase.

Return:
- Natural English meaning
- Literal translation
- Short breakdown of key words
- Brief usage explanation
`;
    }

    if (mode === "general") {
      systemPrompt = `
You are a helpful French tutor.
Answer clearly and concisely.
`;
    }

    // 3️⃣ Generate final response
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    res.json({
      mode,
      content: response.choices[0].message.content,
    });

  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});