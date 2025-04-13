
import { Sidebar } from "@/components/Sidebar";
import { ChatBuddy } from "@/components/ChatBuddy";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Video, BookOpen, Code, Users, MessageSquare } from "lucide-react";

const ResourceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  items 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  items: string[];
}) => (
  <Card className="overflow-hidden">
    <div className="h-1 bg-gradient-primary" />
    <CardHeader className="pb-2">
      <div className="flex items-center mb-1">
        <Icon className="mr-2 h-5 w-5 text-gray-500" />
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i}>
            <a href="#" className="text-sm hover:text-babyblue flex py-1.5 px-2 hover:bg-gray-50 rounded-md">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const Resources = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 pl-16 md:pl-64 pt-6">
        <main className="container px-4 pb-16">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Resources</h1>
            <p className="text-gray-600 mt-1">Helpful guides and materials for your hackathon journey</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard 
              icon={BookOpen}
              title="Guides & Tutorials"
              description="Learn essential skills and concepts"
              items={[
                "Hackathon Survival Guide",
                "Pitching Your Project 101",
                "Rapid Prototyping Techniques",
                "Time Management for Hackathons",
                "View All Guides..."
              ]}
            />
            
            <ResourceCard 
              icon={Code}
              title="Code Templates"
              description="Start your project faster"
              items={[
                "Frontend Starter Kit",
                "API Boilerplate",
                "Database Schemas",
                "Authentication Examples",
                "View All Templates..."
              ]}
            />
            
            <ResourceCard 
              icon={Video}
              title="Video Tutorials"
              description="Visual guides and walkthroughs"
              items={[
                "Setting Up Your Dev Environment",
                "Building a Demo in 4 Hours",
                "Creating a Compelling Presentation",
                "Teamwork Best Practices",
                "View All Videos..."
              ]}
            />
            
            <ResourceCard 
              icon={FileText}
              title="Documentation"
              description="References and detailed guides"
              items={[
                "Common APIs Documentation",
                "Tool Comparison Charts",
                "Data Sources Directory",
                "Technical Requirements Checklist",
                "View All Documentation..."
              ]}
            />
            
            <ResourceCard 
              icon={Users}
              title="Community Resources"
              description="Connect with other hackers"
              items={[
                "Find Team Members Forum",
                "Mentor Directory",
                "Project Showcases",
                "Upcoming Virtual Meetups",
                "View All Community Resources..."
              ]}
            />
            
            <ResourceCard 
              icon={MessageSquare}
              title="FAQ & Help"
              description="Common questions and answers"
              items={[
                "First-Time Hackathon Tips",
                "Technical Troubleshooting",
                "Presentation Best Practices",
                "Post-Hackathon Next Steps",
                "View All FAQs..."
              ]}
            />
          </div>
        </main>
      </div>
      
      <ChatBuddy />
    </div>
  );
};

export default Resources;
