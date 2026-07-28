import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { RecommendationHistoryPage } from './pages/RecommendationHistoryPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SavedReportsPage } from './pages/SavedReportsPage';
import { AIChatDrawer } from './components/AIChatDrawer';
import { CursorTrail } from './components/CursorTrail';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <Router>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/history" element={<RecommendationHistoryPage />} />
            <Route path="/reports" element={<SavedReportsPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        {/* Global Floating Contextual AI Assistant */}
        <AIChatDrawer />

        {/* Global Premium Cursor Trail */}
        <CursorTrail />
      </Router>
      </WishlistProvider>
    </AuthProvider>
  );
};

export default App;
