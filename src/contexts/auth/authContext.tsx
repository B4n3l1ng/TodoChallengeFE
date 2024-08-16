import { notification } from 'antd';
import { createContext, useEffect, useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

import { ContextProviderProps } from '../tasks/taskContextTypes';
import { AuthContextType, AuthState, reducer } from './authContextTypex';

// initial state
const initialState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  error: null,
};

// exporting of the AuthContext and it's creation with generic starter functions and values
export const AuthContext = createContext<AuthContextType>({
  saveToken: () => {},
  state: initialState,
  logout: async () => {},
  registrationHandler: async () => {},
  loginHandler: async () => {},
  editHandler: async () => {},
});

// settings for the error and success notifications
notification.config({
  placement: 'bottomLeft',
  bottom: 50,
  duration: 5,
});

function AuthContextProvider({ children }: ContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const saveToken = (tokenFromLogin: string) => {
    // saves the token provided as an argument as the "token" property in the localStorage
    window.localStorage.setItem('token', tokenFromLogin);
  };

  const verifyToken = async (tokenFromStorage: string) => {
    // verifies the token in the localStorage by contacting the backend
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
        headers: { Authorization: `Bearer ${tokenFromStorage}` },
      });

      if (response.status === 200) {
        const parsed = await response.json();
        // if the token is valid, set state.isAuthenticated to true and save the user information in the state.user
        dispatch({
          type: 'SET_AUTHENTICATED',
          payload: { auth: true, user: parsed.user },
        });
      } else {
        // if it's invalid, remove it from the localStorage, and set state.isLoading to false, which should trigger a redirect to the login page
        window.localStorage.removeItem('token');
        dispatch({ type: 'SET_ISLOADING', payload: false });
      }
    } catch (error) {
      // same as the invalid token. If there's an error, delete te token from the localStorage and set state.isLoading to false, redirecting to the login page
      console.log('Error in verifyToken:', error);
      window.localStorage.removeItem('token');
      dispatch({ type: 'SET_ISLOADING', payload: false });
    }
  };

  const registrationHandler = async (payload: {
    name?: string;
    email: string;
    password: string;
  }) => {
    // send the new user information to the backend
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.status === 201) {
        // if the response is 201, redirects to login page, so user can login
        navigate('/login');
      } else if (response.status === 400) {
        // if the response is 400, set an error message on the state, which triggers an error notification from antd
        const { message } = await response.json();
        dispatch({ type: 'SET_ERROR', payload: message });
      }
    } catch (error) {
      // in the case of an error, set an error message to the notification from antd
      console.log(error);
      dispatch({ type: 'SET_ERROR', payload: 'Internal Server Error.' });
    }
  };

  const loginHandler = async (payload: { email: string; password: string }) => {
    // sends the login information to the backend
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const parsed = await response.json();

      if (response.status === 200) {
        // if the response is 200, save the token in the localStorage
        saveToken(parsed.token);

        // Update the loading property and verify the token
        dispatch({ type: 'SET_ISLOADING', payload: true });
        await verifyToken(parsed.token);

        // Navigate after state is updated
        navigate('/');
      } else if (response.status === 401) {
        // if the response if 401, set an error message
        dispatch({ type: 'SET_ERROR', payload: parsed.message });
      }
    } catch (error) {
      // in the case of an error, set the message on the state to trigger a notification
      console.error(error);
      dispatch({ type: 'SET_ERROR', payload: 'Internal Server Error.' });
    }
  };

  const logout = async () => {
    // logs out the user by sending the token to the backend and blacklisting it, along with removing it from the localStorage
    const token = window.localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        window.localStorage.removeItem('token'); // removes token from localStorage
        dispatch({
          type: 'SET_AUTHENTICATED',
          payload: { auth: false, user: null },
        }); // removes the user information from the state
        navigate('/login'); // navigates to login
      } else {
        // in case of no success, sets an error on the state, which triggers a notification
        const parsed = await response.json();
        dispatch({ type: 'SET_ERROR', payload: parsed.message });
      }
    } catch (error) {
      if (error instanceof Error) {
        // in case of error, sets the error state to the message of this error, which triggers the notification, and then removes the token
        console.log(error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        window.localStorage.removeItem('token');
      }
    }
  };

  const editHandler = async (payload: {
    newName?: string;
    newEmail?: string;
    newPassword?: string | null;
    currentPassword: string;
  }) => {
    // edits the user information
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.status === 202) {
        // if the response is favourable, verify the token to the get the most up to date user information and trigger a notification, before navigating to the home page
        await verifyToken(token as string);
        notification.success({
          message: 'Success',
          description: 'User updated successfully',
          duration: 5,
          className: 'custom-notification-success',
          icon: <div className="custom-icon">✅</div>,
        });
        navigate('/');
      } else if (response.status === 401 || response.status === 400) {
        // if the response is not favourable, parse the response and set the message as an error state, triggering a notification
        const parsed = await response.json();
        dispatch({ type: 'SET_ERROR', payload: parsed.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const tokenFromStorage = window.localStorage.getItem('token');
    // if there's a token in storage, verify it
    if (tokenFromStorage) {
      verifyToken(tokenFromStorage);
    } else {
      // if not, set loading to false
      dispatch({ type: 'SET_ISLOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    // if an error exists, trigger an error notification from antd
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

  // memoization of the context value
  const authContextValue = useMemo(
    () => ({
      state,
      logout,
      verifyToken,
      saveToken,
      registrationHandler,
      loginHandler,
      editHandler,
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
