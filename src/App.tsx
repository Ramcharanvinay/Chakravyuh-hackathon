import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/ScrollToTop';
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
          <Route path="/" element={<Navigate to="/tracks" replace />} />
          <Route path="/login" element={<Navigate to="/tracks" replace />} />
          <Route path="/tracks" element={<TrackSelectionPage />} />
          {/* Dedicated Individual Theme Pages */}
          <Route path="/theme/:themeSlug" element={<ThemeDetailPage />} />
          <Route path="/themes/:themeSlug" element={<ThemeDetailPage />} />
          {/* Problem selection fallback */}
          <Route path="/problems" element={<ProblemSelectionPage />} />
          {/* Submission Chamber */}
          <Route path="/submit" element={<SubmissionPage />} />
          <Route path="*" element={<Navigate to="/tracks" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
