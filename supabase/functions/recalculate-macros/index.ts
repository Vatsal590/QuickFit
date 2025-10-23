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
    const { foodName, originalPortion, newPortion, originalMacros } = await req.json();
    
    console.log('Recalculating macros for:', { foodName, originalPortion, newPortion });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const prompt = `You are a nutrition expert. A user has changed the portion size of a food item.

Food: ${foodName}
Original portion: ${originalPortion}
New portion: ${newPortion}

Original macros:
- Calories: ${originalMacros.calories}
- Protein: ${originalMacros.protein}g
- Carbs: ${originalMacros.carbs}g
- Fats: ${originalMacros.fats}g

Calculate the new macros based on the portion change. Be precise and proportional.

Return ONLY a JSON object with this exact structure (no markdown, no extra text):
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error(`AI API returned ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    console.log('AI Response:', aiResponse);

    // Parse the AI response - handle potential markdown wrapping
    let macros;
    try {
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      macros = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Failed to parse AI response');
    }

    // Validate the response structure
    if (!macros.calories || !macros.protein || !macros.carbs || !macros.fats) {
      throw new Error('Invalid macro structure from AI');
    }

    // Round to reasonable precision
    const result = {
      calories: Math.round(macros.calories),
      protein: Math.round(macros.protein * 10) / 10,
      carbs: Math.round(macros.carbs * 10) / 10,
      fats: Math.round(macros.fats * 10) / 10,
    };

    console.log('Calculated macros:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in recalculate-macros:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
