import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/shared/components/protected-route';
import { AdminLayout } from '@/shared/layouts/admin-layout';
import { LoginPage } from '@/features/auth/pages/login-page';
import { ROUTES } from '@/config/constants';
import UsersPage from '@/features/users/pages/users-page';
import CompetitionsPage from '@/features/competitions/pages/competitions-page';
import CreateCompetitionPage from '@/features/competitions/pages/create-competition-page';
import CompetitionQuestionsPage from '@/features/competitions/pages/competition-questions-page';
import EnrollmentsPage from '@/features/enrollments/pages/enrollments-page';
import PaymentsPage from '@/features/payments/pages/payments-page';
import ResultsPage from '@/features/results/pages/results-page';
import ResultDetailPage from '@/features/results/pages/result-detail-page';
import LiveClassesPage from '@/features/live-classes/pages/live-classes-page';
import MockTestsPage from '@/features/mock-tests/pages/mock-tests-page';
import MockTestCreatePage from '@/features/mock-tests/pages/mock-test-create-page';
import MockTestEditPage from '@/features/mock-tests/pages/mock-test-edit-page';
import MockTestQuestionsPage from '@/features/mock-tests/pages/mock-test-questions-page';

// Simple placeholder component
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed md:min-h-min">
      <div className="text-center">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground">Coming soon...</p>
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path={ROUTES.HOME}
            element={<Navigate to={ROUTES.DASHBOARD} replace />}
          />
          <Route
            path={ROUTES.DASHBOARD}
            element={<PlaceholderPage title="Dashboard" />}
          />
          <Route path={ROUTES.USERS} element={<UsersPage />} />
          <Route path={ROUTES.COMPETITIONS} element={<CompetitionsPage />} />
          <Route path={ROUTES.COMPETITIONS_CREATE} element={<CreateCompetitionPage />} />
          <Route
            path={ROUTES.COMPETITIONS_QUESTIONS}
            element={<CompetitionQuestionsPage />}
          />
          <Route path={ROUTES.ENROLLMENTS} element={<EnrollmentsPage />} />
          <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
          <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
          <Route path={ROUTES.RESULTS_DETAIL} element={<ResultDetailPage />} />
          <Route path={ROUTES.MOCK_TESTS} element={<MockTestsPage />} />
          <Route path={ROUTES.MOCK_TESTS_CREATE} element={<MockTestCreatePage />} />
          <Route path={ROUTES.MOCK_TESTS_EDIT} element={<MockTestEditPage />} />
          <Route path={ROUTES.MOCK_TESTS_QUESTIONS} element={<MockTestQuestionsPage />} />
          <Route path={ROUTES.LIVE_CLASSES} element={<LiveClassesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
