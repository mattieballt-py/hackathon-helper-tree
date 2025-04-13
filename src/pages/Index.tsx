
import { Sidebar } from "@/components/Sidebar";
import { ChatBuddy } from "@/components/ChatBuddy";
import { SkillTree } from "@/components/SkillTree";
import { ProfileSummary } from "@/components/ProfileSummary";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 pl-16 md:pl-64 pt-6">
        <main className="container px-4 pb-16">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome to <span className="gradient-text">HackHelper</span>
            </h1>
            <p className="text-gray-600 mt-1">Your personal guide to hackathon success</p>
          </header>

          {user ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
                  <p className="text-sm text-gray-600 mb-2 italic">
                    Select the skills you'd like to develop to see what you can achieve with HackHelper
                  </p>
                  <SkillTree />
                </div>
              </div>
              
              <div className="space-y-6">
                <ProfileSummary />
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Get Started with HackHelper</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Sign in to track your hackathons, develop your skills, and get personalized AI assistance for your projects.
              </p>
              <Button 
                className="bg-gradient-primary"
                size="lg"
                onClick={() => navigate('/auth')}
              >
                Sign In to Continue
              </Button>
            </div>
          )}
        </main>
      </div>
      
      <ChatBuddy />
    </div>
  );
};

export default Index;
