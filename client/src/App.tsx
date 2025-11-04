import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import Dashboard from "@/pages/Dashboard";
import AuditDetail from "@/pages/AuditDetail";
import NewAudit from "@/pages/NewAudit";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";
import { ClipboardList, MessageCircle, LogOut, UserCircle, Shield, Home } from "lucide-react";
import { useEffect, type ReactNode } from "react";

// Protected Route Component
function ProtectedRoute({ component: Component }: { component: () => ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return <>{Component()}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/admin">
        {() => <ProtectedRoute component={AdminDashboard} />}
      </Route>
      <Route path="/audit/new">
        {() => <ProtectedRoute component={NewAudit} />}
      </Route>
      <Route path="/audit/:id">
        {() => <ProtectedRoute component={AuditDetail} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

// Header with auth info
function AppHeader() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation("/")}>
            <div className="rounded-full overflow-hidden shadow-lg ring-2 ring-amber-500/30 w-10 h-10 sm:w-12 sm:h-12">
              <img 
                src="/logo-aisg.jpg" 
                alt="AiSG" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">AiSG</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Audit Intelligence SG</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant={location === "/" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLocation("/")}
              className="gap-1.5"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            {user.role === "full_admin" && (
              <Button
                variant={location === "/admin" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLocation("/admin")}
                className="gap-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User info */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <UserCircle className="w-4 h-4 text-purple-400" />
            <div className="text-xs">
              <p className="font-medium text-white">{user.name}</p>
              <p className="text-purple-300">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 sm:gap-2 text-xs sm:text-sm border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300"
            onClick={() => window.open('https://chatgpt.com/g/g-68f60e2ded048191816ee3e67eea952f-aisg-audit-intelligence-system-growth', '_blank')}
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">ChatGPT</span>
            <span className="sm:hidden">GPT</span>
          </Button>
          
          <ThemeToggle />
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <AppHeader />
            <div className="pt-[60px] sm:pt-[68px]">
              <Router />
            </div>
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
