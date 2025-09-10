import { createAsyncThunk } from '@reduxjs/toolkit';

// Mock API functions - replace with your actual API calls
const authAPI = {
    login: async (credentials: { email: string; password: string }) => {
        // Simulate API call
        return new Promise<{ user: { id: string; email: string; name: string }; token: string }>(
            (resolve, reject) => {
                setTimeout(() => {
                    if (credentials.email && credentials.password) {
                        resolve({
                            user: {
                                id: '1',
                                email: credentials.email,
                                name: 'User Name',
                            },
                            token: 'fake-jwt-token',
                        });
                    } else {
                        reject(new Error('Invalid credentials'));
                    }
                }, 1000);
            }
        );
    },

    register: async (userData: { email: string; password: string; name: string }) => {
        return new Promise<{ user: { id: string; email: string; name: string }; token: string }>(
            (resolve, reject) => {
                setTimeout(() => {
                    if (userData.email && userData.password && userData.name) {
                        resolve({
                            user: {
                                id: '1',
                                email: userData.email,
                                name: userData.name,
                            },
                            token: 'fake-jwt-token',
                        });
                    } else {
                        reject(new Error('Invalid user data'));
                    }
                }, 1000);
            }
        );
    },

    refreshToken: async (token: string) => {
        return new Promise<{ token: string }>((resolve, reject) => {
            setTimeout(() => {
                if (token) {
                    resolve({ token: 'new-fake-jwt-token' });
                } else {
                    reject(new Error('Invalid token'));
                }
            }, 500);
        });
    },

    logout: async () => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    },
};

// Async thunks
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await authAPI.login(credentials);
            return response;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData: { email: string; password: string; name: string }, { rejectWithValue }) => {
        try {
            const response = await authAPI.register(userData);
            return response;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: { token: string | null } };
            const currentToken = state.auth.token;

            if (!currentToken) {
                return rejectWithValue('No token available');
            }

            const response = await authAPI.refreshToken(currentToken);
            return response;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Token refresh failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await authAPI.logout();
            return;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Logout failed');
        }
    }
);
