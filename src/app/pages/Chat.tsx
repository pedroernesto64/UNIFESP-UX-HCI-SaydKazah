import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useThemeMode } from '../context/ThemeContext';
import {
  Box, Typography, TextField, IconButton, Paper, Avatar,
  Chip, Card, CardContent, useTheme, SvgIcon
} from '@mui/material';
import { ArrowBack, Send, SmartToy, Mic, AccessTime, LocationOn, Visibility, BookmarkBorder, CheckCircle } from '@mui/icons-material';
import { events } from '../data/mockData';

const HamburgerHalfCut = (props: any) => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M3 6h18M3 12h18M3 18h10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </SvgIcon>
);

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  eventSuggestions?: typeof events;
};

const categoryColors: Record<string, string> = {
  music: '#9c27b0', theater: '#f44336', food: '#ff9800', art: '#2196f3', workshop: '#4caf50', other: '#607d8b',
};

const categoryLabels: Record<string, string> = {
  music: 'Música', theater: 'Teatro', food: 'Gastronomia', art: 'Arte', workshop: 'Oficina', other: 'Outros',
};

const getInitialMessages = (): Message[] => {
  try {
    const saved = localStorage.getItem('chat_messages');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
      }
    }
  } catch (e) {
    console.error('Error loading chat messages:', e);
  }
  return [{
    id: '1',
    text: 'Olá! Sou o Sayd, seu assistente cultural. Posso recomendar eventos baseados no que você gosta. O que te interessa?',
    sender: 'ai',
    timestamp: new Date(),
  }];
};

export function Chat() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { userName, highContrast } = useThemeMode();
  const initialLetter = userName.trim().charAt(0).toUpperCase() || 'U';
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_event_ids');
      return saved ? JSON.parse(saved) : ['1', '3'];
    } catch {
      return ['1', '3'];
    }
  });

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('saved_event_ids', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving chat messages:', e);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = (userMessage: string): { text: string; suggestions?: typeof events } => {
    const m = userMessage.toLowerCase();
    if (m.includes('música') || m.includes('show') || m.includes('concert'))
      return { text: 'Encontrei alguns eventos musicais que você pode gostar! 🎵', suggestions: events.filter(e => e.category === 'music') };
    if (m.includes('arte') || m.includes('exposição') || m.includes('galeria'))
      return { text: 'Aqui estão exposições de arte que podem te interessar! 🎨', suggestions: events.filter(e => e.category === 'art') };
    if (m.includes('teatro') || m.includes('peça') || m.includes('espetáculo'))
      return { text: 'Encontrei estas apresentações teatrais para você! 🎭', suggestions: events.filter(e => e.category === 'theater') };
    if (m.includes('comida') || m.includes('gastro') || m.includes('food'))
      return { text: 'Que tal estes eventos gastronômicos? 🍽️', suggestions: events.filter(e => e.category === 'food') };
    if (m.includes('oficina') || m.includes('workshop') || m.includes('curso'))
      return { text: 'Encontrei estas oficinas para você aprender algo novo! 📚', suggestions: events.filter(e => e.category === 'workshop') };
    if (m.includes('fim de semana') || m.includes('sábado') || m.includes('domingo'))
      return { text: 'Ótimas opções para o fim de semana! 🎉', suggestions: events.filter(e => { const d = new Date(e.date).getDay(); return d === 0 || d === 6; }) };
    if (m.includes('hoje') || m.includes('agora'))
      return { text: 'Aqui estão os eventos mais populares acontecendo em breve! ⭐', suggestions: [...events].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3) };
    return { text: 'Posso te ajudar a encontrar eventos de música, teatro, arte, gastronomia ou oficinas. Ou me conte o que você gosta de fazer! 😊' };
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const res = getAIResponse(input);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: res.text, sender: 'ai', timestamp: new Date(), eventSuggestions: res.suggestions }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => { setIsListening(false); setInput('Quero eventos de música'); }, 2000);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: theme.palette.background.default }}>
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderBottom: highContrast ? '2px solid #ffffff' : 'none'
      }}>
        <IconButton onClick={() => navigate('/')} sx={{ color: 'primary.contrastText' }}><ArrowBack /></IconButton>
        <SmartToy sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h6">Converse com o Sayd</Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>Sempre online</Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.map((message) => (
          <Box key={message.id} sx={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start', gap: 1 }}>
            {message.sender === 'ai' && (
              <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', border: highContrast ? '1px solid #ffffff' : 'none' }}>
                <SmartToy />
              </Avatar>
            )}
            <Box sx={{ maxWidth: '75%' }}>
              <Paper sx={{
                p: 2,
                bgcolor: message.sender === 'user' ? 'primary.main' : theme.palette.background.paper,
                color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                border: highContrast ? '1px solid #ffffff' : 'none'
              }}>
                <Typography variant="body1">{message.text}</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Paper>
              {message.eventSuggestions && message.eventSuggestions.length > 0 && (
                <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {message.eventSuggestions.map((event) => (
                    <Card
                      key={event.id}
                      onClick={() => navigate(`/event/${event.id}`)}
                      sx={{
                        width: '100%',
                        maxWidth: 280,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.02)' },
                      }}
                    >
                      <Box
                        sx={{
                          height: 140,
                          bgcolor: categoryColors[event.category] || '#607d8b',
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
            {message.sender === 'user' && (
              <Avatar sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', border: highContrast ? '1px solid #ffffff' : 'none' }}>
                {initialLetter}
              </Avatar>
            )}
          </Box>
        ))}
        {isTyping && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', border: highContrast ? '1px solid #ffffff' : 'none' }}><SmartToy /></Avatar>
            <Paper sx={{ p: 2, border: highContrast ? '1px solid #ffffff' : 'none' }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', animation: 'typing 1.4s infinite', animationDelay: `${delay}s`, '@keyframes typing': { '0%, 60%, 100%': { transform: 'translateY(0)' }, '30%': { transform: 'translateY(-10px)' } } }} />
                ))}
              </Box>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, borderTop: highContrast ? '2px solid #ffffff' : `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton
            onClick={handleVoiceInput}
            sx={{
              bgcolor: isListening ? 'error.main' : theme.palette.action.hover,
              color: isListening ? 'white' : theme.palette.primary.main,
              '&:hover': { bgcolor: isListening ? 'error.dark' : theme.palette.action.selected },
              border: highContrast ? '1px solid #ffffff' : 'none'
            }}
          >
            <Mic />
          </IconButton>
          <TextField
            fullWidth placeholder="Digite sua mensagem..." value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: highContrast ? 0 : '4px',
              }
            }}
          />
          <IconButton
            onClick={handleSend} disabled={!input.trim()}
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' },
              '&:disabled': { bgcolor: theme.palette.action.disabledBackground },
              border: highContrast ? '1px solid #ffffff' : 'none'
            }}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

