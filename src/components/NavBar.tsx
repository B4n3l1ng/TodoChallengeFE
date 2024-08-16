import { Button } from 'antd';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthContext } from '../contexts/auth/authContext';

function NavBar() {
  const { state, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // necessary to check on current location to change buttons available

  return (
    <nav className="navbar">
      <ul className="list">
        {state.isAuthenticated && !state.isLoading ? (
          <>
            <li>Welcome, {state.user?.name}!</li>
            <div>
              <li>
                {location.pathname === '/profile' ? (
                  <Button type="default" className="profile-btn">
                    Back to tasks
                  </Button>
                ) : (
                  <Button
                    type="default"
                    className="profile-btn"
                    onClick={() => navigate('/profile')}
                  >
                    Edit Profile
                  </Button>
                )}
              </li>
              <li>
                <Button type="primary" danger onClick={logout}>
                  Logout
                </Button>
              </li>
            </div>
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
