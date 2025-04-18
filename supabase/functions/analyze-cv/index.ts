
// This file will be executed as a Supabase Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle the incoming request
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse the request body
    const { cvUrl, userId } = await req.json();
    
    if (!cvUrl) {
      return new Response(
        JSON.stringify({ error: 'CV URL is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // In a real implementation, you would do actual CV analysis here
    // For demo purposes, we'll return mock analysis data
    const analysis = {
      skills: ["React", "TypeScript", "Python", "Data Analysis", "UI Design"],
      experienceLevel: "Intermediate",
      suggestedRoles: ["Frontend Developer", "Full Stack Engineer", "UI Designer"],
      improvementAreas: ["Add more backend experience", "Contribute to open-source projects"]
    };
    
    console.log(`Analyzed CV for user ${userId} with URL ${cvUrl}`);
    
    // Return the analysis results
    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in analyze-cv function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred during CV analysis" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
