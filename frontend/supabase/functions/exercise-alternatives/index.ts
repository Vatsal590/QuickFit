import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { exercises, equipment } = await req.json();

    const systemPrompt = `You are a fitness expert helping users find exercise alternatives. 
Given a list of exercises and available equipment, suggest 3-5 alternative exercises that are either:
1. More difficult (advanced variations, increased intensity)
2. Less difficult (beginner-friendly, reduced intensity)

Format your response as a JSON object with two arrays: "harder" and "easier".
Each exercise should have: name (string), difficulty (string), description (string).`;

    const userPrompt = `Current exercises: ${exercises.map((e: any) => e.name).join(', ')}
Available equipment: ${equipment.join(', ')}

Provide difficulty alternatives for these exercises.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "suggest_alternatives",
            description: "Return exercise alternatives with varying difficulty levels",
            parameters: {
              type: "object",
              properties: {
                harder: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      difficulty: { type: "string" },
                      description: { type: "string" }
                    },
                    required: ["name", "difficulty", "description"],
                    additionalProperties: false
                  }
                },
                easier: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      difficulty: { type: "string" },
                      description: { type: "string" }
                    },
                    required: ["name", "difficulty", "description"],
                    additionalProperties: false
                  }
                }
              },
              required: ["harder", "easier"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "suggest_alternatives" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const alternatives = toolCall ? JSON.parse(toolCall.function.arguments) : { harder: [], easier: [] };

    return new Response(JSON.stringify(alternatives), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Server error." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
