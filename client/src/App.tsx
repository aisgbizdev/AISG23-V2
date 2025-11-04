import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import Dashboard from "@/pages/Dashboard";
import AuditDetail from "@/pages/AuditDetail";
import NewAudit from "@/pages/NewAudit";
import NotFound from "@/pages/not-found";
import { ClipboardList, MessageCircle } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/audit/new" component={NewAudit} />
      <Route path="/audit/:id" component={AuditDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 p-2 shadow-lg">
                  <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">AiSG</h1>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Audit Intelligence SG</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
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
              </div>
            </div>
          </header>
          <div className="pt-[60px] sm:pt-[68px]">
            <Router />
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
