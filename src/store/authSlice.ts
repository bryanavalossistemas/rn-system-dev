import { StateCreator } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/schemas/user';

interface Payload {
  sub: User['id'];
  email: User['email'];
  role: User['role'];
  exp: number;
  iat: number;
}

export interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  user: Omit<User, 'password' | 'id'> | null;
  logout: () => void;
  login: (token: string) => void;
}

const decodeToken = (token: string): Omit<User, 'password' | 'id'> => {
  const decoded: Payload = jwtDecode(token);
  return { email: decoded.email, role: decoded.role };
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
