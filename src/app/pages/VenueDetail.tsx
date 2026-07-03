import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Box, Typography, Card, CardContent, IconButton, Chip, useTheme, SvgIcon } from '@mui/material';
import { ArrowBack, AccessTime, LocationOn, Person, Visibility, BookmarkBorder, CheckCircle } from '@mui/icons-material';
import { events, venues } from '../data/mockData';
import { useThemeMode } from '../context/ThemeContext';

const categoryColors: Record<string, string> = {
  music: '#9c27b0', theater: '#f44336', food: '#ff9800', art: '#2196f3', workshop: '#4caf50', other: '#607d8b',
};
const categoryLabels: Record<string, string> = {
  music: 'Música', theater: 'Teatro', food: 'Gastronomia', art: 'Arte', workshop: 'Oficina', other: 'Outros',
};

const HamburgerHalfCut = (props: any) => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M3 6h18M3 12h18M3 18h10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </SvgIcon>
);

export function VenueDetail() {
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

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('saved_event_ids', JSON.stringify(next));
      return next;
    });
  };

  const venue = venues.find(v => v.id === id);
  const venueEvents = events.filter(e => e.venueId === id).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (!venue) return <Box sx={{ p: 3 }}><Typography>Local não encontrado</Typography></Box>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <Box
        sx={{
          position: 'relative',
          height: 220,
          display: 'flex',
          alignItems: 'flex-end',
          color: highContrast ? 'primary.contrastText' : 'white',
          p: 2,
          backgroundImage: highContrast
            ? 'none'
            : `linear-gradient(to bottom, rgba(0,0,0,0.14), rgba(0,0,0,0.88)), url(${venue.image})`,
          bgcolor: highContrast ? 'primary.main' : 'transparent',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: highContrast ? '2px solid #ffffff' : 'none'
        }}
      >
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

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', pt: 2 }}>
          <Typography variant="h5" sx={{ mb: 0.5 }}>{venue.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
            <LocationOn sx={{ fontSize: 16 }} />
            <Typography variant="body2">{venue.address}</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>{venue.description}</Typography>
        <Chip
          label={`${venueEvents.length} eventos agendados`}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            mb: 3,
            border: highContrast ? '2px solid #ffffff' : 'none'
          }}
        />

        <Typography variant="h6" sx={{ mb: 2 }}>Programação</Typography>
        {venueEvents.length === 0 ? (
          <Card><CardContent><Typography color="text.secondary" align="center">Nenhum evento agendado no momento</Typography></CardContent></Card>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {venueEvents.map((event) => (
              <Card
                key={event.id}
                onClick={() => navigate(`/event/${event.id}`)}
                sx={{ cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.01)' } }}
              >
                <Box
                  sx={{
                    height: 140,
                    position: 'relative',
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.14), rgba(0,0,0,0.36)), url(${event.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <Chip
                    label={categoryLabels[event.category]}
                    size="small"
                    sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'rgba(255,255,255,0.85)', color: 'black', fontWeight: 500 }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBookmark(event.id);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(4px)',
                      padding: '6px',
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                      zIndex: 10,
                    }}
                  >
                    {bookmarkedIds.includes(event.id) ? (
                      <CheckCircle sx={{ color: '#2e7d32', fontSize: 18 }} />
                    ) : (
                      <BookmarkBorder sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                    )}
                  </IconButton>
                </Box>
                <CardContent sx={{ pb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.05rem', lineHeight: 1.2, mb: 1.5 }}>
                    {event.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} às {event.time}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" noWrap>{event.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mt: 1.5, mb: 1.5 }}>
                    <HamburgerHalfCut sx={{ color: 'text.secondary', fontSize: 16, mt: 0.3, flexShrink: 0 }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '0.85rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {event.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    <Visibility sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">{event.views} visualizações</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

