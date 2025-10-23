import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extract numeric value from portion string (e.g., "2 cups" -> 2, "1.5 servings" -> 1.5)
function extractNumericValue(portionStr: string): number | null {
  if (!portionStr || typeof portionStr !== 'string') return null;
  
  // Remove common units and extra spaces
  const cleaned = portionStr.toLowerCase().trim();
  
  // Try to extract the first number (int or decimal)
  const match = cleaned.match(/(\d+\.?\d*)/);
  if (match) {
    const value = parseFloat(match[1]);
    return isNaN(value) ? null : value;
  }
  
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { foodName, originalPortion, newPortion, originalMacros } = await req.json();
    
    console.log('Recalculating macros for:', { foodName, originalPortion, newPortion, originalMacros });

    // Extract numeric values from portions
    const originalValue = extractNumericValue(originalPortion);
    const newValue = extractNumericValue(newPortion);
    
    console.log('Extracted values:', { originalValue, newValue });

    let result;

    // If we can extract both numeric values, use direct mathematical calculation
    if (originalValue !== null && newValue !== null && originalValue > 0) {
      const ratio = newValue / originalValue;
      
      console.log('Using mathematical calculation with ratio:', ratio);
      
      result = {
        calories: Math.round(originalMacros.calories * ratio),
        protein: Math.round(originalMacros.protein * ratio * 10) / 10,
        carbs: Math.round(originalMacros.carbs * ratio * 10) / 10,
        fats: Math.round(originalMacros.fats * ratio * 10) / 10,
      };
    } else {
      // Fallback to AI for complex portion descriptions
      console.log('Using AI fallback for complex portions');
      
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (!LOVABLE_API_KEY) {
        throw new Error('LOVABLE_API_KEY not configured');
      }

      const prompt = `You are a nutrition calculator. Calculate new macros based on portion change.

Food: ${foodName}
Original portion: ${originalPortion}
New portion: ${newPortion}

Original macros:
- Calories: ${originalMacros.calories}
- Protein: ${originalMacros.protein}g
- Carbs: ${originalMacros.carbs}g
- Fats: ${originalMacros.fats}g

Calculate proportionally. If you cannot determine the exact ratio, make your best estimate based on common portion sizes for this food.

Return ONLY valid JSON (no markdown):
{"calories": number, "protein": number, "carbs": number, "fats": number}`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API returned ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      console.log('AI Response:', aiResponse);

      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      const macros = JSON.parse(cleanedResponse);

      result = {
        calories: Math.round(macros.calories),
        protein: Math.round(macros.protein * 10) / 10,
        carbs: Math.round(macros.carbs * 10) / 10,
        fats: Math.round(macros.fats * 10) / 10,
      };
    }

    console.log('Final calculated macros:', result);

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
