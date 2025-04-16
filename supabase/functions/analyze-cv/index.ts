
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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
    const { cvUrl, userId } = await req.json();
    
    if (!cvUrl) {
      return new Response(
        JSON.stringify({ error: 'CV URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get auth token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing CV for user ${userId}: ${cvUrl}`);

    // Fetch CV content - this assumes it's a text-based file
    // For PDFs, you would need additional processing
    let cvText = "";
    try {
      const response = await fetch(cvUrl);
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/pdf')) {
        cvText = "PDF detected. Analysis will be based on extracted text and metadata.";
      } else if (contentType.includes('text/')) {
        cvText = await response.text();
      } else if (contentType.includes('application/vnd.openxmlformats-officedocument') || 
                contentType.includes('application/msword')) {
        cvText = "Word document detected. Analysis will be based on extracted text and metadata.";
      } else {
        cvText = "Unable to process CV content directly. Analysis will be based on available metadata.";
      }
    } catch (error) {
      console.error("Error fetching CV:", error);
      cvText = "Unable to process CV content. Using URL reference instead.";
    }

    if (!geminiApiKey) {
      console.error("No Gemini API key found");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `
      You are an AI assistant helping with career guidance for hackathons.
      Please analyze this CV/resume and identify the following:
      1. Key technical skills
      2. Experience level
      3. Suggested roles for hackathons based on skills
      4. Areas for skill improvement
      
      The CV is located at: ${cvUrl}
      CV content (if available): ${cvText}
      
      Format your response as JSON with the following structure:
      {
        "skills": ["skill1", "skill2", ...],
        "experienceLevel": "beginner|intermediate|advanced",
        "suggestedRoles": ["role1", "role2", ...],
        "improvementAreas": ["area1", "area2", ...]
      }
    `;

    console.log("Sending request to Gemini API");
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiApiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024
        }
      })
    });

    const result = await response.json();
    console.log("Received response from Gemini API");
    
    let analysisResult;
    try {
      if (result.candidates && result.candidates[0].content.parts[0].text) {
        const textResponse = result.candidates[0].content.parts[0].text;
        console.log("Raw response:", textResponse);
        
        // Extract JSON from the response (handling potential formatting)
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback to parsing the whole response as JSON
          analysisResult = JSON.parse(textResponse);
        }
        console.log("Parsed analysis result:", analysisResult);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error parsing Gemini response:", error, result);
      // Provide a structured fallback
      analysisResult = {
        skills: ["Unable to automatically detect skills"],
        experienceLevel: "unknown",
        suggestedRoles: ["Please review CV manually"],
        improvementAreas: ["Unable to analyze CV automatically"]
      };
    }

    return new Response(
      JSON.stringify({ analysis: analysisResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in analyze-cv function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
