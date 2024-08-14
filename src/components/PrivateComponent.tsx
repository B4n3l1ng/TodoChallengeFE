import { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../contexts/auth/authContext';
import Loader from './Loader';

function PrivateComponent({ children }: { children: ReactNode }) {
  const { state } = useContext(AuthContext);

  if (state.isLoading) {
    return <Loader />;
  }

  if (state.isAuthenticated) {
    return { children };
  }

  return <Navigate to="/login" />;
}

export default PrivateComponent;
