import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ThemeState } from '@/types/types';

// Initial state
const initialState: ThemeState = {
  theme: 'system',
  systemTheme: 'light',
};

// Theme slice
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    
    setSystemTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.systemTheme = action.payload;
    },
    
    toggleTheme: (state) => {
      if (state.theme === 'light') {
        state.theme = 'dark';
      } else if (state.theme === 'dark') {
        state.theme = 'light';
      } else {
        // If system, toggle to opposite of current system theme
        state.theme = state.systemTheme === 'light' ? 'dark' : 'light';
      }
    },
  },
});

// Export actions
export const { setTheme, setSystemTheme, toggleTheme } = themeSlice.actions;

// Export reducer
export default themeSlice.reducer;