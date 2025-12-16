import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customEquipment, muscleGroups, intensity } = await req.json();
    
    if (!customEquipment || customEquipment.trim() === '') {
      return new Response(
        JSON.stringify({ exercises: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are a professional fitness trainer. Given custom gym equipment that a user has, determine if it can be used for exercises targeting the selected muscle groups. 

IMPORTANT RULES:
1. Only suggest exercises if the equipment is actually usable for fitness exercises
2. Only suggest 1-2 exercises maximum that genuinely work the selected muscle groups
3. If the equipment is not suitable for fitness (like random household items that can't be safely used), return an empty array
4. Focus on safety - don't suggest dangerous exercises

For each valid exercise, provide:
- name: Exercise name
- muscleGroup: Which muscle group it targets (must be one of the selected groups)
- sets: Number of sets (2-4 based on intensity)
- reps: Number of reps (8-15)
- restTime: Rest between sets in seconds (30-60)
- description: Brief one-line description
- howToPerform: Detailed step-by-step instructions on how to perform the exercise safely and effectively (3-5 sentences)

Return your response as a JSON object with an "exercises" array.`;

    const userPrompt = `Custom equipment: "${customEquipment}"
Target muscle groups: ${muscleGroups.join(', ')}
Intensity: ${intensity}

Analyze this equipment and suggest exercises if it's suitable for fitness. Return JSON with an "exercises" array.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_exercises",
              description: "Suggest exercises for custom equipment",
              parameters: {
                type: "object",
                properties: {
                  exercises: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        muscleGroup: { type: "string" },
                        sets: { type: "number" },
                        reps: { type: "number" },
                        restTime: { type: "number" },
                        description: { type: "string" },
                        howToPerform: { type: "string" }
                      },
                      required: ["name", "muscleGroup", "sets", "reps", "restTime", "description", "howToPerform"]
                    }
                  }
                },
                required: ["exercises"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "suggest_exercises" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded, please try again later' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(
          JSON.stringify({ error: 'AI service payment required' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data));
    
    // Extract exercises from tool call response
    let exercises = [];
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments);
        exercises = parsed.exercises || [];
      } catch (e) {
        console.error('Failed to parse tool arguments:', e);
      }
    }

    // Mark exercises as custom equipment exercises
    exercises = exercises.map((ex: any, index: number) => ({
      ...ex,
      id: `custom-${Date.now()}-${index}`,
      equipment: ['none'],
      isCustomEquipment: true
    }));

    console.log('Generated custom exercises:', exercises);

    return new Response(
      JSON.stringify({ exercises }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-custom-exercises:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
