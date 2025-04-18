import { Sidebar } from "@/components/Sidebar";
import { ChatBuddy } from "@/components/ChatBuddy";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SkillTreeNew } from "@/components/SkillTreeNew";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const roleNodes = [
    {
      id: "frontend",
      title: "Frontend Development",
      description: "Create user interfaces and experiences",
      children: [
        {
          id: "frontend-ui",
          title: "UI Development",
          description: "Building user interfaces with HTML, CSS, and JavaScript",
          resources: ["HTML/CSS Foundations", "Responsive Design", "UI Component Libraries"],
          children: [
            {
              id: "frontend-frameworks",
              title: "Frameworks",
              description: "Popular frontend frameworks and libraries",
              resources: ["React", "Vue", "Angular", "Svelte"],
            },
            {
              id: "frontend-css",
              title: "CSS & Design",
              description: "Advanced styling and design systems",
              resources: ["CSS-in-JS", "Tailwind CSS", "Design Systems"],
            }
          ]
        },
        {
          id: "frontend-ux",
          title: "UX & Interaction",
          description: "Creating engaging and intuitive user experiences",
          resources: ["UX Principles", "Accessibility", "Animation & Transitions"],
        }
      ]
    },
    {
      id: "backend",
      title: "Backend Development",
      description: "Build server-side applications and APIs",
      children: [
        {
          id: "backend-api",
          title: "API Development",
          description: "Creating RESTful and GraphQL APIs",
          resources: ["REST API Design", "GraphQL Basics", "API Authentication"],
        },
        {
          id: "backend-db",
          title: "Databases",
          description: "Storing and querying data effectively",
          resources: ["SQL Fundamentals", "NoSQL Options", "Database Design"],
          children: [
            {
              id: "backend-sql",
              title: "SQL Databases",
              description: "Using relational databases",
              resources: ["PostgreSQL", "MySQL", "Database Optimization"],
            },
            {
              id: "backend-nosql",
              title: "NoSQL Databases",
              description: "Using document and graph databases",
              resources: ["MongoDB", "Firebase", "Redis"],
            }
          ]
        }
      ]
    },
    {
      id: "design",
      title: "Design & UX",
      description: "Create beautiful and usable interfaces",
      children: [
        {
          id: "design-ui",
          title: "UI Design",
          description: "Creating visually appealing interfaces",
          resources: ["Color Theory", "Typography", "Visual Hierarchy"],
        },
        {
          id: "design-ux",
          title: "UX Design",
          description: "Designing user-friendly experiences",
          resources: ["User Research", "Wireframing", "Usability Testing"],
        }
      ]
    },
    {
      id: "product",
      title: "Project Management",
      description: "Lead the project and team",
      children: [
        {
          id: "product-planning",
          title: "Project Planning",
          description: "Setting goals and planning project scope",
          resources: ["Agile Methodology", "Sprint Planning", "User Stories"],
        },
        {
          id: "product-presentation",
          title: "Presentation",
          description: "Pitching your project effectively",
          resources: ["Pitch Deck Templates", "Demo Preparation", "Storytelling"],
        }
      ]
    }
  ];
  
  const taskNodes = [
    {
      id: "planning",
      title: "Planning Phase",
      description: "Initial project planning and team formation",
      children: [
        {
          id: "team-formation",
          title: "Form Your Team",
          description: "Find team members with complementary skills",
          resources: ["Team Building Guide", "Finding Teammates", "Skill Assessment"],
        },
        {
          id: "idea-generation",
          title: "Generate Ideas",
          description: "Brainstorm project ideas and validate them",
          resources: ["Brainstorming Techniques", "Idea Validation", "Market Research"],
          children: [
            {
              id: "validate-idea",
              title: "Validate Your Idea",
              description: "Make sure your idea is feasible for a hackathon",
              resources: ["Feasibility Analysis", "MVP Definition", "Technical Limitations"],
            }
          ]
        },
        {
          id: "define-mvp",
          title: "Define MVP",
          description: "Determine your minimum viable product",
          resources: ["Feature Prioritization", "Scope Definition", "MVP Template"],
        }
      ]
    },
    {
      id: "execution",
      title: "Execution Phase",
      description: "Building your hackathon project",
      children: [
        {
          id: "setup-environment",
          title: "Setup Development Environment",
          description: "Prepare your tools and development environment",
          resources: ["Git Setup", "Development Tools", "Collaboration Tools"],
        },
        {
          id: "design-prototype",
          title: "Design & Prototype",
          description: "Create wireframes and initial designs",
          resources: ["Wireframing Tools", "UI Design Basics", "Prototyping"],
        },
        {
          id: "develop-mvp",
          title: "Develop MVP",
          description: "Build the core functionality of your project",
          resources: ["Development Best Practices", "Testing", "Version Control"],
          children: [
            {
              id: "frontend-implementation",
              title: "Frontend Implementation",
              description: "Build the user interface",
              resources: ["React/Vue/Angular Guides", "Responsive Design", "UI Libraries"],
            },
            {
              id: "backend-implementation",
              title: "Backend Implementation",
              description: "Build the server and API",
              resources: ["Server Setup", "API Design", "Database Integration"],
            }
          ]
        }
      ]
    },
    {
      id: "presentation",
      title: "Presentation Phase",
      description: "Preparing to showcase your project",
      children: [
        {
          id: "create-demo",
          title: "Create Demo",
          description: "Prepare a working demo of your project",
          resources: ["Demo Script", "Error Handling", "Backup Plans"],
        },
        {
          id: "prepare-pitch",
          title: "Prepare Pitch",
          description: "Create your presentation materials",
          resources: ["Pitch Deck Templates", "Storytelling", "Presentation Tips"],
        },
        {
          id: "practice",
          title: "Practice Presentation",
          description: "Rehearse your presentation as a team",
          resources: ["Time Management", "Q&A Preparation", "Feedback Collection"],
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 pl-16 md:pl-64 pt-6">
        <main className="container px-4 pb-16">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome to <span className="gradient-text">HackHelper</span>
            </h1>
            <p className="text-gray-600 mt-1">Your personal guide to hackathon success</p>
          </header>

          {user ? (
            <div className="space-y-6">
              <SkillTreeNew 
                title="What can my role be?" 
                subtitle="Select the skills you're most comfortable with to get guidance on your role"
                nodes={roleNodes}
              />
              
              <SkillTreeNew 
                title="What to do right now?" 
                subtitle="Select what you've done already"
                nodes={taskNodes}
              />
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Get Started with HackHelper</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Sign in to track your hackathons, develop your skills, and get personalized AI assistance for your projects.
              </p>
              <Button 
                className="bg-gradient-primary"
                size="lg"
                onClick={() => navigate('/auth')}
              >
                Sign In to Continue
              </Button>
            </div>
          )}
        </main>
      </div>
      
      <ChatBuddy />
    </div>
  );
};

export default Index;
