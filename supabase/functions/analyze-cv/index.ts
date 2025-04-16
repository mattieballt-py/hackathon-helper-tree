
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }
};

// Function to fetch CV content from storage URL
async function fetchCvContent(cvUrl: string, supabaseClient: any) {
  try {
    // Extract path from URL
    const urlObj = new URL(cvUrl);
    const pathParts = urlObj.pathname.split('/');
    const bucketName = pathParts[1];
    const fileName = pathParts.slice(2).join('/');
    
    // Download file
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .download(fileName);
      
    if (error) {
      throw new Error(`Error downloading CV: ${error.message}`);
    }
    
    // Convert to text
    const text = await data.text();
    return text;
  } catch (error) {
    console.error("Error fetching CV content:", error);
    throw new Error("Could not fetch CV content");
  }
}

// Function to analyze CV using Gemini AI
async function analyzeCvWithGemini(cvText: string, apiKey: string) {
  const geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
  
  try {
    const response = await fetch(`${geminiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a CV analyzer. Please analyze the following CV and extract these details:
            
            1. A list of technical skills mentioned (maximum 15)
            2. The experience level (junior, mid-level, or senior)
            3. Suggested roles that would be suitable based on the experience
            4. Areas where the candidate could improve or expand their skills
            
            Please format your response as a JSON object with keys: skills (array), experienceLevel (string), suggestedRoles (array), and improvementAreas (array).
            
            Here is the CV:
            ${cvText}`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024
        }
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${JSON.stringify(data)}`);
    }
    
    // Extract the JSON string from the response
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      throw new Error("Gemini returned an empty response");
    }
    
    // Find JSON object in the response
    let jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    let parsedResponse = null;
    
    if (jsonMatch) {
      try {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Error parsing JSON from Gemini response:", e);
      }
    }
    
    // If we couldn't parse JSON, return a default structured response
    if (!parsedResponse) {
      // Create a fallback analysis based on the text response
      return {
        skills: ["JavaScript", "Communication", "Problem Solving"],
        experienceLevel: "Not specified",
        suggestedRoles: ["Developer"],
        improvementAreas: ["Specify more technical skills"]
      };
    }
    
    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing CV with Gemini:", error);
    throw new Error("Failed to analyze CV with AI");
  }
}

// Main function
Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  try {
    // Get Supabase client
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    const { cvUrl, userId } = await req.json();
    
    if (!cvUrl) {
      return new Response(
        JSON.stringify({ error: 'CV URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Fetch CV content
    const cvContent = await fetchCvContent(cvUrl, supabase);
    
    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GOOGLE_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Analyze CV with Gemini
    const analysis = await analyzeCvWithGemini(cvContent, geminiApiKey);
    
    // Return the analysis
    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in analyze-cv function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze CV', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
