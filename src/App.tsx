
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SuperAdminDashboard from "./components/SuperAdmin/SuperAdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Main App component
const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Admin Dashboard Routes with Role Protection */}
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        
        {/* Role-specific Routes */}
        <Route 
          path="/technical" 
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'technical']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/marketing" 
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'marketing']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/vouchers" 
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'voucher_manager', 'technical']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Show unauthorized message */}
        <Route path="/unauthorized" element={
          <div className="flex h-screen items-center justify-center bg-background flex-col gap-4">
            <h1 className="text-2xl font-bold">Accès non autorisé</h1>
            <p className="text-muted-foreground">Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
            <a href="/" className="text-primary hover:underline">Retourner à l'accueil</a>
          </div>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

// Wrap with providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
