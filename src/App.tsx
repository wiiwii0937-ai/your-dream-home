import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Advantages from "./pages/Advantages";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProjectProgress from "./pages/ProjectProgress";
import OnlineEstimate from "./pages/OnlineEstimate";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import ServiceVilla from "./pages/services/ServiceVilla";
import ServiceFarm from "./pages/services/ServiceFarm";
import ServiceCommercial from "./pages/services/ServiceCommercial";
import ServiceRenovation from "./pages/services/ServiceRenovation";
import Todos from "./pages/Todos";
import ImageUploadPage from "./pages/ImageUploadPage";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/advantages" element={<Advantages />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/progress" element={<ProjectProgress />} />
                <Route path="/estimate" element={<OnlineEstimate />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/villa" element={<ServiceVilla />} />
                <Route path="/services/farm" element={<ServiceFarm />} />
                <Route path="/services/commercial" element={<ServiceCommercial />} />
                <Route path="/services/renovation" element={<ServiceRenovation />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/todos" element={<Todos />} />
                <Route path="/upload-image" element={<ImageUploadPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
