import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { useAuthStore } from '@/stores/authStore';
import Layout from '@/components/Layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import LeadsList from '@/pages/Leads/LeadsList';
import LeadsPipeline from '@/pages/Leads/LeadsPipeline';
import LeadDetail from '@/pages/Leads/LeadDetail';
import QuotesList from '@/pages/Quotes/QuotesList';
import QuoteBuilder from '@/pages/Quotes/QuoteBuilder';
import JobsList from '@/pages/Jobs/JobsList';
import JobBuilder from '@/pages/Jobs/JobBuilder';
import SchedulingPage from '@/pages/Scheduling/SchedulingPage';
import InventoryPage from '@/pages/Inventory/InventoryPage';
import InvoicesPage from '@/pages/Invoices/InvoicesPage';
import ReportsPage from '@/pages/Reports/ReportsPage';
import ClientProfile from '@/pages/Clients/ClientProfile';
import SettingsPage from '@/pages/Settings/SettingsPage';
import ConversationsPage from '@/pages/Communication/Conversations';
import LiveMapPage from '@/pages/Scheduling/LiveMap';
import CompliancePage from '@/pages/Compliance/CompliancePage';
import ProfilePage from '@/pages/Profile/ProfilePage';
import RoleProtectedRoute from '@/components/auth/RoleProtectedRoute';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token, isLoading, tokenExpiresAt, refreshToken } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  
  // Check if token exists in localStorage (for initial load)
  React.useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken && !token) {
        // Token exists but not in store, refresh user data
        try {
          await useAuthStore.getState().refreshUser();
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setIsCheckingAuth(false);
    };
    
    checkAuth();
  }, [token]);

  // Proactive token refresh - refresh token before it expires
  React.useEffect(() => {
    if (!tokenExpiresAt || !isAuthenticated || !token) return;

    const timeUntilExpiry = tokenExpiresAt - Date.now();
    
    // Don't refresh if token is already expired (more than 1 minute ago)
    if (timeUntilExpiry < -60 * 1000) {
      return;
    }
    
    // Refresh token 5 minutes before expiration (or if less than 5 minutes remaining)
    const refreshThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (timeUntilExpiry <= refreshThreshold) {
      // Token is expiring soon, refresh it
      refreshToken().catch((error) => {
        // Silently fail - don't spam console with errors
        // The interceptor will handle 401 errors
        if (error.response?.status !== 401) {
          console.error('Proactive token refresh failed:', error);
        }
      });
    } else {
      // Schedule refresh for 5 minutes before expiration
      const timeUntilRefresh = timeUntilExpiry - refreshThreshold;
      
      // Don't schedule if it's more than 24 hours away (to avoid very long timers)
      if (timeUntilRefresh > 24 * 60 * 60 * 1000) {
        return;
      }
      
      const refreshTimer = setTimeout(() => {
        refreshToken().catch((error) => {
          // Silently fail - don't spam console with errors
          if (error.response?.status !== 401) {
            console.error('Proactive token refresh failed:', error);
          }
        });
      }, timeUntilRefresh);

      return () => clearTimeout(refreshTimer);
    }
  }, [tokenExpiresAt, isAuthenticated, refreshToken, token]);
  
  // Show loading state while checking authentication
  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuthStore();
  
  // Only redirect if we have both token and authenticated state
  // This prevents redirect when user has just logged out
  if (isAuthenticated && token) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      {/* Phase 2 - Leads & CRM */}
                      <Route path="/leads" element={<RoleProtectedRoute permission="crm.view"><LeadsList /></RoleProtectedRoute>} />
                      <Route path="/clients/:id" element={<RoleProtectedRoute permission="crm.view"><ClientProfile /></RoleProtectedRoute>} />
                      <Route path="/leads/pipeline" element={<RoleProtectedRoute permission="crm.view"><LeadsPipeline /></RoleProtectedRoute>} />
                      <Route path="/leads/:id" element={<RoleProtectedRoute permission="crm.view"><LeadDetail /></RoleProtectedRoute>} />
                      {/* Phase 3 - Quotes & Estimates */}
                      <Route path="/quotes" element={<RoleProtectedRoute permission="quotes.view"><QuotesList /></RoleProtectedRoute>} />
                      <Route path="/quotes/new" element={<RoleProtectedRoute permission="quotes.create"><QuoteBuilder /></RoleProtectedRoute>} />
                      <Route path="/quotes/:id/edit" element={<RoleProtectedRoute permission="quotes.update"><QuoteBuilder /></RoleProtectedRoute>} />
                      {/* Phase 4 - Job Management */}
                      <Route path="/jobs" element={<RoleProtectedRoute permission="jobs.view"><JobsList /></RoleProtectedRoute>} />
                      <Route path="/jobs/new" element={<RoleProtectedRoute permission="jobs.create"><JobBuilder /></RoleProtectedRoute>} />
                      <Route path="/jobs/:id/edit" element={<RoleProtectedRoute permission="jobs.update"><JobBuilder /></RoleProtectedRoute>} />
                      {/* Phase 5 - Scheduling & Calendar */}
                      <Route path="/scheduling" element={<RoleProtectedRoute permission="scheduling.view"><SchedulingPage /></RoleProtectedRoute>} />
                      <Route path="/scheduling/live" element={<RoleProtectedRoute permission="scheduling.view"><LiveMapPage /></RoleProtectedRoute>} />
                      {/* Phase 6 - Inventory Management */}
                      <Route path="/inventory" element={<RoleProtectedRoute permission="inventory.view"><InventoryPage /></RoleProtectedRoute>} />
                      {/* Phase 7 - Invoices & Billing */}
                      <Route path="/invoices" element={<RoleProtectedRoute permission="invoices.view"><InvoicesPage /></RoleProtectedRoute>} />
                      {/* Phase 8 - Reports & Analytics */}
                      <Route path="/reports" element={<RoleProtectedRoute permission="reports.view"><ReportsPage /></RoleProtectedRoute>} />
                      {/* Phase 9 - Settings & Configuration */}
                      <Route path="/settings" element={<RoleProtectedRoute permission="settings.view"><SettingsPage /></RoleProtectedRoute>} />
                      {/* Compliance & Documents */}
                      <Route path="/compliance" element={<RoleProtectedRoute permission="compliance.view"><CompliancePage /></RoleProtectedRoute>} />
                      {/* Communication Hub */}
                      <Route path="/communication" element={<RoleProtectedRoute permission="communication.view"><ConversationsPage /></RoleProtectedRoute>} />
                      {/* Profile */}
                      <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        
        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
