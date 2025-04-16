
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileUp } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";

export function ProfileSummary() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
  const userInitials = user.email ? user.email.substring(0, 2).toUpperCase() : "ME";
  
  return (
    <Card>
      <CardHeader className="bg-gradient-primary py-6">
        <div className="flex items-center">
          <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-2xl font-bold shadow">
            {userInitials}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-primary-foreground">
              Welcome Back
            </h3>
            <p className="text-sm text-primary-foreground/80">
              {user.email}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
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
          <div>
            <h3 className="text-sm font-medium text-gray-900">Skills</h3>
            <p className="text-xs text-gray-500 mb-2">Upload your CV to analyze your skills</p>
            <div className="flex flex-wrap gap-1">
              {["React", "UI/UX", "JavaScript"].map((skill) => (
                <span 
                  key={skill}
                  className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
