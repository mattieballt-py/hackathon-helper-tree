
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileUp } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function ProfileSummary() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string[]>([]);
  const [fullName, setFullName] = useState("");
  
  useEffect(() => {
    // If user is signed in, fetch their profile data
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (!error && data) {
          setFullName(data.full_name || "");
          
          // If user has a CV, try to get analyzed skills
          if (data.cv_url) {
            try {
              const { data: analysisData } = await supabase.functions.invoke('analyze-cv', {
                body: { cvUrl: data.cv_url, userId: user.id }
              });
              
              if (analysisData && analysisData.analysis && analysisData.analysis.skills) {
                setSkills(analysisData.analysis.skills.slice(0, 5)); // Show first 5 skills
              }
            } catch (err) {
              console.error("Error fetching skills analysis:", err);
            }
          }
        }
      };
      
      fetchProfile();
    }
  }, [user]);
  
  // If user is not signed in, show a sign in prompt
  if (!user) {
    return (
      <Card>
        <CardHeader className="bg-gradient-primary py-6">
          <div className="flex items-center">
            <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-2xl font-bold shadow">
              GU
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-primary-foreground">Guest User</h3>
              <p className="text-sm text-primary-foreground/80">Sign in to get personalized help</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Button 
              className="w-full bg-gradient-primary" 
              onClick={() => navigate("/auth")}
            >
              Sign In or Register
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If user is signed in, show their profile summary
  const userInitials = fullName 
    ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : user.email 
      ? user.email.substring(0, 2).toUpperCase() 
      : "ME";
  
  return (
    <Card>
      <CardHeader className="bg-gradient-primary py-6">
        <div className="flex items-center">
          <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-2xl font-bold shadow">
            {userInitials}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-primary-foreground">
              {fullName || "Welcome Back"}
            </h3>
            <p className="text-sm text-primary-foreground/80">
              {user.email}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {!fullName && (
            <div>
              <h3 className="text-sm font-medium text-gray-900">Profile Status</h3>
              <Button 
                className="w-full mt-2" 
                variant="outline"
                onClick={() => navigate("/profile")}
              >
                Complete Your Profile
              </Button>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Skills</h3>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-2">
                {skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-2">Upload your CV to analyze your skills</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate("/profile")}
                >
                  <FileUp className="mr-1" size={14} />
                  Upload CV
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
