import { useEffect } from 'react';
import { AppRoutes } from './routes';
import { useAdminProfile } from '@/features/auth/hooks/use-auth';
import { useAuthStore } from '@/features/auth/store/auth-store';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { refetch } = useAdminProfile();

  // Check session on mount
  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  return <AppRoutes />;
}

export default App;
