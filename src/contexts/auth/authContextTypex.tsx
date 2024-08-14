import { Reducer } from 'react';

export interface UserInfo {
  name: string;
  email: string;
  id: string;
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserInfo | null;
  error: string | null;
}

export type saveToken = (token: string) => void;

export type logout = () => Promise<void>;

export type authHandlers = (payload: {
  name?: string;
  email: string;
  password: string;
}) => Promise<void>;

export type AuthAction =
  | { type: 'SET_AUTHENTICATED'; payload: { auth: boolean; user?: UserInfo } }
  | { type: 'SET_ISLOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export const reducer: Reducer<AuthState, AuthAction> = (state, action) => {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        error: null,
        isAuthenticated: action.payload.auth,
        isLoading: false,
        user: action.payload.user ? action.payload.user : null,
      };
    case 'SET_ISLOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export interface AuthContextType {
  saveToken: saveToken;
  state: AuthState;
  logout: logout;
  registrationHandler: authHandlers;
}
