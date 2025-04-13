
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatBuddy } from "@/components/ChatBuddy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // This would normally connect to Supabase, but we'll simulate for now
  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    try {
      // In a real app, this would be a call to Supabase
      // For example:
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .upsert({
      //     id: user.id,
      //     full_name: fullName,
      //     email: email,
      //     bio: bio,
      //     skills: skills
      //   });
      
      // if (cvFile) {
      //   const fileExt = cvFile.name.split('.').pop();
      //   const fileName = `${userId}-cv.${fileExt}`;
      //   const { error: uploadError } = await supabase.storage
      //     .from('cvs')
      //     .upload(fileName, cvFile);
      // }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
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
                      onChange={(e) => setEmail(e.target.value)}
                    />
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
                    <Input 
                      placeholder="e.g., JavaScript, UI Design, Data Analysis" 
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Comma separated list or upload your CV below
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <label className="text-sm font-medium text-gray-700 block mb-3">
                      Upload CV / Resume
                    </label>
                    <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
                      <FileUp className="mx-auto h-10 w-10 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        {cvFile ? cvFile.name : "Drag and drop your CV/resume"}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Our AI will analyze your skills and provide tailored recommendations
                      </p>
                      <div className="mt-4">
                        <input
                          id="cv-upload"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button variant="outline" onClick={() => document.getElementById('cv-upload')?.click()}>
                          {cvFile ? "Change File" : "Select File"}
                        </Button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-gradient-primary"
                    disabled={isUploading}
                  >
                    {isUploading ? "Saving..." : "Save Profile"}
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
