import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import { DAILY_REPORT_SYSTEM_PROMPT } from "./prompt/dailyReportPrompt";
import { HAIKU_PROMPT } from "./prompt/haikuPrompt";
import { characterTransformPrompt } from "./prompt/characterPrompt";
import { REVIEW_PROMPT } from "./prompt/reviewPrompt";

const app = express();
const port = process.env.BACKEND_PORT || 3005;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3004";

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

app.use(
  cors({
    origin: frontendOrigin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/transform", async (req, res) => {
  const { inputText, mode = "summary", characterName = "" } = req.body;

  try {
    let promptText: string;
    if (mode === "summary") {
      promptText = DAILY_REPORT_SYSTEM_PROMPT;
    } else if (mode === "review") {
      promptText = REVIEW_PROMPT;
    } else {
      promptText = characterTransformPrompt(characterName);
    }

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                promptText +
                "\n\n---\n以下が日報の本文です。これを上記のルールに従って変換してください。\n\n" +
                inputText,
            },
          ],
        },
      ],
    });

    const haikuResponse = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                HAIKU_PROMPT +
                "\n\n---\n日報本文:\n\n" +
                inputText,
            },
          ],
        },
      ],
    });

    res.json({ output: response.text, haiku: haikuResponse.text });
  } catch (error) {
    console.error("Error while transforming daily report:", error);
    res.status(500).json({ error: "Failed to transform daily report" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}!!`);
}).on("error", (err: Error) => {
  console.error("Server error:", err);
});
