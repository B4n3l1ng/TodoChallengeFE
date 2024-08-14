import { notification } from 'antd';
import { createContext, useEffect, useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

import { ContextProviderProps } from '../tasks/taskContextTypes';
import { AuthContextType, AuthState, reducer } from './authContextTypex';

const initialState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  error: null,
};

export const AuthContext = createContext<AuthContextType>({
  saveToken: () => {},
  state: initialState,
  logout: async () => {},
  registrationHandler: async () => {},
});

notification.config({
  placement: 'bottomLeft',
  bottom: 50,
  duration: 5,
});

function AuthContextProvider({ children }: ContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const saveToken = (tokenFromLogin: string) => {
    window.localStorage.setItem('token', tokenFromLogin);
    dispatch({ type: 'SET_AUTHENTICATED', payload: { auth: true } });
  };

  const verifyToken = async (tokenFromStorage: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
        headers: { Authorization: `Bearer ${tokenFromStorage}` },
      });
      if (response.status === 200) {
        const parsed = await response.json();
        dispatch({
          type: 'SET_AUTHENTICATED',
          payload: { auth: true, user: parsed.user },
        });
      } else {
        window.localStorage.removeItem('token');
        dispatch({ type: 'SET_ISLOADING', payload: false });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: 'SET_ISLOADING', payload: false });
      window.localStorage.removeItem('token');
    }
  };

  const registrationHandler = async (payload: {
    name?: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.status === 201) {
        navigate('/login');
      } else if (response.status === 400) {
        const { message } = await response.json();
        dispatch({ type: 'SET_ERROR', payload: message });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: 'SET_ERROR', payload: 'Internal Server Error.' });
    }
  };

  const logout = async () => {
    const token = window.localStorage.getItem('authToken');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        window.localStorage.removeItem('token');
        dispatch({ type: 'SET_AUTHENTICATED', payload: { auth: false } });
      } else {
        const parsed = await response.json();
        dispatch({ type: 'SET_ERROR', payload: parsed.message });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        window.localStorage.removeItem('token');
      }
    }
  };

  useEffect(() => {
    const tokenFromStorage = window.localStorage.getItem('token');
    if (tokenFromStorage) {
      verifyToken(tokenFromStorage);
    } else {
      dispatch({ type: 'SET_ISLOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    if (state.error) {
      notification.error({
        message: 'Error',
        description: state.error,
        duration: 5,
        className: 'custom-notification',
        icon: <div className="custom-icon">X</div>,
      });
      dispatch({ type: 'SET_ERROR', payload: null });
    }
  }, [state.error]);

  const authContextValue = useMemo(
    () => ({
      state,
      logout,
      verifyToken,
      saveToken,
      registrationHandler,
    }),
    [state],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
