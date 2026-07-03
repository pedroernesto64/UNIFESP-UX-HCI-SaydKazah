import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider, useThemeMode } from './context/ThemeContext';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';

export type Event = {
  id: string;
  title: string;
  category: 'music' | 'theater' | 'food' | 'art' | 'workshop' | 'other';
  date: string;
  time: string;
  location: string;
  description: string;
  organizer?: string;
  venueId: string;
  image?: string;
  views?: number;
};

export type Venue = {
  id: string;
  name: string;
  type: 'park' | 'cultural-center' | 'event-center' | 'theater' | 'gallery' | 'other';
  address: string;
  description: string;
  image?: string;
  eventCount: number;
};

function AppWithTheme() {
  const { darkMode, highContrast } = useThemeMode();

  const theme = createTheme({
    palette: {
      mode: highContrast ? 'dark' : (darkMode ? 'dark' : 'light'),
      primary: {
        main: highContrast ? '#ffff00' : '#ff4e00',
        contrastText: highContrast ? '#000000' : '#ffffff',
      },
      secondary: {
        main: highContrast ? '#ffff00' : '#ff4e00',
        contrastText: highContrast ? '#000000' : '#ffffff',
      },
      background: {
        default: highContrast ? '#000000' : (darkMode ? '#121212' : '#f5f5f5'),
        paper: highContrast ? '#000000' : (darkMode ? '#1e1e1e' : '#ffffff'),
      },
      text: {
        primary: highContrast ? '#ffffff' : (darkMode ? '#ffffff' : '#000000'),
        secondary: highContrast ? '#ffff00' : (darkMode ? '#aaaaaa' : '#555555'),
      },
    },
    components: highContrast ? {
      MuiPaper: {
        styleOverrides: {
          root: {
            border: '2px solid #ffffff !important',
            backgroundImage: 'none !important',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: '2px solid #ffffff !important',
            borderRadius: '0px !important',
            backgroundImage: 'none !important',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            border: '2px solid #ffffff !important',
            borderRadius: '0px !important',
            color: '#ffffff !important',
            backgroundColor: '#000000 !important',
            '&:hover': {
              backgroundColor: '#ffffff !important',
              color: '#000000 !important',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            border: '2px solid #ffffff !important',
            borderRadius: '0px !important',
            backgroundColor: '#000000 !important',
            color: '#ffffff !important',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: '#ffffff !important',
            borderWidth: '1px !important',
          },
        },
      },
    } : {},
  });

  return (
    <MuiThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </MuiThemeProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  );
}
