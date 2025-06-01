
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

// Protected route component with improved debugging
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Debug logs
  console.log('🛡️ ProtectedRoute Debug:', {
    isAuthenticated,
    isLoading,
    user: user ? { name: user.name, role: user.role } : null,
    allowedRoles,
    currentPath: location.pathname
  });

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log('🛡️ User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    console.log('🛡️ User role not allowed:', {
      userRole: user.role,
      allowedRoles,
      path: location.pathname
    });
    return <Navigate to="/unauthorized" replace />;
  }
  
  console.log('🛡️ Access granted');
  return children;
};

// Login redirect component
const LoginRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/super-admin";
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  
  return <Login />;
};

// Improved unauthorized page component
const UnauthorizedPage = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="flex h-screen items-center justify-center bg-background flex-col gap-6">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-2">Accès non autorisé</h1>
        <p className="text-muted-foreground mb-6">
          Vous n'avez pas les droits nécessaires pour accéder à cette page.
        </p>
        
        {user && (
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <p className="text-sm">
              <strong>Utilisateur connecté :</strong> {user.name} ({user.role})
            </p>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <a 
            href="/" 
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Retourner à l'accueil
          </a>
          
          <button 
            onClick={logout}
            className="inline-flex items-center justify-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            Se déconnecter et se reconnecter
          </button>
        </div>
      </div>
    </div>
  );
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

        {/* Improved unauthorized page */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
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
