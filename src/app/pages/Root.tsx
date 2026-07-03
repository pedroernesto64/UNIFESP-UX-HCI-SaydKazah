import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Home,
  Menu as MenuIcon,
  ChatBubble,
  Person,
  Settings,
  Info,
  Bookmark,
  Close,
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { darkMode, highContrast, userName } = useThemeMode();
  const initialLetter = userName.trim().charAt(0).toUpperCase() || 'U';
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getNavValue = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname === '/chat') return 1;
    return 0;
  };

  const handleMenuNav = (path: string) => {
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        bgcolor: '#1a1a1a',
        alignItems: 'center',
      }}
    >
      <Box
        id="app-container"
        sx={{
          width: '100%',
          maxWidth: '430px',
          height: '100vh',
          maxHeight: '932px',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: theme.palette.background.default,
          position: 'relative',
          boxShadow: '0 0 50px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          border: highContrast ? '2px solid #ffffff' : 'none',
        }}
      >
        <Box sx={{ flex: 1, overflow: 'auto', pb: 8 }}>
          <Outlet />
        </Box>

        {/* Bottom Navigation */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: theme.palette.background.paper,
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
          }}
        >
          <BottomNavigation
            value={getNavValue()}
            showLabels
            sx={{
              height: 64,
              bgcolor: theme.palette.background.paper,
              borderTop: highContrast ? '2px solid #ffffff' : 'none',
              '& .MuiBottomNavigationAction-root': {
                color: highContrast
                  ? '#ffffff'
                  : darkMode
                  ? 'rgba(255,255,255,0.4)'
                  : 'rgba(0,0,0,0.35)',
                minWidth: 0,
                padding: '10px 0 !important',
                transition: 'none !important',
                '&.Mui-selected': {
                  paddingTop: '10px !important',
                  color: theme.palette.primary.main,
                },
                '& .MuiBottomNavigationAction-label': {
                  transition: 'none !important',
                  fontSize: '11px !important',
                  opacity: '1 !important',
                  '&.Mui-selected': {
                    fontSize: '11px !important',
                    color: theme.palette.primary.main,
                  },
                },
                '& .MuiSvgIcon-root': {
                  transition: 'none !important',
                },
              },
            }}
          >
            {/* Início */}
            <BottomNavigationAction
              label="Início"
              icon={<Home />}
              onClick={() => navigate('/')}
            />

            {/* Chat — botão central com círculo laranja, alinhado com os demais */}
            <BottomNavigationAction
              label="Chat"
              onClick={() => navigate('/chat')}
              icon={
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: highContrast ? '0%' : '50%',
                    bgcolor: highContrast
                      ? location.pathname === '/chat'
                        ? '#ffffff'
                        : '#000000'
                      : location.pathname === '/chat'
                      ? 'primary.dark'
                      : 'primary.main',
                    border: highContrast ? '2px solid #ffffff' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: highContrast ? 'none' : `0 2px 10px ${theme.palette.primary.main}45`,
                    transition: 'background-color 0.2s',
                  }}
                >
                  <ChatBubble
                    sx={{
                      color: highContrast
                        ? location.pathname === '/chat'
                          ? '#000000'
                          : '#ffffff'
                        : 'white',
                      fontSize: 22,
                    }}
                  />
                </Box>
              }
              sx={{
                '& .MuiBottomNavigationAction-label': { display: 'none !important' },
                padding: '0 !important',
                minWidth: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />

            {/* Menu hamburguer */}
            <BottomNavigationAction
              label="Menu"
              icon={<MenuIcon />}
              onClick={() => setDrawerOpen(true)}
              sx={{
                color: drawerOpen
                  ? theme.palette.primary.main
                  : highContrast
                  ? '#ffffff'
                  : darkMode
                  ? 'rgba(255,255,255,0.4)'
                  : 'rgba(0,0,0,0.35)',
              }}
            />
          </BottomNavigation>
        </Box>

        {/* Sidebar Backdrop */}
        <Box
          onClick={() => setDrawerOpen(false)}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1100,
            opacity: drawerOpen ? 1 : 0,
            visibility: drawerOpen ? 'visible' : 'hidden',
            transition: 'opacity 0.28s ease-out, visibility 0.28s ease-out',
          }}
        />

        {/* Sidebar (slide from right) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 280,
            bgcolor: theme.palette.background.paper,
            zIndex: 1200,
            boxShadow: drawerOpen ? '-5px 0 25px rgba(0,0,0,0.25)' : 'none',
            transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: highContrast ? '2px solid #ffffff' : 'none',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              p: 2,
              pt: 3,
              pb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderBottom: highContrast ? '2px solid #ffffff' : 'none',
            }}
          >
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)' }}>
              {initialLetter}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ lineHeight: 1.2 }}>{userName}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>São Paulo, SP</Typography>
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white', p: 0.5 }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>

          <Divider />

          <List sx={{ pt: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuNav('/saved')}
                sx={{ py: 1.5, '&:hover': { bgcolor: highContrast ? 'rgba(255,255,255,0.2)' : 'rgba(255,78,0,0.08)' } }}
              >
                <ListItemIcon sx={{ minWidth: 44 }}>
                  <Bookmark sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Favoritos"
                  secondary="Ver eventos salvos"
                  primaryTypographyProps={{ sx: { color: highContrast ? '#ffffff' : (darkMode ? 'white' : 'text.primary') } }}
                  secondaryTypographyProps={{ sx: { color: highContrast ? '#ffff00' : (darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary') } }}
                />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ mx: 2 }} />

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuNav('/profile')}
                sx={{ py: 1.5, '&:hover': { bgcolor: highContrast ? 'rgba(255,255,255,0.2)' : 'rgba(255,78,0,0.08)' } }}
              >
                <ListItemIcon sx={{ minWidth: 44 }}>
                  <Person sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Perfil"
                  secondary="Ver e editar perfil"
                  primaryTypographyProps={{ sx: { color: highContrast ? '#ffffff' : (darkMode ? 'white' : 'text.primary') } }}
                  secondaryTypographyProps={{ sx: { color: highContrast ? '#ffff00' : (darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary') } }}
                />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ mx: 2 }} />

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuNav('/settings')}
                sx={{ py: 1.5, '&:hover': { bgcolor: highContrast ? 'rgba(255,255,255,0.2)' : 'rgba(255,78,0,0.08)' } }}
              >
                <ListItemIcon sx={{ minWidth: 44 }}>
                  <Settings sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Configurações"
                  secondary="Aparência e preferências"
                  primaryTypographyProps={{ sx: { color: highContrast ? '#ffffff' : (darkMode ? 'white' : 'text.primary') } }}
                  secondaryTypographyProps={{ sx: { color: highContrast ? '#ffff00' : (darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary') } }}
                />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ mx: 2 }} />

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuNav('/info')}
                sx={{ py: 1.5, '&:hover': { bgcolor: highContrast ? 'rgba(255,255,255,0.2)' : 'rgba(255,78,0,0.08)' } }}
              >
                <ListItemIcon sx={{ minWidth: 44 }}>
                  <Info sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Informações"
                  secondary="Sobre o aplicativo"
                  primaryTypographyProps={{ sx: { color: highContrast ? '#ffffff' : (darkMode ? 'white' : 'text.primary') } }}
                  secondaryTypographyProps={{ sx: { color: highContrast ? '#ffff00' : (darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary') } }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    </Box>
  );
}
