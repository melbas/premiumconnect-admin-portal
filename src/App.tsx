
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import Portal from "./pages/Portal";
import NotFound from "./pages/NotFound";
import SuperAdminDashboard from "./components/SuperAdmin/SuperAdminDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/portal" element={<Portal />} />
            <Route path="/super-admin" element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/super-admin/:tab" element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/marketing" element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin', 'marketing']}>
                <SuperAdminDashboard initialTab="marketing" />
              </ProtectedRoute>
            } />
            <Route path="/technical" element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin', 'technical']}>
                <SuperAdminDashboard initialTab="technical" />
              </ProtectedRoute>
            } />
            <Route path="/vouchers" element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin', 'voucher_manager']}>
                <SuperAdminDashboard initialTab="vouchers" />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
