import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/ScrollToTop';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { TrackSelectionPage } from './pages/TrackSelectionPage';
import { ThemeDetailPage } from './pages/ThemeDetailPage';
import { ProblemSelectionPage } from './pages/ProblemSelectionPage';
import { SubmissionPage } from './pages/SubmissionPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* 1) Initial landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* 2) Classic login page */}
          <Route path="/login" element={<LoginPage />} />

          {/* 3) 3D Track selection page */}
          <Route path="/tracks" element={<TrackSelectionPage />} />

          {/* 4) Problem statements & theme details */}
          <Route path="/theme/:themeSlug" element={<ThemeDetailPage />} />
          <Route path="/themes/:themeSlug" element={<ThemeDetailPage />} />
          <Route path="/problems" element={<ProblemSelectionPage />} />

          {/* 5) Submission chamber */}
          <Route path="/submit" element={<SubmissionPage />} />

          {/* Fallback to initial landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
