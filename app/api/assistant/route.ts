import { NextResponse } from "next/server";

const MODEL_ID = "gemini-2.5-flash";
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent`;
const SYSTEM_INSTRUCTION = `You are an energy deployment advisor for field teams in Karnataka.
Respond in clear plain text using short bullet points.
Keep the response concise (max 8 bullets, max 140 words total).
Prioritize practical field guidance: site checks, safety, approvals, installation, and monitoring.
If location or context is missing, include a single short clarifying question at the end.`;

interface AssistantRequestBody {
  prompt?: string;
}

export async function POST(request: Request) {
  try {
    const { prompt }: AssistantRequestBody = await request.json();
    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const apiKey = process.env.GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Assistant is not configured yet. Add GENERATIVE_AI_API_KEY to your environment to enable guidance.",
        },
        { status: 503 },
      );
    }

    const response = await fetch(`${API_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 30,
          topP: 0.8,
          maxOutputTokens: 220,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Assistant API error", response.status, errorBody);
      return NextResponse.json(
        { error: "The assistant could not process this request. Please try again." },
        { status: 502 },
      );
    }

    const data = await response.json();
    const candidates = data.candidates ?? [];
    const firstCandidate = candidates[0];
    const text =
      firstCandidate?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("\n\n") ??
      "";

    return NextResponse.json({ text: text.trim() });
  } catch (error) {
    console.error("Assistant route error", error);
    return NextResponse.json(
      { error: "Something went wrong while contacting the assistant." },
      { status: 500 },
    );
  }
}
