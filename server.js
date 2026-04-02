import express from "express";
import "dotenv/config";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://https://edat3ns-ai.vercel.app/"]
}));

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Отвечай кратко и по существу." },
        { role: "user", content: message }
      ]
    });

    res.json(response.choices[0].message);

  } catch (error) {
    console.error("Groq error:", error.message);
    res.status(500).json({ content: error.message });
  }
});

app.listen(3001, () => console.log("Server is running on port 3001"));