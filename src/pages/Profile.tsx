
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { ChatBuddy } from "@/components/ChatBuddy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  full_name: string;
  bio: string;
  cv_url?: string;
  avatar_url?: string;
}

interface SkillAnalysis {
  skills: string[];
  experienceLevel: string;
  suggestedRoles: string[];
  improvementAreas: string[];
}

const Profile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SkillAnalysis | null>(null);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Set email from auth
    setEmail(user.email || "");
    
    // Fetch profile data from Supabase
    async function fetchProfile() {
      try {
        // First check if the profile exists
        const { data: existingProfile, error: checkError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id);
        
        // If no profile exists or there's an error, create a new profile
        if (checkError || !existingProfile || existingProfile.length === 0) {
          console.log("Profile not found. Creating new profile...");
          
          // Create a default profile for the user
          const { error: createError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              full_name: "",
              bio: "",
              updated_at: new Date().toISOString()
            });
            
          if (createError) {
            console.error("Error creating profile:", createError);
            toast({
              title: "Profile Creation Failed",
              description: "Could not create your profile. Please try again.",
              variant: "destructive"
            });
            return;
          } else {
            console.log("Default profile created successfully");
            setProfileExists(true);
            // Now fetch the newly created profile
            const { data: newProfile, error: newProfileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .single();
              
            if (newProfileError || !newProfile) {
              console.error("Error fetching new profile:", newProfileError);
              return;
            }
            
            if (newProfile) {
              setFullName(newProfile.full_name || "");
              setBio(newProfile.bio || "");
              setCvUrl(newProfile.cv_url || null);
            }
          }
        } else {
          // Profile exists, set the data
          setProfileExists(true);
          const profile = existingProfile[0];
          setFullName(profile.full_name || "");
          setBio(profile.bio || "");
          setCvUrl(profile.cv_url || null);
          
          // If CV exists, analyze it
          if (profile.cv_url) {
            analyzeCv(profile.cv_url, user.id);
          }
        }
      } catch (error) {
        console.error("Error handling profile:", error);
      }
    }
    
    fetchProfile();
  }, [user, navigate]);

  const analyzeCv = async (url: string, userId: string) => {
    if (!url) return;
    
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-cv', {
        body: { cvUrl: url, userId }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.analysis) {
        setAnalysis(data.analysis);
        setSkills(data.analysis.skills || []);
      }
    } catch (error: any) {
      console.error("Error analyzing CV:", error);
      toast({
        title: "CV Analysis Failed",
        description: error.message || "There was an error analyzing your CV.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createBucketIfNotExists = async () => {
    try {
      // Try to get bucket info to check if it exists
      const { data: bucketExists, error } = await supabase.storage.getBucket('user_files');
      
      // If bucket doesn't exist or there's an error, try to create it
      if (error || !bucketExists) {
        const { error: createError } = await supabase.storage.createBucket('user_files', {
          public: false
        });
        
        if (createError) {
          console.error("Error creating bucket:", createError);
          throw new Error("Failed to create storage bucket");
        }
        console.log("Bucket created successfully");
      }
      
      return true;
    } catch (error) {
      console.error("Error in bucket creation:", error);
      return false;
    }
  };

  const uploadCV = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    // Create user_files bucket if it doesn't exist
    const bucketCreated = await createBucketIfNotExists();
    if (!bucketCreated) {
      toast({
        title: "Storage Error",
        description: "Could not initialize file storage. Please try again.",
        variant: "destructive"
      });
      return null;
    }
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-cv.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from("user_files")
      .upload(fileName, file, {
        upsert: true,
      });
    
    if (error) {
      console.error("Error uploading CV:", error);
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from("user_files")
      .getPublicUrl(data.path);
    
    return publicUrl;
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to update your profile.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // First, ensure profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id);
      
      // If profile doesn't exist, create it first
      if (checkError || !existingProfile || existingProfile.length === 0) {
        const { error: createError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            full_name: fullName,
            bio: bio,
            updated_at: new Date().toISOString()
          });
          
        if (createError) {
          console.error("Error creating profile:", createError);
          throw new Error("Failed to create your profile");
        }
      }
      
      let newCvUrl = cvUrl;
      
      // Upload CV if a new file was selected
      if (cvFile) {
        newCvUrl = await uploadCV(cvFile);
        if (!newCvUrl) {
          throw new Error("Failed to upload CV");
        }
        setCvUrl(newCvUrl);
      }
      
      // Update the profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          bio: bio,
          cv_url: newCvUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
        
      if (updateError) {
        console.error("Profile update error:", updateError);
        throw new Error(updateError.message);
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      // Analyze the CV if it was newly uploaded
      if (cvFile && newCvUrl) {
        analyzeCv(newCvUrl, user.id);
      }
      
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "There was an error updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 pl-16 md:pl-64 pt-6">
        <main className="container px-4 pb-16">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Your Profile</h1>
            <p className="text-gray-600 mt-1">Complete your profile to get personalized support</p>
          </header>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="max-w-2xl mx-auto">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Full Name
                    </label>
                    <Input 
                      placeholder="Enter your full name" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Email Address
                    </label>
                    <Input 
                      type="email" 
                      placeholder="Enter your email address" 
                      value={email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email is associated with your account and cannot be changed here
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      About You
                    </label>
                    <Textarea 
                      placeholder="Tell us about yourself, your interests, and experience..."
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Skills & Expertise
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {skills && skills.length > 0 ? (
                        skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 rounded-full bg-blue-100 text-xs text-blue-700"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">
                          Upload your CV to automatically identify your skills
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <label className="text-sm font-medium text-gray-700 block mb-3">
                      Upload CV / Resume
                    </label>
                    <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
                      <FileUp className="mx-auto h-10 w-10 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        {cvFile ? cvFile.name : cvUrl ? "CV Already Uploaded" : "Drag and drop your CV/resume"}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Our AI will analyze your skills and provide tailored recommendations
                      </p>
                      <div className="mt-4">
                        <input
                          id="cv-upload"
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button variant="outline" onClick={() => document.getElementById('cv-upload')?.click()}>
                          {cvUrl ? "Replace CV" : "Select File"}
                        </Button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">PDF, DOC, DOCX, or TXT up to 10MB</p>
                      
                      {cvUrl && (
                        <div className="mt-4 p-2 bg-gray-50 rounded flex justify-between items-center">
                          <span className="text-sm truncate">{cvUrl.split('/').pop()}</span>
                          <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm">View</Button>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {analysis && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-blue-900">AI Analysis Results</h3>
                      
                      <div className="mt-2 space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">Experience Level</h4>
                          <p className="text-sm text-blue-700 capitalize">{analysis.experienceLevel}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">Suggested Roles</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysis.suggestedRoles.map((role, i) => (
                              <span key={i} className="px-2 py-1 rounded-full bg-blue-100 text-xs text-blue-700">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">Areas for Improvement</h4>
                          <ul className="list-disc list-inside text-sm text-blue-700">
                            {analysis.improvementAreas.map((area, i) => (
                              <li key={i}>{area}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-gradient-primary"
                    disabled={isUploading || isAnalyzing}
                  >
                    {isUploading ? "Saving..." : isAnalyzing ? "Analyzing CV..." : "Save Profile"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      
      <ChatBuddy />
    </div>
  );
};

export default Profile;
