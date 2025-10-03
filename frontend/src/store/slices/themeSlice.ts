import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  isDark: boolean;
}



const getIsDark = (theme: Theme): boolean => {
  if (typeof window === "undefined") return false;

  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return theme === "dark";
};

const initialState: ThemeState = {
  theme: "system", // Always start with system to avoid hydration mismatch
  isDark: false, // Will be set properly after hydration
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      state.isDark = getIsDark(action.payload);

      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
        applyTheme(state.isDark);
      }
    },
    initializeTheme: (state) => {
      if (typeof window !== "undefined") {
        // Get theme from localStorage after hydration
        const stored = localStorage.getItem("theme") as Theme;
        if (stored && ["light", "dark", "system"].includes(stored)) {
          state.theme = stored;
        }

        state.isDark = getIsDark(state.theme);
        applyTheme(state.isDark);
      }
    },
    hydrate: (state) => {
      // This action is called after hydration to sync client state
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("theme") as Theme;
        if (stored && ["light", "dark", "system"].includes(stored)) {
          state.theme = stored;
        }
        state.isDark = getIsDark(state.theme);
      }
    },
  },
});

// Helper function to apply theme with smooth transition
const applyTheme = (isDark: boolean) => {
  const root = document.documentElement;
  const body = document.body;
  
  // Temporarily disable transitions to prevent flicker
  body.classList.add('theme-changing');
  
  // Apply theme
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  
  // Re-enable transitions after DOM update
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      body.classList.remove('theme-changing');
    });
  });
};

export const { setTheme, initializeTheme, hydrate } = themeSlice.actions;
export default themeSlice.reducer;
