
import { Sidebar } from "@/components/Sidebar";
import { ChatBuddy } from "@/components/ChatBuddy";
import { Button } from "@/components/ui/button";
import { HackathonCard } from "@/components/HackathonCard";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Plus } from "lucide-react";
import { useState } from "react";

const Hackathons = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 pl-16 md:pl-64 pt-6">
        <main className="container px-4 pb-16">
          <header className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Your Hackathons</h1>
              <p className="text-gray-600 mt-1">Add details about hackathons you're interested in</p>
            </div>
            <Button 
              className="bg-gradient-primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus size={18} className="mr-1" /> Add Hackathon
            </Button>
          </header>
          
          {showAddForm && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6 animate-fade-in">
              <h2 className="text-lg font-semibold mb-4">Add Hackathon Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Hackathon Description
                  </label>
                  <Textarea 
                    placeholder="Paste the hackathon details or description here..."
                    rows={6}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Or upload event documentation
                  </label>
                  <div className="rounded-lg border border-gray-200 p-4 text-center">
                    <Button variant="outline" size="sm">
                      <FileUp size={16} className="mr-1" /> Upload PDF
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-primary">
                    Add Hackathon
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">Upcoming Hackathons</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <HackathonCard
                  title="Healthcare Innovation"
                  description="Creating solutions for healthcare"
                  date="June 5-7, 2025"
                  location="Boston & Virtual"
                  duration="54 hours"
                />
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">Past Hackathons</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <HackathonCard
                  title="AI for Good"
                  description="Using AI to solve global challenges"
                  date="Mar 15-17, 2025"
                  location="Online"
                  duration="48 hours"
                  className="opacity-75"
                />
                <HackathonCard
                  title="Web3 Builders"
                  description="Building the decentralized future"
                  date="Feb 22-24, 2025"
                  location="New York & Virtual"
                  duration="72 hours"
                  className="opacity-75"
                />
              </div>
            </section>
          </div>
        </main>
      </div>
      
      <ChatBuddy />
    </div>
  );
};

export default Hackathons;
