import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface User {
    email: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name?: string) => Promise<void>;
    signOut: () => Promise<void>;
    refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.188.59:8081/api';

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const clearAuth = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
        setToken(null);
        setUser(null);
    };

    const refreshAccessToken = useCallback(async (): Promise<string | null> => {
        try {
            const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

            if (!refreshToken) {
                return null;
            }

            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                await clearAuth();
                return null;
            }

            const data = await response.json();

            const newAccessToken = data.accessToken || data.token;
            const newRefreshToken = data.refreshToken;

            if (newAccessToken) {
                await SecureStore.setItemAsync(TOKEN_KEY, newAccessToken);
                setToken(newAccessToken);

                if (newRefreshToken) {
                    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
                }

                return newAccessToken;
            }

            await clearAuth();
            return null;
        } catch (error) {
            console.error('Error refreshing token:', error);
            await clearAuth();
            return null;
        }
    }, []);

    const loadStoredAuth = async () => {
        try {
            const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
            const storedUser = await SecureStore.getItemAsync(USER_KEY);

            if (!storedRefreshToken) {
                await clearAuth();
                return;
            }

            // Sempre validare la sessione col backend tramite refresh
            const newToken = await refreshAccessToken();

            if (newToken && storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                await clearAuth();
            }
        } catch (error) {
            console.error('Error loading stored auth:', error);
            await clearAuth();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStoredAuth();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();

            const authToken = data.accessToken;
            const refreshToken = data.refreshToken;
            const authUser: User = { email: data.email, role: data.role };

            await SecureStore.setItemAsync(TOKEN_KEY, authToken);
            if (refreshToken) {
                await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
            }
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(authUser));

            setToken(authToken);
            setUser(authUser);

            router.replace('/(tabs)');
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    };

    const signUp = async (email: string, password: string, name?: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            const data = await response.json();

            const authToken = data.accessToken;
            const refreshToken = data.refreshToken;
            const authUser: User = { email: data.email, role: data.role };

            await SecureStore.setItemAsync(TOKEN_KEY, authToken);
            if (refreshToken) {
                await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
            }
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(authUser));

            setToken(authToken);
            setUser(authUser);

            router.replace('/(tabs)');
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
            if (refreshToken) {
                try {
                    await fetch(`${API_URL}/auth/logout`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ refreshToken }),
                    });
                } catch (e) {
                    console.log('Server logout failed, continuing local logout');
                }
            }

            await clearAuth();
            router.replace('/');
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token,
                signIn,
                signUp,
                signOut,
                refreshAccessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
