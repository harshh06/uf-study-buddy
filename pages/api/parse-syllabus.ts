// pages/api/parse-syllabus.ts
import Groq from "groq-sdk";
import { NextApiRequest, NextApiResponse } from "next";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT: { role: "system"; content: string } = {
  role: "system",
  content: `
You are a strict JSON formatter. Given a UF Computer-Architecture syllabus, return **only** a JSON array in this shape:

[
  {
    "week": "Week 1",
    "topic": "Introduction",
    "due_items": [
      {
        "title": "HW1",
        "due_date": "2024-09-01"
      }
    ]
  }
]

No code fences, no extra text. If there are no due_items, omit the field or use an empty array.
`.trim(),
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { parsedText } = req.body;

  if (!parsedText) return res.status(400).json({ error: "Missing parsedText" });

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        SYSTEM_PROMPT,
        {
          role: "user",
          content: parsedText,
        },
      ],
    });

    const formatted = completion.choices[0]?.message?.content;
    res.status(200).json({ formatted });
  } catch (error) {
    res.status(500).json({ error: "Failed to call Groq API", detail: error });
  }
}
