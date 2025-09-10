import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark' | 'system';

interface NotificationState {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    description?: string;
    duration?: number;
}

interface AppState {
    theme: Theme;
    sidebarCollapsed: boolean;
    loading: boolean;
    notifications: NotificationState[];
    lastActivity: number;
}

const initialState: AppState = {
    theme: 'system',
    sidebarCollapsed: false,
    loading: false,
    notifications: [],
    lastActivity: Date.now(),
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.sidebarCollapsed = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        addNotification: (state, action: PayloadAction<Omit<NotificationState, 'id'>>) => {
            const notification: NotificationState = {
                ...action.payload,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            };
            state.notifications.push(notification);
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload
            );
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        updateLastActivity: (state) => {
            state.lastActivity = Date.now();
        },
    },
});

export const {
    setTheme,
    toggleSidebar,
    setSidebarCollapsed,
    setLoading,
    addNotification,
    removeNotification,
    clearNotifications,
    updateLastActivity,
} = appSlice.actions;

export default appSlice.reducer;
