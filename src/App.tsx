
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SuperAdminDashboard from "./components/SuperAdmin/SuperAdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Protected route component with redirection to login
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Login redirect component
const LoginRedirect = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/super-admin";
  
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  
  return <Login />;
};

// Main App component
const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginRedirect />} />
        
        {/* Admin Dashboard Routes with Role Protection */}
        <Route 
          path="/super-admin" 
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Role-specific Routes */}
        <Route 
          path="/technical" 
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'technical']}>
              <SuperAdminDashboard initialTab="technical" />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/marketing" 
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'marketing']}>
              <SuperAdminDashboard initialTab="marketing" />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/vouchers" 
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'voucher_manager', 'technical']}>
              <SuperAdminDashboard initialTab="vouchers" />
            </ProtectedRoute>
          } 
        />

        {/* Captive Portal Routes */}
        <Route 
          path="/captive-portal" 
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'technical', 'marketing']}>
              <SuperAdminDashboard initialTab="captive-portal" />
            </ProtectedRoute>
          } 
        />

        {/* Analytics Route */}
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'marketing', 'technical']}>
              <SuperAdminDashboard initialTab="analytics" />
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
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
