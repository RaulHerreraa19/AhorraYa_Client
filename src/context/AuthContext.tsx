import React, { createContext, useContext, useState, type ReactNode } from 'react';
import api from '../api/axios';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading] = useState<boolean>(false); // No async check, so not loading

    // useEffect removed as we initialize from localStorage directly

    const login = async (data: any) => {
        try {
            const response = await api.post('/auth/login', data);
            console.log('Login response:', response.data);
            const resData = response.data;
            if (resData && (resData.data || resData.result)) {
                const payload = resData.data || resData.result;
                const newToken = payload.token;
                const userData = payload.user;
                setToken(newToken);
                setUser(userData);
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(userData));
            }

        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const register = async (data: any) => {
        try {
            await api.post('/auth/register', data);
            // Automatically login?
        } catch (error) {
            console.error('Register failed', error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
