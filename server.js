import express from "express";
import "dotenv/config";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(express.json());
app.use(cors());
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages:[
      { role: "system", content: "Отвечай кратко и по существу." },
      { role: "user", content: message }
      ]
    });

    console.log("Test response:", response.choices[0].message);

    res.json(response.choices[0].message);

  } catch (error) {
    console.error("Error during test request:", error);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }

});

app.listen(3001, () => {
  console.log("Server is running on port 3001");

});