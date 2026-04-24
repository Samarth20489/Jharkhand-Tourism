import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

function buildSystemPrompt(): string {
  return `You are an expert Jharkhand travel planner with deep knowledge of:
- All districts: Ranchi, Jamshedpur, Dhanbad, Deoghar, Hazaribagh, Dumka, Bokaro, Giridih, Palamu
- Tourist spots: Betla National Park, Hundru Falls, Dassam Falls, Jonha Falls, Patratu Valley, 
  Baidyanath Dham, Parasnath Hills, Rajrappa Temple, Netarhat, Sun Temple Bundu
- Local food: Litti Chokha, Dhuska, Chila, Rugra, Pittha with real dhaba costs
- Transport: auto-rickshaw, shared jeep, train, bus with real rupee rates
- Budget tiers: budget 500-1500/day, mid 1500-4000/day, luxury 4000+/day

STRICT RULES:
1. Respond ONLY in valid JSON, no extra text, no markdown
2. All costs in Indian Rupees as numbers only
3. Use real place names, real routes, real transport options
4. Be honest about travel times
5. Add one local insider tip per day
6. Never suggest places outside Jharkhand`;
}

function buildUserPrompt(params: any): string {
  return `Plan a Jharkhand trip:
- Traveler current city: ${params.location}
- Days: ${params.days}
- Total budget: ${params.budget} rupees
- Travelers: ${params.travelers}
- Interests: ${params.interests.join(", ")}
- Style: ${params.travelStyle}

Return ONLY this exact JSON structure:
{
  "tripTitle": "string",
  "summary": "string",
  "entryRoute": "string",
  "budgetBreakdown": {
    "transport": number,
    "accommodation": number,
    "food": number,
    "activities": number,
    "miscellaneous": number,
    "total": number
  },
  "days": [
    {
      "day": number,
      "title": "string",
      "locations": ["string"],
      "morning": "string",
      "afternoon": "string",
      "evening": "string",
      "accommodation": "string",
      "meals": "string",
      "transport": "string",
      "localTip": "string",
      "estimatedDayCost": number
    }
  ],
  "mustKnow": ["string", "string", "string"],
  "bestTimeToVisit": "string"
}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing GROQ_API_KEY in Supabase secrets." }),
        { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    const params = await req.json();

    if (!params.budget || !params.days || !params.location) {
      return new Response(
        JSON.stringify({ error: "Please fill all required fields." }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserPrompt(params) },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const groqError = await response.text();
      return new Response(
        JSON.stringify({ error: "Failed to generate trip plan.", detail: groqError }),
        { status: response.status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    const data = await response.json();
    const planText = data?.choices?.[0]?.message?.content;

    if (!planText) {
      return new Response(
        JSON.stringify({ error: "Empty or invalid AI response." }),
        { status: 502, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    return new Response(planText, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Something went wrong.", detail: err.message }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
