import { Box, Typography, Card, CardContent, Divider, useTheme } from '@mui/material';
import { EventNote, SmartToy, LocationOn, Favorite } from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';

export function Info() {
  const theme = useTheme();
  const { highContrast } = useThemeMode();

  const features = [
    { icon: <EventNote sx={{ color: theme.palette.primary.main }} />, title: 'Descubra Eventos', desc: 'Encontre apresentações musicais, peças de teatro, festivais, exposições e muito mais.' },
    { icon: <SmartToy sx={{ color: theme.palette.primary.main }} />, title: 'Chat com Sayd', desc: 'Nosso assistente de IA recomenda eventos personalizados para o seu gosto.' },
    { icon: <LocationOn sx={{ color: theme.palette.primary.main }} />, title: 'Locais Culturais', desc: 'Explore parques, centros culturais, teatros e galerias da sua cidade.' },
    { icon: <Favorite sx={{ color: theme.palette.primary.main }} />, title: 'Salve Favoritos', desc: 'Guarde os eventos que você quer ir e acesse facilmente depois.' },
  ];

  return (
    <Box sx={{ minHeight: '100%', bgcolor: theme.palette.background.default }}>
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        p: 3,
        pb: 5,
        borderBottom: highContrast ? '2px solid #ffffff' : 'none'
      }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>Sobre o App</Typography>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          Sua agenda cultural na palma da mão
        </Typography>
      </Box>

      <Box sx={{ p: 2, mt: -3 }}>
        <Card sx={{ mb: 2, textAlign: 'center' }}>
          <CardContent sx={{ py: 3 }}>
            <Typography variant="h4" sx={{ color: theme.palette.primary.main, mb: 0.5 }}>🎭</Typography>
            <Typography variant="h6">Sayd Kazah</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Versão 1.0.0
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="overline" color="text.secondary" sx={{ pl: 1 }}>
          Funcionalidades
        </Typography>
        <Card sx={{ mt: 1, mb: 2 }}>
          {features.map((f, i) => (
            <Box key={f.title}>
              <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', py: 2 }}>
                <Box sx={{ mt: 0.5 }}>{f.icon}</Box>
                <Box>
                  <Typography variant="subtitle2">{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
                </Box>
              </CardContent>
              {i < features.length - 1 && <Divider />}
            </Box>
          ))}
        </Card>

        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" align="center">
              Desenvolvido com ❤️ para amantes da cultura.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

