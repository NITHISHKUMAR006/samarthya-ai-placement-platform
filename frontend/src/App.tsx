import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AssessmentCenter } from './pages/student/AssessmentCenter';
import { AssessmentRunner } from './pages/student/AssessmentRunner';
import { AssessmentResultView } from './pages/student/AssessmentResultView';
import { SkillGapPage } from './pages/student/SkillGapPage';
import { PracticeQuizzesPage } from './pages/student/PracticeQuizzesPage';
import { MockInterviewPage } from './pages/student/MockInterviewPage';
import { LearningLibraryPage } from './pages/student/LearningLibraryPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { HistoryPage } from './pages/student/HistoryPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentManagementPage } from './pages/admin/StudentManagementPage';
import { CompanyDrivesPage } from './pages/admin/CompanyDrivesPage';
import { AssessmentsManagePage } from './pages/admin/AssessmentsManagePage';
import { LearningMaterialsManagePage } from './pages/admin/LearningMaterialsManagePage';

// Super Admin
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role) && !user.is_super_admin) {
    return <Navigate to="/student" replace />;
  }

  return <>{children}</>;
};

// Layout Shell
const AppLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if current route is a public marketing/login page
  const isPublicPage = ['/', '/login', '/features', '/how-it-works'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {isPublicPage ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
          </Routes>
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <Routes>
              {/* Student Routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/assessments"
                element={
                  <ProtectedRoute>
                    <AssessmentCenter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/assessment/:assessmentId/attempt/:attemptId"
                element={
                  <ProtectedRoute>
                    <AssessmentRunner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/result/:attemptId"
                element={
                  <ProtectedRoute>
                    <AssessmentResultView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/history"
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/skill-gap"
                element={
                  <ProtectedRoute>
                    <SkillGapPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/quizzes"
                element={
                  <ProtectedRoute>
                    <PracticeQuizzesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/mock-interview"
                element={
                  <ProtectedRoute>
                    <MockInterviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/learning"
                element={
                  <ProtectedRoute>
                    <LearningLibraryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute>
                    <StudentProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Admin / Faculty Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['institution_admin', 'faculty', 'super_admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute allowedRoles={['institution_admin', 'faculty', 'super_admin']}>
                    <StudentManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/companies"
                element={
                  <ProtectedRoute allowedRoles={['institution_admin', 'faculty', 'super_admin']}>
                    <CompanyDrivesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/assessments"
                element={
                  <ProtectedRoute allowedRoles={['institution_admin', 'faculty', 'super_admin']}>
                    <AssessmentsManagePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/materials"
                element={
                  <ProtectedRoute allowedRoles={['institution_admin', 'faculty', 'super_admin']}>
                    <LearningMaterialsManagePage />
                  </ProtectedRoute>
                }
              />

              {/* Super Admin Routes */}
              <Route
                path="/super-admin"
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/super-admin/*"
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-blue-600 dark:text-blue-400">SAMARTHYA AI</span>
            <span>—</span>
            <span>Every College Is Different. Every Student Deserves a Personalized Path.</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/features" className="hover:text-slate-800 dark:hover:text-white">Features</Link>
            <Link to="/how-it-works" className="hover:text-slate-800 dark:hover:text-white">Workflow</Link>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
              Port: 8010 ⇄ 5190
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
