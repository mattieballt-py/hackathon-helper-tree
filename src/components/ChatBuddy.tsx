
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatBuddy() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "system"; content: string }[]>([
    { role: "system", content: "👋 Hi there! I'm your Hackathon Buddy. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages([...messages, { role: "user", content: input }]);
    
    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          role: "system", 
          content: "I'm here to help with your hackathon journey! What specific challenge are you facing right now?"
        }
      ]);
    }, 1000);
    
    setInput("");
  };

  return (
    <>
      <Button
        className="fixed right-6 bottom-6 h-14 w-14 rounded-full bg-gradient-primary shadow-lg z-10"
        onClick={() => setOpen(true)}
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </Button>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 h-[70vh] bg-white border-t border-gray-200 shadow-2xl transition-transform duration-300 rounded-t-2xl",
          open ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <MessageSquare size={16} className="text-white" />
            </div>
            <h3 className="ml-3 font-medium">Hackathon Buddy</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X size={20} />
          </Button>
        </div>

        <div className="flex flex-col h-[calc(70vh-120px)] p-4 overflow-y-auto">
          {messages.map((message, i) => (
            <div
              key={i}
              className={cn(
                "chat-bubble mb-3",
                message.role === "user"
                  ? "bg-gradient-primary text-primary-foreground ml-auto"
                  : "bg-gray-100 text-gray-800"
              )}
            >
              {message.content}
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex space-x-2">
            <Textarea
              placeholder="Ask anything about hackathons..."
              className="min-h-[60px] flex-1 resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button 
              className="h-[60px] w-[60px] bg-gradient-primary rounded-md" 
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <Send size={20} className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
