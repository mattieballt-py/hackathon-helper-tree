
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Node {
  id: string;
  title: string;
  description: string;
  children?: Node[];
}

export function SkillTree() {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  
  const initialNodes: Node[] = [
    {
      id: "basics",
      title: "Get Started",
      description: "Basic hackathon preparation",
      children: [
        {
          id: "team",
          title: "Join a Team",
          description: "Find your hackathon buddies",
        },
        {
          id: "scope",
          title: "Define Scope",
          description: "What will you build?",
        },
        {
          id: "plan",
          title: "Create a Plan",
          description: "Outline your approach",
        }
      ]
    },
    {
      id: "skills",
      title: "Choose Your Path",
      description: "Select your preferred skill area",
      children: [
        {
          id: "frontend",
          title: "Frontend Development",
          description: "Create user interfaces",
          children: [
            {
              id: "frontend-design",
              title: "Design UI",
              description: "Create wireframes and mockups"
            },
            {
              id: "frontend-code",
              title: "Code UI",
              description: "Implement designs with HTML, CSS & JS"
            }
          ]
        },
        {
          id: "backend",
          title: "Backend Development",
          description: "Build server and APIs",
          children: [
            {
              id: "backend-api",
              title: "Create API",
              description: "Define data endpoints"
            },
            {
              id: "backend-db",
              title: "Setup Database",
              description: "Design and implement data storage"
            }
          ]
        },
        {
          id: "product",
          title: "Product Management",
          description: "Lead and coordinate the project",
          children: [
            {
              id: "product-req",
              title: "Requirements",
              description: "Define what needs to be built"
            },
            {
              id: "product-present",
              title: "Presentation",
              description: "Prepare the pitch"
            }
          ]
        }
      ]
    }
  ];

  const toggleNode = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) 
        ? prev.filter(nodeId => nodeId !== id)
        : [...prev, id]
    );
  };
  
  const toggleComplete = (id: string) => {
    setCompleted(prev => 
      prev.includes(id) 
        ? prev.filter(nodeId => nodeId !== id)
        : [...prev, id]
    );
  };

  const renderNode = (node: Node, level: number = 0, isLast: boolean = true) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.includes(node.id);
    const isCompleted = completed.includes(node.id);
    
    return (
      <div key={node.id} className="relative">
        <div 
          className={cn(
            "flex items-start py-2",
            level > 0 && "tree-branch",
            level > 0 && isLast ? "tree-branch-last" : "tree-branch-mid"
          )}
        >
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-6 w-6 rounded-full mr-2 border-2",
              isCompleted ? "bg-gradient-primary border-transparent" : "bg-white"
            )}
            onClick={() => toggleComplete(node.id)}
          >
            {isCompleted ? <Check size={12} /> : <Circle size={12} />}
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-medium text-gray-900">{node.title}</h3>
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-1"
                  onClick={() => toggleNode(node.id)}
                >
                  <ChevronRight 
                    size={16} 
                    className={cn(
                      "transition-transform", 
                      isExpanded && "rotate-90"
                    )} 
                  />
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-500">{node.description}</p>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-6 pl-2">
            {node.children?.map((child, i) => 
              renderNode(child, level + 1, i === (node.children?.length || 0) - 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4 pb-2 border-b">
        <h2 className="text-xl font-semibold gradient-text">Your Hackathon Journey</h2>
      </div>
      <div className="space-y-1">
        {initialNodes.map((node, i) => renderNode(node, 0, i === initialNodes.length - 1))}
      </div>
    </div>
  );
}
