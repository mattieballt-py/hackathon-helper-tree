
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { ChatBuddy } from "@/components/ChatBuddy";
import { Button } from "@/components/ui/button";
import { HackathonCard } from "@/components/HackathonCard";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileUp, Globe, MapPin, Plus, Wifi, Building, PlusCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

// Define types for our hackathon data and filters
type HackathonLocation = 'in-person' | 'remote' | 'hybrid';
type HackathonFilter = 'all' | 'global' | HackathonLocation;

interface HackathonData {
  id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  location_type: HackathonLocation;
  duration: string;
  website_url?: string;
  created_at?: string;
}

const Hackathons = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<HackathonFilter>('all');
  const [hackathonTitle, setHackathonTitle] = useState("");
  const [hackathonDesc, setHackathonDesc] = useState("");
  const [hackathonLocation, setHackathonLocation] = useState("");
  const [hackathonLocationType, setHackathonLocationType] = useState<HackathonLocation>("hybrid");
  const [hackathonDate, setHackathonDate] = useState("");
  const [hackathonDuration, setHackathonDuration] = useState("");
  const [hackathonUrl, setHackathonUrl] = useState("");
  const [hackathons, setHackathons] = useState<HackathonData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check for hackathon ID in URL params to show details
  const hackathonId = searchParams.get('id');

  // Fetch hackathons from Supabase
  useEffect(() => {
    async function fetchHackathons() {
      if (!user) {
        navigate("/auth");
        return;
      }
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('hackathons')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Cast the data to ensure type compatibility
          const typedData = data.map(item => ({
            ...item,
            location_type: item.location_type as HackathonLocation
          }));
          setHackathons(typedData);
        }
      } catch (error: any) {
        console.error('Error fetching hackathons:', error);
        toast({
          title: "Error",
          description: "Failed to load your hackathons. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchHackathons();
    
    // If there's a hackathon ID in the URL, show the add form
    if (hackathonId) {
      const hackathon = hackathons.find(h => h.id === hackathonId);
      if (hackathon) {
        setHackathonTitle(hackathon.title);
        setHackathonDesc(hackathon.description);
        setHackathonLocation(hackathon.location);
        setHackathonLocationType(hackathon.location_type);
        setHackathonDate(hackathon.date);
        setHackathonDuration(hackathon.duration);
        setHackathonUrl(hackathon.website_url || "");
        setShowAddForm(true);
      }
    }
  }, [user, navigate, hackathonId]);

  // Filter hackathons based on location type
  const filteredHackathons = hackathons.filter(hackathon => {
    if (filter === 'all') return true;
    if (filter === 'global') return hackathon.location.toLowerCase().includes('global') || 
                                  hackathon.location.toLowerCase().includes('worldwide') || 
                                  hackathon.location.toLowerCase().includes('international');
    return hackathon.location_type === filter;
  });

  // Add a new hackathon
  const handleAddHackathon = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (!hackathonTitle || !hackathonDesc) {
      toast({
        title: "Missing information",
        description: "Please fill out at least the title and description fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const hackathonData = {
        user_id: user.id,
        title: hackathonTitle,
        description: hackathonDesc,
        date: hackathonDate || null,
        location: hackathonLocation || null,
        location_type: hackathonLocationType,
        duration: hackathonDuration || null,
        website_url: hackathonUrl || null
      };
      
      // If editing existing hackathon
      if (hackathonId) {
        const { error } = await supabase
          .from('hackathons')
          .update(hackathonData)
          .eq('id', hackathonId)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Hackathon updated successfully!"
        });
        
        // Update the hackathon in the local state
        setHackathons(prevHackathons => 
          prevHackathons.map(h => 
            h.id === hackathonId 
              ? { ...h, ...hackathonData, location_type: hackathonLocationType } 
              : h
          )
        );
        
      } else {
        // Creating new hackathon
        const { data, error } = await supabase
          .from('hackathons')
          .insert(hackathonData)
          .select();
          
        if (error) throw error;
        
        if (data) {
          // Add the typed hackathon to the state
          const newHackathon: HackathonData = {
            ...data[0],
            location_type: data[0].location_type as HackathonLocation
          };
          setHackathons([...hackathons, newHackathon]);
        }
        
        toast({
          title: "Success",
          description: "Hackathon added successfully!"
        });
      }
      
      // Reset form
      setHackathonTitle("");
      setHackathonDesc("");
      setHackathonLocation("");
      setHackathonDate("");
      setHackathonDuration("");
      setHackathonUrl("");
      setShowAddForm(false);
      
      // Remove ID from URL
      navigate("/hackathons");
    } catch (error: any) {
      console.error('Error saving hackathon:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save hackathon. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
              onClick={() => {
                setHackathonTitle("");
                setHackathonDesc("");
                setHackathonLocation("");
                setHackathonLocationType("hybrid");
                setHackathonDate("");
                setHackathonDuration("");
                setHackathonUrl("");
                setShowAddForm(!showAddForm);
                // Remove ID from URL if opening a blank form
                if (!showAddForm) {
                  navigate("/hackathons");
                }
              }}
            >
              <Plus size={18} className="mr-1" /> Add Hackathon
            </Button>
          </header>
          
          {showAddForm && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6 animate-fade-in">
              <h2 className="text-lg font-semibold mb-4">
                {hackathonId ? "Edit Hackathon" : "Add Hackathon Details"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Hackathon Title*
                  </label>
                  <Input 
                    value={hackathonTitle}
                    onChange={(e) => setHackathonTitle(e.target.value)}
                    placeholder="Enter hackathon title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Hackathon Description*
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
                      Date (Optional)
                    </label>
                    <Input 
                      value={hackathonDate}
                      onChange={(e) => setHackathonDate(e.target.value)}
                      placeholder="e.g., Apr 25-27, 2025"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Duration (Optional)
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
                    Location (Optional)
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
                    Website URL (Optional)
                  </label>
                  <Input 
                    value={hackathonUrl}
                    onChange={(e) => setHackathonUrl(e.target.value)}
                    placeholder="e.g., https://hackathon-website.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Or upload event documentation (Optional)
                  </label>
                  <div className="rounded-lg border border-gray-200 p-4 text-center">
                    <Button variant="outline" size="sm">
                      <FileUp size={16} className="mr-1" /> Upload PDF
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setShowAddForm(false);
                    navigate("/hackathons");
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gradient-primary" 
                    onClick={handleAddHackathon}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : hackathonId ? "Update Hackathon" : "Add Hackathon"}
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
                    variant={filter === 'global' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('global')}
                  >
                    <Globe size={14} className="mr-1" /> Global
                  </Button>
                  <Button 
                    variant={filter === 'in-person' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('in-person')}
                  >
                    <Building size={14} className="mr-1" /> In-person
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
                    <MapPin size={14} className="mr-1" /> Hybrid
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Loading hackathons...</p>
                </div>
              ) : filteredHackathons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredHackathons.map(hackathon => (
                    <HackathonCard
                      key={hackathon.id}
                      title={hackathon.title}
                      description={hackathon.description}
                      date={hackathon.date}
                      location={hackathon.location}
                      duration={hackathon.duration}
                      locationType={hackathon.location_type}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        navigate(`/hackathons?id=${hackathon.id}`);
                      }}
                    />
                  ))}
                  
                  {/* Add hackathon card */}
                  <div 
                    className="border border-dashed border-gray-300 rounded-lg flex items-center justify-center flex-col p-6 h-full min-h-[200px] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setHackathonTitle("");
                      setHackathonDesc("");
                      setHackathonLocation("");
                      setHackathonLocationType("hybrid");
                      setHackathonDate("");
                      setHackathonDuration("");
                      setShowAddForm(true);
                      navigate("/hackathons");
                    }}
                  >
                    <PlusCircle size={40} className="text-gray-400 mb-2" />
                    <p className="text-gray-500 font-medium">Add New Hackathon</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-500 mb-4">No hackathons match your filter or you haven't added any hackathons yet.</p>
                  <Button 
                    onClick={() => {
                      setShowAddForm(true);
                      navigate("/hackathons");
                    }}
                    className="bg-gradient-primary"
                  >
                    <Plus size={16} className="mr-2" /> Add Your First Hackathon
                  </Button>
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
