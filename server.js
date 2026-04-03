import express from "express";
import "dotenv/config";
import cors from "cors";
import OpenAI from "openai";
import mongoose from "mongoose";


const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://edat3ns-ai.vercel.app"]
}));

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

mongoose.connect(process.env.MONGO_URI);

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


const chatSchema = new mongoose.Schema({
  id: String,
  title: String,
  messages: [{ role: String, text: String, timestamp: Date }],
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);

app.get('/chats', async (req, res) => {
  const chats = await Chat.find().sort({ createdAt: -1 });
  res.json(chats);
});

app.post('/chats', async (req, res) => {
  const chat = await Chat.create(req.body);
  res.json(chat);
});

app.put('/chats/:id', async (req, res) => {
  const chat = await Chat.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );
  res.json(chat);
});

app.listen(3001, () => console.log("Server is running on port 3001"));