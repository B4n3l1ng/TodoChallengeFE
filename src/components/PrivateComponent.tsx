import { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../contexts/auth/authContext';
import Loader from './Loader';

function PrivateComponent({ children }: { children: ReactNode }): JSX.Element {
  const { state } = useContext(AuthContext);

  // Returns a spinner is application is still loading, returns the children if the user is authenticated, redirecting to Login page if they aren't

  if (state.isLoading) {
    return <Loader />;
  }

  if (state.isAuthenticated) {
    return children as JSX.Element;
  }

  return <Navigate to="/login" />;
}

export default PrivateComponent;
