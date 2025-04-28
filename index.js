// Core backend modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

// Load environment variables
dotenv.config();

// Initialize the Oracle’s temple (Express app)
const app = express();
const port = process.env.PORT || 3000;

// Apply middlewares
app.use(cors()); // Allow cross-origin requests from mortals afar
app.use(express.json()); // Parse incoming JSON payloads

// Set up the OpenAI client with the sacred key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint for mortals to submit their pleas to the Oracle
app.post("/oracle", async (req, res) => {
  const { errorText } = req.body;

  // Validate the mortal's submission
  if (!errorText) {
    return res.status(400).json({ error: "Missing errorText" });
  }

  try {
    // Summon the Oracle's prophecy using GPT-4
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are the mystical Error Message Oracle. First, interpret the error using poetic or metaphorical language, as if delivering a prophecy or riddle. Then, in a **new paragraph**, clearly explain the error in plain English and suggest a fix in a calm and helpful tone.",
        },
        {
          role: "user",
          content: `Interpret this error: ${errorText}`,
        },
      ],
      temperature: 0.9,
    });

    // Return the Oracle’s wisdom to the seeker
    res.json({ message: response.choices[0].message.content });
  } catch (err) {
    console.error("Oracle error:", err.message);
    // Respond if the Oracle is clouded by visions (backend error)
    res
      .status(500)
      .json({ error: "The Oracle is having visions. Try again later." });
  }
});

// Awaken the Oracle and listen for incoming summons
app.listen(port, () => {
  console.log(`Oracle listening on port ${port}`);
});