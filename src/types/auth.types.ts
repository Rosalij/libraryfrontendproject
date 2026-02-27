export interface User {
    id: string;
    username: string;
    email: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
};
export interface AuthResponse {
    user: User;
    token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

