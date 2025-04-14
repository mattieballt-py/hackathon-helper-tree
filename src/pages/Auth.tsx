
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [isProcessingEmailConfirmation, setIsProcessingEmailConfirmation] = useState(false);

  // Handle email confirmation links
  useEffect(() => {
    // Check if we have a hash with access_token (from email confirmation)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      setIsProcessingEmailConfirmation(true);
      
      // Process the confirmation
      const processConfirmation = async () => {
        try {
          // The supabase client will automatically handle the token
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            toast({
              title: "Confirmation failed",
              description: error.message,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Email confirmed!",
              description: "Your account has been verified successfully.",
            });
            navigate("/");
          }
        } catch (err) {
          console.error("Error processing confirmation:", err);
          toast({
            title: "Confirmation error",
            description: "There was a problem confirming your email. Please try signing in.",
            variant: "destructive",
          });
        } finally {
          setIsProcessingEmailConfirmation(false);
        }
      };
      
      processConfirmation();
      
      // Clean up the URL to remove the hash
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [navigate, toast]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    
    if (error) {
      // Special handling for email not confirmed error
      if (error.message.includes("Email not confirmed")) {
        toast({
          title: "Email not confirmed",
          description: "Please check your email for a confirmation link.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate("/");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);
    
    if (error) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSignUpSuccess(true);
      toast({
        title: "Account created!",
        description: "Please check your email for a confirmation link to complete your registration.",
      });
    }
  };

  // Show loading if processing email confirmation
  if (isProcessingEmailConfirmation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <Card className="w-full max-w-md text-center p-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-lg font-medium">Processing your email confirmation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            <span className="gradient-text">HackHelper</span>
          </CardTitle>
          <CardDescription className="text-center">
            Your personal guide to hackathon success
          </CardDescription>
        </CardHeader>
        <CardContent>
          {signUpSuccess ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="text-xl font-semibold">Account Created Successfully!</h3>
              <p className="text-gray-600">
                A confirmation link has been sent to your email address. Please check your inbox and click on the link to activate your account.
              </p>
              <Button 
                onClick={() => {
                  setSignUpSuccess(false);
                  setEmail("");
                  setPassword("");
                }}
                className="mt-4"
                variant="outline"
              >
                Return to Sign In
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500 text-center">
            By continuing, you agree to our terms of service and privacy policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
