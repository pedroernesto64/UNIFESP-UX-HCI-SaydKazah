import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  SvgIcon,
  useTheme,
} from '@mui/material';
import { Search, AccessTime, LocationOn, Visibility, BookmarkBorder, CheckCircle } from '@mui/icons-material';
import { events } from '../data/mockData';
import { useNavigate } from 'react-router';
import { useThemeMode } from '../context/ThemeContext';

const categoryLabels: Record<string, string> = {
  music: 'Música',
  theater: 'Teatro',
  food: 'Gastronomia',
  art: 'Arte',
  workshop: 'Oficina',
  other: 'Outros',
};

const categoryColors: Record<string, string> = {
  music: '#9c27b0',
  theater: '#f44336',
  food: '#ff9800',
  art: '#2196f3',
  workshop: '#4caf50',
  other: '#607d8b',
};

const HamburgerHalfCut = (props: any) => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M3 6h18M3 12h18M3 18h10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </SvgIcon>
);

export function Explore() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { highContrast } = useThemeMode();
  const [category, setCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('saved_event_ids');
      if (saved) {
        setBookmarkedIds(JSON.parse(saved));
      }
    } catch {
      //
    }
  }, []);

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('saved_event_ids', JSON.stringify(next));
      return next;
    });
  };

  const filteredEvents = events.filter((event) => {
    const matchesCategory = category === 'all' || event.category === category;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100%' }}>
      <Box
        sx={{
          background: highContrast
            ? 'none'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          bgcolor: highContrast ? 'primary.main' : 'transparent',
          color: highContrast ? 'primary.contrastText' : 'white',
          p: 3,
          borderBottom: highContrast ? '2px solid #ffffff' : 'none',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Explorar Eventos
        </Typography>
        <TextField
          fullWidth
          placeholder="Buscar eventos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            bgcolor: highContrast ? '#000000' : 'white',
            borderRadius: highContrast ? 0 : 1,
            border: highContrast ? '2px solid #ffffff' : 'none',
            '& .MuiOutlinedInput-root': {
              color: highContrast ? '#ffffff' : 'inherit',
              '& fieldset': { border: 'none' },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: highContrast ? '#ffffff' : 'inherit' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: highContrast ? '#ffffff' : 'divider', bgcolor: theme.palette.background.paper }}>
        <Tabs
          value={category}
          onChange={(_, newValue) => setCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
            },
            '& .MuiTab-root.Mui-selected': {
              color: theme.palette.primary.main,
            },
          }}
        >
          <Tab label="Todos" value="all" />
          <Tab label="Música" value="music" />
          <Tab label="Teatro" value="theater" />
          <Tab label="Gastronomia" value="food" />
          <Tab label="Arte" value="art" />
          <Tab label="Oficinas" value="workshop" />
        </Tabs>
      </Box>

      <Box sx={{ p: 2 }}>
        {sortedEvents.length === 0 ? (
          <Card>
            <CardContent>
              <Typography color="text.secondary" align="center">
                Nenhum evento encontrado
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sortedEvents.map((event) => (
              <Card key={event.id} onClick={() => navigate(`/event/${event.id}`)} sx={{ cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
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
                    onClick={(e) => handleToggleBookmark(event.id, e)}
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
        )}
      </Box>
    </Box>
  );
}

