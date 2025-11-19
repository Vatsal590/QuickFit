import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { mealName } = await req.json();
    
    if (!mealName) {
      throw new Error('Meal name is required');
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Fetching recipe for:', mealName);

    // Use Lovable AI to get accurate recipe based on real recipes
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a chef. Provide recipes with measurements for 1 portion in JSON format: {"ingredients": ["item with amount"], "instructions": ["step"]}. Be concise and precise.'
          },
          {
            role: 'user',
            content: `Recipe for "${mealName}" (1 portion). JSON only: {"ingredients": ["..."], "instructions": ["..."]}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Lovable AI Gateway error:', error);
      throw new Error('Failed to fetch recipe from AI');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    let recipeData;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      recipeData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse recipe JSON:', parseError);
      console.log('Raw content:', content);
      throw new Error('Failed to parse recipe data');
    }

    return new Response(
      JSON.stringify({
        success: true,
        recipe: {
          mealName,
          ingredients: recipeData.ingredients || [],
          instructions: recipeData.instructions || [],
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-recipe function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to fetch recipe'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
