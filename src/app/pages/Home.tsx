import { useState } from 'react';
import { Box, Typography, Card, CardContent, Chip, IconButton, useTheme, SvgIcon } from '@mui/material';
import { AccessTime, LocationOn, Visibility, ChevronRight, BookmarkBorder, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { events, venues } from '../data/mockData';
import { useThemeMode } from '../context/ThemeContext';

const categoryColors: Record<string, string> = {
  music: '#9c27b0', theater: '#f44336', food: '#ff9800', art: '#2196f3', workshop: '#4caf50', other: '#607d8b',
};
const categoryLabels: Record<string, string> = {
  music: 'Música', theater: 'Teatro', food: 'Gastronomia', art: 'Arte', workshop: 'Oficina', other: 'Outros',
};
const venueTypeLabels: Record<string, string> = {
  park: 'Parque', 'cultural-center': 'Centro Cultural', 'event-center': 'Centro de Eventos',
  theater: 'Teatro', gallery: 'Galeria', other: 'Outro',
};

const HamburgerHalfCut = (props: any) => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M3 6h18M3 12h18M3 18h10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </SvgIcon>
);

export function Home() {
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
    setBookmarkedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('saved_event_ids', JSON.stringify(next));
      return next;
    });
  };

  const popularEvents = [...events].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100%' }}>
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
        <Typography variant="h5" sx={{ mb: 0.5 }}>Olá! 👋</Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Descubra eventos incríveis na sua cidade
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Eventos Populares</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, mb: 3 }}>
          {popularEvents.map((event) => (
            <Card
              key={event.id}
              onClick={() => navigate(`/event/${event.id}`)}
              sx={{ minWidth: 280, maxWidth: 280, cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
            >
              <Box
                sx={{
                  height: 140,
                  bgcolor: categoryColors[event.category],
                  position: 'relative',
                  backgroundImage: event.image ? `url(${event.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {event.image && (
                  <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.2)' }} />
                )}
                <Chip
                  label={categoryLabels[event.category]}
                  size="small"
                  sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 500 }}
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
                    zIndex: 10
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

        <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>Locais com Eventos</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {venues.map((venue) => {
            const venueEvents = events.filter(e => e.venueId === venue.id);
            return (
              <Card
                key={venue.id}
                onClick={() => navigate(`/venue/${venue.id}`)}
                sx={{ cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateX(4px)', boxShadow: 3 } }}
              >
                <Box sx={{ display: 'flex' }}>
                  <Box
                    sx={{
                      width: 120, minHeight: 120, bgcolor: 'primary.main',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'primary.contrastText', fontSize: 40,
                      backgroundImage: venue.image ? `url(${venue.image})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!venue.image && venue.type === 'park' && '🌳'}
                    {!venue.image && venue.type === 'cultural-center' && '🎭'}
                    {!venue.image && venue.type === 'event-center' && '🎪'}
                    {!venue.image && venue.type === 'theater' && '🎬'}
                    {!venue.image && venue.type === 'gallery' && '🖼️'}
                    {!venue.image && venue.type === 'other' && '📍'}
                  </Box>
                  <CardContent sx={{ flex: 1, position: 'relative', pr: 5 }}>
                    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>{venue.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {venueTypeLabels[venue.type]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.85rem' }}>
                      {venue.description}
                    </Typography>
                    <Chip
                      label={`${venueEvents.length} eventos`}
                      size="small"
                      sx={{ fontSize: '0.75rem', bgcolor: 'primary.main', color: 'primary.contrastText' }}
                    />
                    <IconButton sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                      <ChevronRight />
                    </IconButton>
                  </CardContent>
                </Box>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

