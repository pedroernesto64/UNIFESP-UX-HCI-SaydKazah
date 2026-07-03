import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Box, Typography, IconButton, Button, Card, CardContent, Chip, Divider, useTheme } from '@mui/material';
import { ArrowBack, AccessTime, LocationOn, Person, Bookmark, BookmarkBorder, Language } from '@mui/icons-material';
import { events } from '../data/mockData';
import { useThemeMode } from '../context/ThemeContext';

const categoryColors: Record<string, string> = {
  music: '#9c27b0', theater: '#f44336', food: '#ff9800', art: '#2196f3', workshop: '#4caf50', other: '#607d8b',
};
const categoryLabels: Record<string, string> = {
  music: 'Música', theater: 'Teatro', food: 'Gastronomia', art: 'Arte', workshop: 'Oficina', other: 'Outros',
};

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { highContrast } = useThemeMode();

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_event_ids');
      return saved ? JSON.parse(saved) : ['1', '3'];
    } catch {
      return ['1', '3'];
    }
  });

  const event = events.find(e => e.id === id);
  if (!event) return <Box sx={{ p: 3 }}><Typography>Evento não encontrado</Typography></Box>;

  const isSaved = bookmarkedIds.includes(event.id);

  const handleToggleBookmark = () => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(event.id) ? prev.filter((x) => x !== event.id) : [...prev, event.id];
      localStorage.setItem('saved_event_ids', JSON.stringify(next));
      return next;
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <Box
        sx={{
          position: 'relative',
          height: 220,
          bgcolor: highContrast ? 'primary.main' : categoryColors[event.category],
          color: highContrast ? 'primary.contrastText' : 'white',
          display: 'flex',
          alignItems: 'flex-end',
          p: 2,
          backgroundImage: highContrast ? 'none' : `url(${event.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: highContrast ? '2px solid #ffffff' : 'none'
        }}
      >
        {!highContrast && <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.35)' }} />}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            color: highContrast ? 'primary.contrastText' : 'white',
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: highContrast ? 'transparent' : 'rgba(0,0,0,0.3)',
            '&:hover': { bgcolor: highContrast ? 'transparent' : 'rgba(0,0,0,0.45)' },
            border: highContrast ? '2px solid #ffffff' : 'none',
            borderRadius: highContrast ? 0 : '50%'
          }}
        >
          <ArrowBack />
        </IconButton>
        <Box sx={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'flex-end', pl: 3, pb: 2 }}>
          <Box>
            <Chip label={categoryLabels[event.category]} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white', mb: 1 }} />
            <Typography variant="h5" sx={{ mb: 1, color: highContrast ? 'primary.contrastText' : 'white' }}>{event.title}</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 2, mt: -2 }}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Informações</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AccessTime sx={{ color: theme.palette.primary.main }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Data e Horário</Typography>
                <Typography variant="body1">
                  {new Date(event.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} às {event.time}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: event.organizer ? 0 : 2 }}>
              <LocationOn sx={{ color: theme.palette.primary.main }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Local</Typography>
                <Typography variant="body1">{event.location}</Typography>
              </Box>
            </Box>
            {event.organizer && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Organizador</Typography>
                    <Typography variant="body1">{event.organizer}</Typography>
                  </Box>
                </Box>
              </>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Sobre o Evento</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>{event.description}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Button
              fullWidth variant="outlined" startIcon={<Language />}
              sx={{
                mb: 1,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  bgcolor: theme.palette.action.hover
                },
                borderWidth: highContrast ? '2px' : '1px'
              }}
            >
              Visitar Site do Evento
            </Button>
            <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block' }}>
              www.evento-exemplo.com.br
            </Typography>
          </CardContent>
        </Card>

        <Button
          fullWidth variant="contained" size="large"
          startIcon={isSaved ? <Bookmark /> : <BookmarkBorder />}
          onClick={handleToggleBookmark}
          sx={{
            bgcolor: isSaved ? (highContrast ? '#000000' : '#4caf50') : 'primary.main',
            color: isSaved ? '#ffffff' : 'primary.contrastText',
            py: 1.5,
            '&:hover': { bgcolor: isSaved ? (highContrast ? '#000000' : '#45a049') : 'primary.dark' },
            border: highContrast ? '2px solid #ffffff' : 'none'
          }}
        >
          {isSaved ? 'Evento Salvo' : 'Salvar Evento'}
        </Button>
      </Box>
    </Box>
  );
}

