
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Check } from "lucide-react";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";

interface Node {
  id: string;
  title: string;
  description: string;
  resources?: string[];
  children?: Node[];
}

interface SkillTreeProps {
  nodes: Node[];
  title: string;
  subtitle: string;
}

export function SkillTreeNew({ nodes, title, subtitle }: SkillTreeProps) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  
  const toggleNode = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) 
        ? prev.filter(nodeId => nodeId !== id)
        : [...prev, id]
    );
  };

  const toggleComplete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering parent click handlers
    setCompleted(prev => 
      prev.includes(id) 
        ? prev.filter(nodeId => nodeId !== id)
        : [...prev, id]
    );
  };

  const renderNode = (node: Node, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.includes(node.id);
    const isCompleted = completed.includes(node.id);
    
    return (
      <div key={node.id} className="flex-shrink-0 min-w-[200px] max-w-[300px] relative">
        <Collapsible
          open={isExpanded}
          onOpenChange={() => toggleNode(node.id)}
          className={cn(
            "rounded-lg hover:bg-gray-50 transition-colors",
            isCompleted && "bg-gray-50"
          )}
        >
          <div className="flex items-center p-2">
            <CollapsibleTrigger asChild className="flex-1">
              <button 
                className={cn(
                  "flex items-center text-left cursor-pointer py-1 px-2 rounded-md hover:bg-gray-100 w-full",
                  isCompleted && "line-through opacity-70"
                )}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm">{node.title}</span>
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
                  <span className="ml-2">
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-gray-500" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-500" />
                    )}
                  </span>
                )}

                <div 
                  onClick={(e) => toggleComplete(node.id, e)} 
                  className={cn(
                    "ml-auto h-5 w-5 rounded-full border-2 flex items-center justify-center",
                    isCompleted ? "bg-gradient-primary border-transparent" : "bg-white"
                  )}
                >
                  {isCompleted ? <Check size={10} /> : null}
                </div>
              </button>
            </CollapsibleTrigger>
          </div>
          
          {hasChildren && (
            <CollapsibleContent>
              <div className="pl-6">
                <div className="flex flex-row flex-wrap gap-4 mt-2 mb-2 overflow-x-auto">
                  {node.children?.map((child) => renderNode(child, level + 1))}
                </div>
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="mb-4 pb-2 border-b">
        <h2 className="text-xl font-semibold gradient-text">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      <div className="space-y-2">
        <div className="flex flex-row flex-wrap gap-4 overflow-x-auto">
          {nodes.map((node) => renderNode(node))}
        </div>
      </div>
    </div>
  );
}
