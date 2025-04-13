
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, FileText, Award, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

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
        </nav>

        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-primary"></div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium">Guest User</p>
                <p className="text-xs text-gray-500">Setup Profile</p>
              </div>
            )}
          </div>
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
