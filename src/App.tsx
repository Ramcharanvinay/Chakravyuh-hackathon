import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { LandingPage } from './pages/LandingPage';
import { TrackSelectionPage } from './pages/TrackSelectionPage';
import { ThemeDetailPage } from './pages/ThemeDetailPage';

// A static, read-only site: no accounts and no backend. Teams read the problem
// statements and pick one on their own; the organizers collect choices with a form.
export const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tracks" element={<TrackSelectionPage />} />
        <Route path="/theme/:themeSlug" element={<ThemeDetailPage />} />
        <Route path="/themes/:themeSlug" element={<ThemeDetailPage />} />

        {/* Links from the old portal still land somewhere useful */}
        <Route path="/problems" element={<Navigate to="/tracks" replace />} />
        <Route path="/submit" element={<Navigate to="/tracks" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
