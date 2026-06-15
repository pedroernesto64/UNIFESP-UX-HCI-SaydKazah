import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Box, Typography, TextField, IconButton, Paper, Avatar,
  Chip, Card, CardContent, useTheme,
} from '@mui/material';
import { ArrowBack, Send, SmartToy, Mic, AccessTime, LocationOn, Visibility } from '@mui/icons-material';
import { events } from '../data/mockData';

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
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      <Box sx={{ bgcolor: '#ff4e00', color: 'white', p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}><ArrowBack /></IconButton>
        <SmartToy sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h6">Converse com o Sayd</Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>Sempre online</Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.map((message) => (
          <Box key={message.id} sx={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start', gap: 1 }}>
            {message.sender === 'ai' && <Avatar sx={{ bgcolor: '#ff4e00' }}><SmartToy /></Avatar>}
            <Box sx={{ maxWidth: '75%' }}>
              <Paper sx={{ p: 2, bgcolor: message.sender === 'user' ? '#ff4e00' : theme.palette.background.paper, color: message.sender === 'user' ? 'white' : 'text.primary' }}>
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
                          height: 120,
                          bgcolor: categoryColors[event.category] || '#607d8b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          position: 'relative',
                        }}
                      >
                        <Typography variant="h6" sx={{ textAlign: 'center', px: 2, fontSize: '1.1rem', fontWeight: 600 }}>
                          {event.title}
                        </Typography>
                        <Chip
                          label={categoryLabels[event.category]}
                          size="small"
                          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.3)', color: 'white', fontSize: '0.65rem' }}
                        />
                      </Box>
                      <CardContent sx={{ pb: 2 }}>
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
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            mt: 1.5,
                            mb: 1.5,
                            fontSize: '0.85rem',
                            lineHeight: 1.3,
                          }}
                        >
                          {event.description}
                        </Typography>
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
            {message.sender === 'user' && <Avatar sx={{ bgcolor: '#cc3d00' }}>U</Avatar>}
          </Box>
        ))}
        {isTyping && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#ff4e00' }}><SmartToy /></Avatar>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff4e00', animation: 'typing 1.4s infinite', animationDelay: `${delay}s`, '@keyframes typing': { '0%, 60%, 100%': { transform: 'translateY(0)' }, '30%': { transform: 'translateY(-10px)' } } }} />
                ))}
              </Box>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton
            onClick={handleVoiceInput}
            sx={{ bgcolor: isListening ? '#ff4e00' : theme.palette.action.hover, color: isListening ? 'white' : '#ff4e00', '&:hover': { bgcolor: isListening ? '#cc3d00' : theme.palette.action.selected } }}
          >
            <Mic />
          </IconButton>
          <TextField
            fullWidth placeholder="Digite sua mensagem..." value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            size="small"
          />
          <IconButton
            onClick={handleSend} disabled={!input.trim()}
            sx={{ bgcolor: '#ff4e00', color: 'white', '&:hover': { bgcolor: '#cc3d00' }, '&:disabled': { bgcolor: theme.palette.action.disabledBackground } }}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
