
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
  
  const toggleNode = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) 
        ? prev.filter(nodeId => nodeId !== id)
        : [...prev, id]
    );
  };

  const renderNode = (node: Node, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.includes(node.id);
    
    return (
      <div key={node.id} 
        className={cn(
          "relative",
          level > 0 && "mt-2"
        )}
      >
        <Collapsible
          open={isExpanded}
          onOpenChange={() => toggleNode(node.id)}
        >
          <div className="flex items-center">
            <CollapsibleTrigger asChild>
              <button 
                className={cn(
                  "flex items-center text-left py-2 px-4 rounded-lg transition-all",
                  "bg-gray-100 hover:bg-gray-200",
                  "border border-gray-200",
                  "min-w-[200px]"
                )}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm font-medium">{node.title}</span>
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
                  <span className="ml-auto">
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-gray-500" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-500" />
                    )}
                  </span>
                )}
              </button>
            </CollapsibleTrigger>
          </div>
          
          {hasChildren && (
            <CollapsibleContent>
              <div className="relative pl-8 mt-2">
                {/* Render connector lines */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                <div className="space-y-4">
                  {node.children?.map((child) => (
                    <div key={child.id} className="relative">
                      {/* Horizontal connector line */}
                      <div className="absolute left-[-16px] top-1/2 w-4 h-px bg-gray-200" />
                      {renderNode(child, level + 1)}
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold gradient-text">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      <div className="space-y-6 overflow-x-auto">
        {nodes.map((node) => renderNode(node))}
      </div>
    </div>
  );
}
