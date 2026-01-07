import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

const app = express();
const port = process.env.BACKEND_PORT;
const frontendOrigin = process.env.FRONTEND_ORIGIN;

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

app.use(cors({
  origin: frontendOrigin,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/transform", async (req, res) => {
  const { inputText } = req.body;
  console.log(inputText);
  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: inputText
  })
  res.json({ output: response.text });
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}!!`);
}).on('error', (err: Error) => {
  console.error('Server error:', err);
});
