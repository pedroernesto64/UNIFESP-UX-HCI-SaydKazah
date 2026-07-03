import {
  Box,
  Typography,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  useTheme,
} from '@mui/material';
import { DarkMode, LightMode, Notifications, Language, Contrast } from '@mui/icons-material';
import { useState } from 'react';
import { useThemeMode } from '../context/ThemeContext';

export function Settings() {
  const theme = useTheme();
  const { darkMode, toggleDarkMode, highContrast, toggleHighContrast } = useThemeMode();
  const [notifications, setNotifications] = useState(true);

  const switchSx = {
    '& .MuiSwitch-switchBase.Mui-checked': { color: theme.palette.primary.main },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: theme.palette.primary.main },
  };

  return (
    <Box sx={{ minHeight: '100%', bgcolor: theme.palette.background.default }}>
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        borderBottom: highContrast ? '2px solid #ffffff' : 'none'
      }}>
        <Typography variant="h5">Configurações</Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
          Personalize sua experiência
        </Typography>
      </Box>

      <Box sx={{ p: 2, mt: -2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ pl: 1 }}>
          Aparência
        </Typography>
        <Card sx={{ mb: 3, mt: 1 }}>
          <List disablePadding>
            <ListItem>
              <ListItemIcon>
                {darkMode
                  ? <DarkMode sx={{ color: theme.palette.primary.main }} />
                  : <LightMode sx={{ color: theme.palette.primary.main }} />}
              </ListItemIcon>
              <ListItemText
                primary="Modo escuro"
                secondary={darkMode ? 'Ativado' : 'Desativado'}
              />
              <Switch checked={darkMode} onChange={toggleDarkMode} sx={switchSx} />
            </ListItem>
            <Divider sx={{ borderStyle: highContrast ? 'solid' : 'dashed' }} />
            <ListItem>
              <ListItemIcon>
                <Contrast sx={{ color: theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText
                primary="Alto contraste"
                secondary={highContrast ? 'Ativado' : 'Desativado'}
              />
              <Switch checked={highContrast} onChange={toggleHighContrast} sx={switchSx} />
            </ListItem>
          </List>
        </Card>

        <Typography variant="overline" color="text.secondary" sx={{ pl: 1 }}>
          Notificações
        </Typography>
        <Card sx={{ mb: 3, mt: 1 }}>
          <List disablePadding>
            <ListItem>
              <ListItemIcon>
                <Notifications sx={{ color: theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText
                primary="Alertas de eventos"
                secondary="Receber notificações de novos eventos"
              />
              <Switch
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                sx={switchSx}
              />
            </ListItem>
          </List>
        </Card>

        <Typography variant="overline" color="text.secondary" sx={{ pl: 1 }}>
          Geral
        </Typography>
        <Card sx={{ mt: 1 }}>
          <List disablePadding>
            <ListItem>
              <ListItemIcon><Language sx={{ color: theme.palette.primary.main }} /></ListItemIcon>
              <ListItemText primary="Idioma" secondary="Português (Brasil)" />
            </ListItem>
          </List>
        </Card>
      </Box>
    </Box>
  );
}

