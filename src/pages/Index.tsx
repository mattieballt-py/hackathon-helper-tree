
import { Sidebar } from "@/components/Sidebar";
import { ChatBuddy } from "@/components/ChatBuddy";
import { SkillTree } from "@/components/SkillTree";
import { ProfileSummary } from "@/components/ProfileSummary";
import { HackathonCard } from "@/components/HackathonCard";

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
              
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Active Hackathons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <HackathonCard
                    title="TechCrunch Disrupt"
                    description="Build the next unicorn startup"
                    date="Apr 25-27, 2025"
                    location="Virtual Event"
                    duration="48 hours"
                  />
                  <HackathonCard
                    title="Climate Hack"
                    description="Solving environmental challenges"
                    date="May 10-12, 2025"
                    location="Hybrid - SF & Virtual"
                    duration="36 hours"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <ProfileSummary />
              
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h2 className="text-lg font-medium mb-3">Quick Resources</h2>
                <ul className="space-y-2">
                  {[
                    "Hackathon Beginner's Guide",
                    "Team Formation Tips",
                    "Presentation Templates",
                    "Example Projects",
                    "Technical Cheatsheets"
                  ].map((resource, i) => (
                    <li key={i}>
                      <a 
                        href="#" 
                        className="text-sm text-gray-800 hover:text-babyblue flex py-1.5 px-2 hover:bg-gray-50 rounded-md"
                      >
                        {resource}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <ChatBuddy />
    </div>
  );
};

export default Index;
