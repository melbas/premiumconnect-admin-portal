
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { useOfflineMode } from "./hooks/useOfflineMode";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Portal from "./pages/Portal";
import NotFound from "./pages/NotFound";
import SuperAdminDashboard from "./components/SuperAdmin/SuperAdminDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
      retry: (failureCount, error: any) => {
        // Ne pas retry si hors-ligne
        if (!navigator.onLine) return false;
        return failureCount < 3;
      },
    },
  },
});

const AppContent = () => {
  useOfflineMode(); // Hook pour gérer le mode hors-ligne

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/:tab" element={<SuperAdminDashboard />} />
        <Route path="/marketing" element={<SuperAdminDashboard initialTab="marketing" />} />
        <Route path="/technical" element={<SuperAdminDashboard initialTab="technical" />} />
        <Route path="/vouchers" element={<SuperAdminDashboard initialTab="vouchers" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
