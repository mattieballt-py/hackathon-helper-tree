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
          children: [
            {
              id: "html",
              title: "HTML",
              description: "Structure and semantics",
              children: [
                {
                  id: "html-basics",
                  title: "HTML Basics",
                  description: "Core HTML concepts",
                  children: Array.from({ length: 10 }, (_, i) => ({
                    id: `html-concept-${i + 1}`,
                    title: `HTML Concept ${i + 1}`,
                    description: `Deep dive into HTML concept ${i + 1}`,
                    children: Array.from({ length: 5 }, (_, j) => ({
                      id: `html-subtopic-${i}-${j}`,
                      title: `HTML Subtopic ${j + 1}`,
                      description: `Detailed exploration of HTML subtopic ${j + 1}`,
                    }))
                  }))
                }
              ]
            },
            {
              id: "css",
              title: "CSS",
              description: "Styling and layout",
              children: Array.from({ length: 10 }, (_, i) => ({
                id: `css-concept-${i}`,
                title: `CSS Concept ${i + 1}`,
                description: `Advanced CSS topic ${i + 1}`,
                children: Array.from({ length: 5 }, (_, j) => ({
                  id: `css-deep-${i}-${j}`,
                  title: `CSS Deep Dive ${j + 1}`,
                  description: `Mastering CSS concept ${j + 1}`,
                  children: Array.from({ length: 3 }, (_, k) => ({
                    id: `css-master-${i}-${j}-${k}`,
                    title: `CSS Mastery ${k + 1}`,
                    description: `Expert-level CSS techniques ${k + 1}`,
                  }))
                }))
              }))
            }
          ]
        },
        {
          id: "frontend-frameworks",
          title: "Frontend Frameworks",
          description: "Modern JavaScript frameworks",
          children: Array.from({ length: 5 }, (_, i) => ({
            id: `framework-${i}`,
            title: `Framework ${i + 1}`,
            description: `Learning path for framework ${i + 1}`,
            children: Array.from({ length: 8 }, (_, j) => ({
              id: `framework-concept-${i}-${j}`,
              title: `Framework Concept ${j + 1}`,
              description: `Core concept ${j + 1}`,
              children: Array.from({ length: 6 }, (_, k) => ({
                id: `framework-deep-${i}-${j}-${k}`,
                title: `Advanced Topic ${k + 1}`,
                description: `Advanced framework topic ${k + 1}`,
                children: Array.from({ length: 4 }, (_, l) => ({
                  id: `framework-master-${i}-${j}-${k}-${l}`,
                  title: `Expert Level ${l + 1}`,
                  description: `Expert-level framework knowledge ${l + 1}`
                }))
              }))
            }))
          }))
        }
      ]
    },
    {
      id: "backend",
      title: "Backend Development",
      description: "Build server-side applications and APIs",
      children: Array.from({ length: 8 }, (_, i) => ({
        id: `backend-path-${i}`,
        title: `Backend Path ${i + 1}`,
        description: `Backend development path ${i + 1}`,
        children: Array.from({ length: 6 }, (_, j) => ({
          id: `backend-concept-${i}-${j}`,
          title: `Backend Concept ${j + 1}`,
          description: `Core backend concept ${j + 1}`,
          children: Array.from({ length: 5 }, (_, k) => ({
            id: `backend-deep-${i}-${j}-${k}`,
            title: `Advanced Backend ${k + 1}`,
            description: `Advanced backend topic ${k + 1}`,
            children: Array.from({ length: 4 }, (_, l) => ({
              id: `backend-master-${i}-${j}-${k}-${l}`,
              title: `Backend Mastery ${l + 1}`,
              description: `Expert-level backend skill ${l + 1}`
            }))
          }))
        }))
      }))
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
