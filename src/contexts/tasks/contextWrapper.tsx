import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import AuthContextProvider from '../auth/authContext';
import TaskContextProvider from './taskContext';

function ContextWrapper({ children }: { children: ReactNode }) {
  const location = useLocation();

  // Define the routes where TaskContext should NOT be used
  const excludedRoutes = ['/login', '/signup', '/profile'];

  // Check if the current route is in the excluded routes
  const isExcludedRoute = excludedRoutes.includes(location.pathname);

  return (
    <AuthContextProvider>
      {isExcludedRoute ? (
        children // Only AuthContextProvider wraps these routes
      ) : (
        <TaskContextProvider>
          {children}{' '}
          {/* AuthContextProvider and TaskContextProvider wrap these routes */}
        </TaskContextProvider>
      )}
    </AuthContextProvider>
  );
}

export default ContextWrapper;
