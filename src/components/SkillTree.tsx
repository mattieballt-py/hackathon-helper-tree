
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Circle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Node {
  id: string;
  title: string;
  description: string;
  resources?: string[];
  children?: Node[];
}

export function SkillTree() {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
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
          resources: ["Team building guide", "Finding teammates worksheet", "Team communication templates"]
        },
        {
          id: "scope",
          title: "Define Scope",
          description: "What will you build?",
          resources: ["Project scoping worksheet", "MVP definition guide", "Feature prioritization template"]
        },
        {
          id: "plan",
          title: "Create a Plan",
          description: "Outline your approach",
          resources: ["Project timeline template", "Task distribution guide", "Hackathon planning checklist"]
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
              description: "Create wireframes and mockups",
              resources: ["Figma basics", "UI design principles", "Color theory guide"]
            },
            {
              id: "frontend-code",
              title: "Code UI",
              description: "Implement designs with HTML, CSS & JS",
              resources: ["React fundamentals", "CSS flexbox cheatsheet", "JavaScript for beginners"]
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
              description: "Define data endpoints",
              resources: ["REST API basics", "API design best practices", "Express.js tutorial"]
            },
            {
              id: "backend-db",
              title: "Setup Database",
              description: "Design and implement data storage",
              resources: ["Database schemas explained", "SQL vs NoSQL guide", "Data modeling techniques"]
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
              description: "Define what needs to be built",
              resources: ["User story templates", "Requirements gathering", "Prioritization techniques"]
            },
            {
              id: "product-present",
              title: "Presentation",
              description: "Prepare the pitch",
              resources: ["Pitch deck templates", "Demo day preparation", "Storytelling techniques"]
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
  
  const selectNode = (id: string) => {
    setSelected(prev => 
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
    const isSelected = selected.includes(node.id);
    const isCompleted = completed.includes(node.id);
    
    return (
      <div key={node.id} className={cn(
        "relative flex flex-col items-center",
        level > 0 && "tree-branch"
      )}>
        <div className="flex items-center justify-center mb-1">
          <RadioGroup className="flex flex-row items-center gap-1">
            <div className="flex items-center">
              <RadioGroupItem 
                value={node.id} 
                id={node.id}
                checked={isSelected}
                onClick={() => selectNode(node.id)} 
                className={cn(
                  "h-4 w-4",
                  isSelected ? "bg-gradient-primary border-transparent" : "bg-white"
                )}
              />
            </div>
          </RadioGroup>
          
          <div className="mx-2">
            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className={cn(
                      "font-medium text-gray-900", 
                      isCompleted && "line-through opacity-70"
                    )}>
                      {node.title}
                    </h3>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{node.description}</p>
                    {node.resources && (
                      <div className="mt-2">
                        <p className="font-medium">Resources:</p>
                        <ul className="list-disc list-inside text-sm">
                          {node.resources.map((resource, i) => (
                            <li key={i}>{resource}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-1"
                  onClick={() => toggleNode(node.id)}
                >
                  <ChevronDown
                    size={16} 
                    className={cn(
                      "transition-transform", 
                      isExpanded ? "rotate-180" : ""
                    )} 
                  />
                </Button>
              )}
              
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-5 w-5 rounded-full ml-1 border-2",
                  isCompleted ? "bg-gradient-primary border-transparent" : "bg-white"
                )}
                onClick={() => toggleComplete(node.id)}
              >
                {isCompleted ? <Check size={10} /> : <Circle size={10} />}
              </Button>
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="flex flex-col items-center pt-2 border-l border-gray-200">
            <div className="pl-8 space-y-3">
              {node.children?.map((child, i) => 
                renderNode(child, level + 1, i === (node.children?.length || 0) - 1)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4 pb-2 border-b">
        <div>
          <h2 className="text-xl font-semibold gradient-text">Your Hackathon Journey</h2>
          <p className="text-sm text-gray-500">Select the skills you'd like to develop to see what you can achieve</p>
        </div>
      </div>

      <div className="flex flex-col items-center pt-4">
        <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mb-2">
          <span className="text-white text-2xl font-bold">JD</span>
        </div>
        <h3 className="text-lg font-medium mb-4">John Doe</h3>
        
        <div className="space-y-2 flex flex-col items-center">
          {initialNodes.map((node, i) => renderNode(node, 0, i === initialNodes.length - 1))}
        </div>
      </div>
    </div>
  );
}
