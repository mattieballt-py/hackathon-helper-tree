
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
      <div key={node.id} className="flex-shrink-0">
        <Collapsible
          open={isExpanded}
          onOpenChange={() => toggleNode(node.id)}
          className="rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center p-2">
            <CollapsibleTrigger asChild>
              <button className="flex items-center text-left cursor-pointer py-1 px-2 rounded-md hover:bg-gray-100 w-full">
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
                  <span className="ml-2">
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
              <div className="pl-6">
                <div className="flex flex-row flex-wrap gap-4 mt-2">
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
        <div className="flex flex-row flex-wrap gap-4">
          {nodes.map((node) => renderNode(node))}
        </div>
      </div>
    </div>
  );
}
