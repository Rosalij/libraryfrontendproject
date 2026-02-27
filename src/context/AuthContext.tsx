import type { ReactNode } from 'react'
import type { User, LoginCredentials, AuthResponse, AuthContextType } from '../types/auth.types'
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext<AuthContextType | null>(null);

export interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await fetch('https://librarybackend-c0p9.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data: AuthResponse = await response.json();
            setUser(data.user);
            localStorage.setItem('token', data.token);
        }
        catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };


    const checkToken = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }

        try {
        const res = await fetch(
                "https://librarybackend-c0p9.onrender.com/api/auth/validate",
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

          

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {
            localStorage.removeItem("token")
            setUser(null)
        }
    }

    useEffect(() => {
        checkToken();
    }, [])

    //logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export
    const useAuth = (): AuthContextType => {
        const context = useContext(AuthContext);

        if (!context) {
            throw new Error("UseAuth must be used in AuthProvider")
        }
        return context
    };