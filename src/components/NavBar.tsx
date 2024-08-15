import { Button } from 'antd';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthContext } from '../contexts/auth/authContext';

function NavBar() {
  const { state, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('NavBar state:', state); // Log state changes
  }, [state]);

  return (
    <nav style={{ width: '100%', border: '1px solid blue' }}>
      <ul
        style={{
          display: 'flex',
          listStyle: 'none',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '1em 0.5em',
        }}
      >
        {state.isAuthenticated && !state.isLoading ? (
          <>
            <li>Welcome, {state.user?.name}!</li>
            <li>
              <Button type="primary" danger onClick={logout}>
                Logout
              </Button>
            </li>
          </>
        ) : (
          <>
            <li>Welcome, stranger!</li>
            <li>
              {location.pathname === '/login' ? (
                <Button type="primary" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              ) : (
                <Button type="primary" onClick={() => navigate('/login')}>
                  Login
                </Button>
              )}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
