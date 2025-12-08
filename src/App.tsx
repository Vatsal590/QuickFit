import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Plans from "./pages/Plans";
import InstantWorkout from "./pages/InstantWorkout";
import History from "./pages/History";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import DeleteAccount from "./pages/DeleteAccount";
import WeightTracker from "./pages/WeightTracker";
import DietPlan from "./pages/DietPlan";
import FoodTracker from "./pages/FoodTracker";
import FreeAccess from "./pages/FreeAccess";
import Blogs from "./pages/Blogs";
import Support from "./pages/Support";
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fitness-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};

// Public Route component (redirects to home if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fitness-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        } 
      />
      <Route 
        path="/auth" 
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } 
      />
      <Route 
        path="/privacy-policy" 
        element={<PrivacyPolicy />} 
      />
      <Route 
        path="/terms-of-service" 
        element={<TermsOfService />} 
      />
      <Route 
        path="/delete-account" 
        element={<DeleteAccount />} 
      />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/plans" 
        element={
          <ProtectedRoute>
            <Plans />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/instant-workout" 
        element={
          <ProtectedRoute>
            <InstantWorkout />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/history" 
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/about" 
        element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/weight-tracker" 
        element={
          <ProtectedRoute>
            <WeightTracker />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/food-tracker" 
        element={
          <ProtectedRoute>
            <FoodTracker />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/diet-plan" 
        element={
          <ProtectedRoute>
            <DietPlan />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/free-access" 
        element={
          <ProtectedRoute>
            <FreeAccess />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/blogs" 
        element={
          <ProtectedRoute>
            <Blogs />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/support" 
        element={
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
