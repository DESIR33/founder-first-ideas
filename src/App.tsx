import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { DecisionModeProvider } from "@/hooks/useDecisionMode";
import { AIStateProvider } from "@/hooks/useAIState";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SavedIdeas from "./pages/SavedIdeas";
import IdeaDetail from "./pages/IdeaDetail";
import Analytics from "./pages/Analytics";
import CompareIdeas from "./pages/CompareIdeas";
import IdeaEngine from "./pages/IdeaEngine";
import Blueprints from "./pages/Blueprints";
import FounderTools from "./pages/FounderTools";
import LabExperiments from "./pages/LabExperiments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DecisionModeProvider>
        <AIStateProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/saved" element={<SavedIdeas />} />
                <Route path="/idea/:id" element={<IdeaDetail />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/compare" element={<CompareIdeas />} />
                <Route path="/idea-engine" element={<IdeaEngine />} />
                <Route path="/blueprints" element={<Blueprints />} />
                <Route path="/tools" element={<FounderTools />} />
                <Route path="/lab" element={<LabExperiments />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AIStateProvider>
      </DecisionModeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
