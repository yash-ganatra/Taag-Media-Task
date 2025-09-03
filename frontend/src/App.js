import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import BrandBrief from './pages/BrandBrief/BrandBrief';
import MatchConsole from './pages/MatchConsole/MatchConsole';
import Billing from './pages/Billing/Billing';
import BillingRecords from './pages/BillingRecords/BillingRecords';
import Summary from './pages/Summary/Summary';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/brand-brief" element={<BrandBrief />} />
                    <Route path="/match-console" element={<MatchConsole />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/billing-records" element={<BillingRecords />} />
                    <Route path="/summary" element={<Summary />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
