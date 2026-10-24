import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/ScrollToTop';
import { LandingPage } from './pages/LandingPage';
import { TrackSelectionPage } from './pages/TrackSelectionPage';
import { ThemeDetailPage } from './pages/ThemeDetailPage';
import { ProblemSelectionPage } from './pages/ProblemSelectionPage';
import { LoginPage } from './pages/LoginPage';
import { SubmissionPage } from './pages/SubmissionPage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Routes>
          {/* 1) Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* 2) Authentication & Squad Verification */}
          <Route path="/login" element={<LoginPage />} />

          {/* 3) Track selection page */}
          <Route path="/tracks" element={<TrackSelectionPage />} />

          {/* 4) Problem statements & theme details */}
          <Route path="/theme/:themeSlug" element={<ThemeDetailPage />} />
          <Route path="/themes/:themeSlug" element={<ThemeDetailPage />} />
          <Route path="/problems" element={<ProblemSelectionPage />} />

          {/* 5) Submission chamber */}
          <Route path="/submit" element={<SubmissionPage />} />

          {/* 6) Admin console (unlinked; sign-in required) */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Fallback to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
