import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  userName: string;
  updateUserName: (name: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
  highContrast: false,
  toggleHighContrast: () => {},
  userName: 'Usuário',
  updateUserName: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('dark_mode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [highContrast, setHighContrast] = useState(() => {
    try {
      const saved = localStorage.getItem('high_contrast');
      return saved === 'true';
    } catch {
      return false;
    }
  });
  
  const [userName, setUserName] = useState(() => {
    try {
      const saved = localStorage.getItem('user_name');
      return saved || 'Usuário';
    } catch {
      return 'Usuário';
    }
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('dark_mode', String(next));
      } catch (e) {
        console.error('Error saving dark mode:', e);
      }
      return next;
    });
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => {
      const next = !prev;
      try {
        localStorage.setItem('high_contrast', String(next));
      } catch (e) {
        console.error('Error saving high contrast:', e);
      }
      return next;
    });
  };

  const updateUserName = (name: string) => {
    setUserName(name);
    try {
      localStorage.setItem('user_name', name);
    } catch (e) {
      console.error('Error saving user name:', e);
    }
  };

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Error updating document class:', e);
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      if (highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    } catch (e) {
      console.error('Error updating document class:', e);
    }
  }, [highContrast]);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        highContrast,
        toggleHighContrast,
        userName,
        updateUserName,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}

