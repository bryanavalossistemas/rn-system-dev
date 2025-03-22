import { StateCreator } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
  roles: string[];
}

interface Payload {
  sub: number;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
}

export interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  user: User | null;
  logout: () => void;
  login: (token: string) => void;
}

const decodeToken = (token: string): User => {
  const decoded: Payload = jwtDecode(token);
  return { email: decoded.email, roles: decoded.roles };
};

const createAuthSlice: StateCreator<AuthState> = (set) => {
  return {
    token: null,
    user: null,
    setToken: (token) => {
      if (token) {
        const user = decodeToken(token);
        set({ token, user });
      } else {
        set({ token: null, user: null });
      }
    },
    logout: () => {
      set({ token: null, user: null });
    },
    login: (token) => {
      const user = decodeToken(token);
      set({ token, user });
    },
  };
};

export default createAuthSlice;
