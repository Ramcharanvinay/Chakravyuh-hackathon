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
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { isSupabaseConfigured } from './lib/supabase';

// The portal stores real registrations, so it never runs without its database.
const ConfigMissing: React.FC = () => (
  <div className="min-h-screen bg-[#08090C] text-[#F3F4F6] flex items-center justify-center px-4">
    <div className="max-w-lg rounded-3xl bg-[#12141C] border border-white/[0.1] p-8">
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500">Configuration required</div>
      <h1 className="mt-2 font-cinzel text-2xl font-black text-white">Registration service not connected</h1>
      <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
        This site needs its Supabase connection. Set <code className="font-mono text-zinc-200">VITE_SUPABASE_URL</code> and{' '}
        <code className="font-mono text-zinc-200">VITE_SUPABASE_PUBLISHABLE_KEY</code> in the environment and rebuild.
        Registration is disabled until then so no data is lost.
      </p>
    </div>
  </div>
);

export const App: React.FC = () => {
  if (!isSupabaseConfigured) return <ConfigMissing />;
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
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Fallback to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
