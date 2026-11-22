import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const getStoredThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark';
  try {
    const raw = localStorage.getItem('nodalconnector-theme-mode');
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.state?.theme || 'dark';
  } catch {
    return 'dark';
  }
};

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const resolveTheme = (theme: ThemeMode): 'light' | 'dark' => {
  return theme === 'system' ? getSystemTheme() : theme;
};

const applyThemeToDOM = (resolved: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', resolved);
  if (resolved === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
};

const initialMode = getStoredThemeMode();
const initialResolved = resolveTheme(initialMode);
applyThemeToDOM(initialResolved);

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: initialMode,
      resolvedTheme: initialResolved,
      setTheme: (theme: ThemeMode) => {
        const resolved = resolveTheme(theme);
        applyThemeToDOM(resolved);
        set({ theme, resolvedTheme: resolved });
      },
      toggleTheme: () => {
        const current = get().resolvedTheme;
        const next: 'light' | 'dark' = current === 'dark' ? 'light' : 'dark';
        applyThemeToDOM(next);
        set({ theme: next, resolvedTheme: next });
      },
    }),
    {
      name: 'nodalconnector-theme-mode',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolved = resolveTheme(state.theme);
          state.resolvedTheme = resolved;
          applyThemeToDOM(resolved);
        }
      },
    }
  )
);

if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    const currentTheme = useThemeStore.getState().theme;
    if (currentTheme === 'system') {
      const resolved = e.matches ? 'dark' : 'light';
      applyThemeToDOM(resolved);
      useThemeStore.setState({ resolvedTheme: resolved });
    }
  });
}
