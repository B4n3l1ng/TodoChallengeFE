import { Reducer } from 'react';

// user information interface
interface UserInfo {
  name: string;
  email: string;
  id: string;
}

// authContext state interface
export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserInfo | null;
  error: string | null;
}

// auth context function types
type saveToken = (token: string) => void;

type logout = () => Promise<void>;

type authHandlers = (payload: {
  name?: string;
  email: string;
  password: string;
}) => Promise<void>;

type EditHandler = (payload: {
  newName?: string;
  newEmail?: string;
  newPassword?: string;
  currentPassword: string;
}) => Promise<void>;

// auth context reducer types
type AuthAction =
  | {
      type: 'SET_AUTHENTICATED';
      payload: { auth: boolean; user: UserInfo | null };
    }
  | { type: 'SET_ISLOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// auth context reducer function
export const reducer: Reducer<AuthState, AuthAction> = (state, action) => {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        error: null,
        isAuthenticated: action.payload.auth,
        isLoading: false,
        user: action.payload.user,
      };
    case 'SET_ISLOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

// AuthContextType for it's value
export interface AuthContextType {
  saveToken: saveToken;
  state: AuthState;
  logout: logout;
  registrationHandler: authHandlers;
  loginHandler: authHandlers;
  editHandler: EditHandler;
}
