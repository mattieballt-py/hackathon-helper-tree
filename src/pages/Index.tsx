
import { Sidebar } from "@/components/Sidebar";
import { ChatBuddy } from "@/components/ChatBuddy";
import { SkillTree } from "@/components/SkillTree";
import { ProfileSummary } from "@/components/ProfileSummary";

const Index = () => {
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SkillTree />
            </div>
            
            <div className="space-y-6">
              <ProfileSummary />
            </div>
          </div>
        </main>
      </div>
      
      <ChatBuddy />
    </div>
  );
};

export default Index;
