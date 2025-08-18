


import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import { I18nProvider } from './contexts/I18nProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastProvider';

import AppShell from './components/layout/AppShell';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import LeadsPage from './features/acquisition/LeadsPage';
import JDParserPage from './features/enterprise/JDParserPage';
import StudentProfilePage from './features/learning/StudentProfilePage';
import StudentListPage from './features/learning/StudentListPage';
import TeamsPage from './features/learning/TeamsPage';
import JobsPage from './features/enterprise/JobsPage';
import JobMatchesPage from './features/enterprise/JobMatchesPage';
import OpsDashboardPage from './features/ops/OpsDashboardPage';
import SettingsPage from './features/ops/SettingsPage';
import StudentSettingsPage from './features/learning/StudentSettingsPage';
import MyTeamsPage from './features/learning/MyTeamsPage';
import TeamDetailPage from './features/learning/TeamDetailPage';
import MentorSettingsPage from './features/learning/MentorSettingsPage';
import EditLeadPage from './features/acquisition/EditLeadPage';
import EditStudentPage from './features/learning/EditStudentPage';
import EditTeamPage from './features/learning/EditTeamPage';
import EditTaskPage from './features/learning/EditTaskPage';
import ClaimLeadsPage from './features/acquisition/ClaimLeadsPage';
import AllJobsPage from './features/enterprise/AllJobsPage';
import EditProfilePage from './features/profile/EditProfilePage';
import CompaniesPage from './features/admin/CompaniesPage';
import AgentsPage from './features/admin/AgentsPage';
import StudentDirectoryPage from './features/enterprise/StudentDirectoryPage';


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}


function App(): React.ReactNode {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="synergy-crm-theme">
      <I18nProvider>
        <HashRouter>
          <AuthProvider>
            <ToastProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route 
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <Routes>
                          <Route path="/" element={<DashboardPage />} />
                          <Route path="/acquisition/leads" element={<LeadsPage />} />
                          <Route path="/acquisition/claim-leads" element={<ClaimLeadsPage />} />
                          <Route path="/acquisition/leads/:leadId/edit" element={<EditLeadPage />} />
                          <Route path="/learning/students" element={<StudentListPage />} />
                          <Route path="/learning/students/:studentId" element={<StudentProfilePage />} />
                          <Route path="/learning/students/:studentId/edit" element={<EditStudentPage />} />
                          <Route path="/learning/settings" element={<StudentSettingsPage />} />
                          <Route path="/learning/mentor-settings" element={<MentorSettingsPage />} />
                          <Route path="/learning/teams" element={<TeamsPage />} />
                          <Route path="/learning/my-teams" element={<MyTeamsPage />} />
                          <Route path="/learning/teams/:teamId" element={<TeamDetailPage />} />
                          <Route path="/learning/teams/:teamId/edit" element={<EditTeamPage />} />
                          <Route path="/learning/teams/:teamId/tasks/:taskId/edit" element={<EditTaskPage />} />
                          <Route path="/enterprise/jd-parser" element={<JDParserPage />} />
                          <Route path="/enterprise/jobs" element={<JobsPage />} />
                          <Route path="/enterprise/student-directory" element={<StudentDirectoryPage />} />
                          <Route path="/enterprise/all-jobs" element={<AllJobsPage />} />
                          <Route path="/enterprise/jobs/:jobId/matches" element={<JobMatchesPage />} />
                          <Route path="/ops/dashboard" element={<OpsDashboardPage />} />
                          <Route path="/ops/settings" element={<SettingsPage />} />
                          <Route path="/profile/settings" element={<EditProfilePage />} />
                          <Route path="/admin/companies" element={<CompaniesPage />} />
                          <Route path="/admin/agents" element={<AgentsPage />} />
                        </Routes>
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </ToastProvider>
          </AuthProvider>
        </HashRouter>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;