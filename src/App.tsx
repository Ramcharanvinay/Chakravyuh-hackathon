import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { TrackSelectionPage } from './pages/TrackSelectionPage';
import { ProblemSelectionPage } from './pages/ProblemSelectionPage';
import { SubmissionPage } from './pages/SubmissionPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/tracks" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/tracks" element={<TrackSelectionPage />} />
          <Route path="/problems" element={<ProblemSelectionPage />} />
          <Route path="/submit" element={<SubmissionPage />} />
          <Route path="*" element={<Navigate to="/tracks" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
