
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, FileText, Award, User, Menu, X, PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  className?: string;
}

// Define a type for hackathons in the sidebar
interface HackathonItem {
  id: string;
  title: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [userHackathons, setUserHackathons] = useState<HackathonItem[]>([]);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch hackathons from Supabase
  useEffect(() => {
    async function fetchHackathons() {
      if (user) {
        const { data, error } = await supabase
          .from('hackathons')
          .select('id, title')
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error fetching hackathons:', error);
          return;
        }
        
        if (data) {
          setUserHackathons(data);
        }
      }
    }
    
    fetchHackathons();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account."
    });
    navigate('/auth');
  };

  const handleAddHackathon = () => {
    navigate('/hackathons');
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "fixed top-0 left-0 z-20 h-full transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          "bg-white border-r border-gray-200 py-6 flex flex-col"
        )}
      >
        <div className="flex items-center px-4 mb-6">
          {!collapsed && (
            <h1 className="text-xl font-bold gradient-text">HackHelper</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("ml-auto", collapsed && "mx-auto")}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        </div>

        <nav className="space-y-1 px-2 flex-1">
          <NavItem collapsed={collapsed} icon={Home} label="Dashboard" to="/" />
          <NavItem collapsed={collapsed} icon={User} label="Profile" to="/profile" />
          <NavItem collapsed={collapsed} icon={Award} label="Hackathons" to="/hackathons" />
          <NavItem collapsed={collapsed} icon={FileText} label="Resources" to="/resources" />
          
          {!collapsed && user && userHackathons.length > 0 && (
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Your Hackathons
              </h3>
              <div className="mt-2 space-y-1">
                {userHackathons.map(hackathon => (
                  <Link
                    key={hackathon.id}
                    to={`/hackathons?id=${hackathon.id}`}
                    className="flex items-center py-2 px-3 text-sm rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <span className="truncate">{hackathon.title}</span>
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleAddHackathon}
                >
                  <PlusCircle size={16} className="mr-2" />
                  Add Hackathon
                </Button>
              </div>
            </div>
          )}
        </nav>

        <div className="px-4 py-4 border-t border-gray-200">
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                {!collapsed && (
                  <div className="ml-3">
                    <p className="text-sm font-medium truncate">
                      {user.email}
                    </p>
                    <Link to="/profile" className="text-xs text-gray-500 hover:text-gray-700">
                      View Profile
                    </Link>
                  </div>
                )}
              </div>
              {!collapsed && (
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Button 
                variant="default"
                size="sm"
                className="w-full bg-gradient-primary"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  collapsed: boolean;
  icon: React.ElementType;
  label: string;
  to: string;
}

function NavItem({ collapsed, icon: Icon, label, to }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors",
        location.pathname === to && "bg-gray-100 text-gray-900"
      )}
    >
      <Icon size={20} className={collapsed ? "mx-auto" : "mr-3"} />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
