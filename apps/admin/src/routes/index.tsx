
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/shared/components/protected-route';
import { AuthenticatedLayout } from '@/shared/components/layout/authenticated-layout';
import { LoginPage } from '@/features/auth/pages/login-page';
import { ROUTES } from '@/config/constants';

import UsersPage from '@/features/users/pages/users-page';
import UsersDetailPage from '@/features/users/pages/users-detail-page';

import CompetitionsPage from '@/features/competitions/pages/competitions-page';
import CompetitionCreatePage from '@/features/competitions/pages/competition-create-page';
import CompetitionEditPage from '@/features/competitions/pages/competition-edit-page';
import CompetitionDetailPage from '@/features/competitions/pages/competition-detail-page';
import CompetitionQuestionsPage from '@/features/competitions/pages/competition-questions-page';

import EnrollmentsPage from '@/features/enrollments/pages/enrollments-page';
import PaymentsPage from '@/features/payments/pages/payments-page';
import ResultsPage from '@/features/results/pages/results-page';
import ResultDetailPage from '@/features/results/pages/result-detail-page';
import SubmissionsPage from '@/features/results/pages/submissions-page';

import ExamSessionsPage from '@/features/exam-sessions/pages/exam-sessions-page';
import RequestsPage from '@/features/requests/pages/requests-page';
import ReferralsPage from '@/features/referrals/pages/referrals-page';
import SettingsPage from '@/features/settings/pages/settings-page';

import LiveClassesPage from '@/features/live-classes/pages/live-classes-page';

import MockTestsPage from '@/features/mock-tests/pages/mock-tests-page';
import MockTestCreatePage from '@/features/mock-tests/pages/mock-test-create-page';
import MockTestDetailPage from '@/features/mock-tests/pages/mock-test-detail-page';
import MockTestEditPage from '@/features/mock-tests/pages/mock-test-edit-page';
import MockTestQuestionsPage from '@/features/mock-tests/pages/mock-test-questions-page';

import QuestionBanksPage from '@/features/question-banks/pages/question-banks-page';
import QuestionBanksQuestionsPage from '@/features/question-banks/pages/question-banks-questions-page';

import DashboardPage from '@/features/dashboard/pages/dashboard-page';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route
            path={ROUTES.HOME}
            element={<Navigate to={ROUTES.DASHBOARD} replace />}
          />
          <Route
            path={ROUTES.DASHBOARD}
            element={<DashboardPage />}
          />
          <Route path={ROUTES.USERS} element={<UsersPage />} />
          <Route path={ROUTES.USERS_DETAIL} element={<UsersDetailPage />} />

          <Route path={ROUTES.COMPETITIONS} element={<CompetitionsPage />} />
          <Route path={ROUTES.COMPETITIONS_CREATE} element={<CompetitionCreatePage />} />
          <Route path={ROUTES.COMPETITIONS_EDIT} element={<CompetitionEditPage />} />
          <Route path={ROUTES.COMPETITIONS_DETAIL} element={<CompetitionDetailPage />} />
          <Route
            path={ROUTES.COMPETITIONS_QUESTIONS}
            element={<CompetitionQuestionsPage />}
          />

          <Route path={ROUTES.QUESTION_BANKS} element={<QuestionBanksPage />} />
          <Route path={ROUTES.QUESTION_BANKS_QUESTIONS} element={<QuestionBanksQuestionsPage />} />

          <Route path={ROUTES.MOCK_TESTS} element={<MockTestsPage />} />
          <Route path={ROUTES.MOCK_TESTS_CREATE} element={<MockTestCreatePage />} />
          <Route path={ROUTES.MOCK_TESTS_DETAIL} element={<MockTestDetailPage />} />
          <Route path={ROUTES.MOCK_TESTS_EDIT} element={<MockTestEditPage />} />
          <Route path={ROUTES.MOCK_TESTS_QUESTIONS} element={<MockTestQuestionsPage />} />

          <Route path={ROUTES.ENROLLMENTS} element={<EnrollmentsPage />} />
          <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
          <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
          <Route path={ROUTES.RESULTS_DETAIL} element={<ResultDetailPage />} />
          <Route path={ROUTES.SUBMISSIONS} element={<SubmissionsPage />} />
          <Route path={ROUTES.EXAM_SESSIONS} element={<ExamSessionsPage />} />
          <Route path={ROUTES.REQUESTS} element={<RequestsPage />} />
          <Route path={ROUTES.REFERRALS} element={<ReferralsPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.LIVE_CLASSES} element={<LiveClassesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
