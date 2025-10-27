import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { useAuthStore } from '@/stores/authStore';
import Layout from '@/components/Layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import LeadsList from '@/pages/Leads/LeadsList';
import LeadDetail from '@/pages/Leads/LeadDetail';
import QuotesList from '@/pages/Quotes/QuotesList';
import QuoteBuilder from '@/pages/Quotes/QuoteBuilder';
import JobsList from '@/pages/Jobs/JobsList';
import SchedulingPage from '@/pages/Scheduling/SchedulingPage';
import InventoryPage from '@/pages/Inventory/InventoryPage';
import InvoicesPage from '@/pages/Invoices/InvoicesPage';
import ReportsPage from '@/pages/Reports/ReportsPage';
import SettingsPage from '@/pages/Settings/SettingsPage';
import ConversationsPage from '@/pages/Communication/Conversations';
import LiveMapPage from '@/pages/Scheduling/LiveMap';
import CompliancePage from '@/pages/Compliance/CompliancePage';
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
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
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
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      {/* Phase 2 - Leads & CRM */}
                      <Route path="/leads" element={<LeadsList />} />
                      <Route path="/leads/:id" element={<LeadDetail />} />
                      {/* Phase 3 - Quotes & Estimates */}
                      <Route path="/quotes" element={<QuotesList />} />
                      <Route path="/quotes/new" element={<QuoteBuilder />} />
                      <Route path="/quotes/:id/edit" element={<QuoteBuilder />} />
                      {/* Phase 4 - Job Management */}
                      <Route path="/jobs" element={<JobsList />} />
                      {/* Phase 5 - Scheduling & Calendar */}
                      <Route path="/scheduling" element={<SchedulingPage />} />
                      <Route path="/scheduling/live" element={<LiveMapPage />} />
                      {/* Phase 6 - Inventory Management */}
                      <Route path="/inventory" element={<InventoryPage />} />
                      {/* Phase 7 - Invoices & Billing */}
                      <Route path="/invoices" element={<InvoicesPage />} />
                      {/* Phase 8 - Reports & Analytics */}
                      <Route path="/reports" element={<ReportsPage />} />
                        {/* Phase 9 - Settings & Configuration */}
                        <Route path="/settings" element={<SettingsPage />} />
                      {/* Compliance & Documents */}
                      <Route path="/compliance" element={<CompliancePage />} />
                      {/* Communication Hub */}
                      <Route path="/communication" element={<ConversationsPage />} />
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
