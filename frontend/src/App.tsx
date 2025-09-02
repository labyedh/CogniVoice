import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PartnersPage from './pages/PartnersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AnalysisPage from './pages/AnalysisPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import PartnersManagement from './pages/admin/PartnersManagement';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Routes>
              {/* Public routes with header/footer */}
              <Route path="/" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <HomePage />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/about" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <AboutPage />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/partners" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <PartnersPage />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/login" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <LoginPage />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/register" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <RegisterPage />
                  </main>
                  <Footer />
                </>
              } />
              
              {/* Protected user routes with dashboard layout */}
              <Route 
                path="/analysis" 
                element={
                  <ProtectedRoute>
                    <AnalysisPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/history" 
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AdminRoute>
                    <UsersManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/partners" 
                element={
                  <AdminRoute>
                    <PartnersManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/profile" 
                element={
                  <AdminRoute>
                    <ProfilePage />
                  </AdminRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
