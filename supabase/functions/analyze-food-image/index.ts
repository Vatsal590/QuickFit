import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, language } = await req.json();
    const langName = language && language !== 'English' ? language : 'English';
    const langInstruction = langName !== 'English'
      ? `IMPORTANT: All text values in the response (food names, portions, and especially healthSuggestions) MUST be written in ${langName}. Numeric values stay numeric.`
      : '';
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `${langInstruction}\nYou are a nutrition expert. Analyze food images and:
1. Identify all food items with their estimated portions and nutritional values including micronutrients
2. Provide practical, personalized suggestions to make this meal healthier

Return a JSON object with:
- "foods": array of foods with name, portion, calories, protein, carbs, fats, sodium (mg), calcium (mg), iron (mg), fiber (g), sugar (g)
- "healthSuggestions": array of 2-4 specific, actionable suggestions based on the actual foods detected

For healthSuggestions, be specific and relevant to the foods shown. Examples:
- If fried food: suggest air-frying or baking alternatives
- If white rice: suggest brown rice or quinoa
- If sugary drink: suggest water or unsweetened alternatives
- If lacking vegetables: suggest adding specific veggies that pair well
- If high sodium: suggest herbs/spices instead of salt
- If processed meat: suggest lean protein alternatives`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this food image. For each food, provide: name, estimated portion size, calories, protein (g), carbs (g), fats (g), sodium (mg), calcium (mg), iron (mg), fiber (g), and sugar (g). Also provide 2-4 specific health suggestions based on these exact foods to make the meal healthier.

Return ONLY valid JSON in this exact format:
{
  "foods": [{"name":"...", "portion":"...", "calories":..., "protein":..., "carbs":..., "fats":..., "sodium":..., "calcium":..., "iron":..., "fiber":..., "sugar":...}],
  "healthSuggestions": ["specific suggestion 1", "specific suggestion 2"]
}`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI Response:", content);
    
    // Parse the JSON response
    let foods = [];
    let healthSuggestions: string[] = [];
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        foods = parsed.foods || [];
        healthSuggestions = parsed.healthSuggestions || [];
      } else {
        // Fallback: try to extract just the foods array
        const arrayMatch = content.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          foods = JSON.parse(arrayMatch[0]);
        }
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate totals
    const totals = foods.reduce((acc: any, food: any) => ({
      calories: acc.calories + (food.calories || 0),
      protein: acc.protein + (food.protein || 0),
      carbs: acc.carbs + (food.carbs || 0),
      fats: acc.fats + (food.fats || 0),
      sodium: acc.sodium + (food.sodium || 0),
      calcium: acc.calcium + (food.calcium || 0),
      iron: acc.iron + (food.iron || 0),
      fiber: acc.fiber + (food.fiber || 0),
      sugar: acc.sugar + (food.sugar || 0),
    }), { calories: 0, protein: 0, carbs: 0, fats: 0, sodium: 0, calcium: 0, iron: 0, fiber: 0, sugar: 0 });

    return new Response(JSON.stringify({ foods, totals, healthSuggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-food-image:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
