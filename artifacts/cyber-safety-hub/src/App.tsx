import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/layout/AppLayout";
import CyberMatrixHero from "@/components/ui/cyber-matrix-hero";
import SplashScreen from "@/components/splash-screen/SplashScreen";
import { useSplash } from "@/components/splash-screen/useSplash";

// Pages
import Home from "@/pages/home";
import Learn from "@/pages/learn";
import Trainer from "@/pages/trainer";
import Report from "@/pages/report";
import Dashboard from "@/pages/dashboard";
import Signup from "@/pages/signup";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/learn" component={Learn} />
      <Route path="/trainer" component={Trainer} />
      <Route path="/report" component={Report} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/signup" component={Signup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { showSplash, handleSplashComplete } = useSplash();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="cyber-safety-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {showSplash && <SplashScreen duration={1500} onComplete={handleSplashComplete} />}
          <CyberMatrixHero />
          <AppLayout>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </AppLayout>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
