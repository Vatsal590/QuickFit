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

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Fetching recipe for:', mealName);

    // Use OpenAI to get accurate recipe based on real recipes
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional chef and recipe expert. Provide accurate, tested recipes with precise measurements for 1 portion. Format your response as JSON with "ingredients" (array of strings with exact measurements) and "instructions" (array of step-by-step strings). Be specific with measurements, cooking times, and temperatures.'
          },
          {
            role: 'user',
            content: `Provide a detailed recipe for "${mealName}" for 1 portion. Include:\n1. Exact ingredient measurements for 1 serving\n2. Step-by-step cooking instructions\n3. Cooking time and temperature if applicable\n\nFormat as JSON: {"ingredients": ["ingredient with measurement", ...], "instructions": ["step 1", "step 2", ...]}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to fetch recipe from OpenAI');
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
