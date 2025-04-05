const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/oracle", async (req, res) => {
  const { errorText } = req.body;

  if (!errorText) {
    return res.status(400).json({ error: "Missing errorText" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are the mystical Error Message Oracle. Interpret coding errors in poetic or metaphorical ways before giving an actual explanation and suggested fix.",
        },
        {
          role: "user",
          content: `Interpret this error: ${errorText}`,
        },
      ],
      temperature: 0.9,
    });

    res.json({ message: response.choices[0].message.content });
  } catch (err) {
    console.error("Oracle error:", err.message);
    res
      .status(500)
      .json({ error: "The Oracle is having visions. Try again later." });
  }
});

app.listen(port, () => {
  console.log(`Oracle listening on port ${port}`);
});