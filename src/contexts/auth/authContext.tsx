import { createContext, useEffect, useMemo, useReducer } from 'react';

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
});

function AuthContextProvider({ children }: ContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  const authContextValue = useMemo(
    () => ({
      state,
      logout,
      verifyToken,
      saveToken,
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
