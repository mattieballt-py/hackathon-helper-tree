
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

Deno.serve(async (req) => {
  try {
    // Get the request body
    const { cvUrl, userId } = await req.json()
    
    if (!cvUrl) {
      return new Response(
        JSON.stringify({ error: 'CV URL is required' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Mock analysis since this is just a demo
    // In a real application, you would send the CV to an AI service for analysis
    const mockAnalysis = {
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'HTML/CSS'],
      experienceLevel: 'Intermediate',
      suggestedRoles: ['Frontend Developer', 'Full Stack Engineer', 'UI Developer'],
      improvementAreas: [
        'Consider learning more backend technologies',
        'Add cloud deployment experience',
        'Develop skills in automated testing'
      ]
    }

    // Return the analysis
    return new Response(
      JSON.stringify({ 
        success: true,
        analysis: mockAnalysis
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error analyzing CV:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze CV',
        details: error.message
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
