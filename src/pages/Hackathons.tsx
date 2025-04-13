
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatBuddy } from "@/components/ChatBuddy";
import { Button } from "@/components/ui/button";
import { HackathonCard } from "@/components/HackathonCard";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileUp, Globe, MapPin, Plus, Wifi } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define types for our hackathon data and filters
type HackathonLocation = 'in-person' | 'remote' | 'hybrid';
type HackathonFilter = 'all' | HackathonLocation;

interface HackathonData {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  locationType: HackathonLocation;
  duration: string;
}

const Hackathons = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<HackathonFilter>('all');
  const [hackathonTitle, setHackathonTitle] = useState("");
  const [hackathonDesc, setHackathonDesc] = useState("");
  const [hackathonLocation, setHackathonLocation] = useState("");
  const [hackathonLocationType, setHackathonLocationType] = useState<HackathonLocation>("hybrid");
  const [hackathonDate, setHackathonDate] = useState("");
  const [hackathonDuration, setHackathonDuration] = useState("");
  
  // Sample hackathon data - in a real app, this would come from Supabase
  const [hackathons, setHackathons] = useState<HackathonData[]>([
    {
      id: "1",
      title: "TechCrunch Disrupt",
      description: "Build the next unicorn startup",
      date: "Apr 25-27, 2025",
      location: "Virtual Event",
      locationType: "remote",
      duration: "48 hours"
    },
    {
      id: "2",
      title: "Climate Hack",
      description: "Solving environmental challenges",
      date: "May 10-12, 2025",
      location: "Hybrid - SF & Virtual",
      locationType: "hybrid",
      duration: "36 hours"
    },
    {
      id: "3",
      title: "Healthcare Innovation",
      description: "Creating solutions for healthcare",
      date: "June 5-7, 2025",
      location: "Boston",
      locationType: "in-person",
      duration: "54 hours"
    }
  ]);

  // Filter hackathons based on location type
  const filteredHackathons = hackathons.filter(hackathon => 
    filter === 'all' || hackathon.locationType === filter
  );

  // Add a new hackathon
  const handleAddHackathon = () => {
    if (!hackathonTitle || !hackathonDesc || !hackathonLocation || !hackathonDate || !hackathonDuration) {
      alert("Please fill out all fields");
      return;
    }
    
    const newHackathon: HackathonData = {
      id: Date.now().toString(),
      title: hackathonTitle,
      description: hackathonDesc,
      date: hackathonDate,
      location: hackathonLocation,
      locationType: hackathonLocationType,
      duration: hackathonDuration
    };
    
    setHackathons([...hackathons, newHackathon]);
    
    // Reset form
    setHackathonTitle("");
    setHackathonDesc("");
    setHackathonLocation("");
    setHackathonDate("");
    setHackathonDuration("");
    setShowAddForm(false);
  };
  
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
                    Hackathon Title
                  </label>
                  <Input 
                    value={hackathonTitle}
                    onChange={(e) => setHackathonTitle(e.target.value)}
                    placeholder="Enter hackathon title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Hackathon Description
                  </label>
                  <Textarea 
                    value={hackathonDesc}
                    onChange={(e) => setHackathonDesc(e.target.value)}
                    placeholder="Describe the hackathon..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Date
                    </label>
                    <Input 
                      value={hackathonDate}
                      onChange={(e) => setHackathonDate(e.target.value)}
                      placeholder="e.g., Apr 25-27, 2025"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Duration
                    </label>
                    <Input 
                      value={hackathonDuration}
                      onChange={(e) => setHackathonDuration(e.target.value)}
                      placeholder="e.g., 48 hours"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Location
                  </label>
                  <Input 
                    value={hackathonLocation}
                    onChange={(e) => setHackathonLocation(e.target.value)}
                    placeholder="e.g., San Francisco or Virtual"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Location Type
                  </label>
                  <RadioGroup defaultValue={hackathonLocationType} className="flex space-x-4" onValueChange={(value) => setHackathonLocationType(value as HackathonLocation)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="in-person" id="in-person" />
                      <label htmlFor="in-person" className="text-sm">In-person</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="remote" id="remote" />
                      <label htmlFor="remote" className="text-sm">Remote</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hybrid" id="hybrid" />
                      <label htmlFor="hybrid" className="text-sm">Hybrid</label>
                    </div>
                  </RadioGroup>
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
                  <Button className="bg-gradient-primary" onClick={handleAddHackathon}>
                    Add Hackathon
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Upcoming Hackathons</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Filter:</span>
                  <Button 
                    variant={filter === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    <Globe size={14} className="mr-1" /> All
                  </Button>
                  <Button 
                    variant={filter === 'in-person' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('in-person')}
                  >
                    <MapPin size={14} className="mr-1" /> In-person
                  </Button>
                  <Button 
                    variant={filter === 'remote' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('remote')}
                  >
                    <Wifi size={14} className="mr-1" /> Remote
                  </Button>
                  <Button 
                    variant={filter === 'hybrid' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('hybrid')}
                  >
                    <Globe size={14} className="mr-1" /> Hybrid
                  </Button>
                </div>
              </div>

              {filteredHackathons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredHackathons.map(hackathon => (
                    <HackathonCard
                      key={hackathon.id}
                      title={hackathon.title}
                      description={hackathon.description}
                      date={hackathon.date}
                      location={hackathon.location}
                      duration={hackathon.duration}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-500">No hackathons match your filter.</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
      
      <ChatBuddy />
    </div>
  );
};

export default Hackathons;
