import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Paper, TextField, IconButton, Typography, Avatar, Chip,
  Fab, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Divider
} from '@mui/material';
import { Send, Close, Pets, SmartToy, Person } from '@mui/icons-material';
import { chatbotService } from '../services/chatbotService';
import { useAuth } from '../contexts/AuthContext';

// Add CSS animations
const pulseKeyframes = `
  @keyframes pulse {
    0%, 80%, 100% { opacity: 0.3; }
    40% { opacity: 1; }
  }
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = pulseKeyframes;
  document.head.appendChild(style);
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

const PetCareChatbot: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: `**Professional Veterinary AI Assistant**\n\nWelcome to our clinical-grade artificial intelligence system designed to provide evidence-based veterinary guidance and comprehensive pet care services.\n\n**Clinical Capabilities:**\n• Symptom analysis and differential diagnosis\n• Treatment protocol recommendations\n• Vaccination scheduling and management\n• Emergency triage and guidance\n• Behavioral assessment and training\n\n**Adoption Services:**\n• Pet matching algorithms\n• Care requirement analysis\n• Behavioral compatibility assessment\n\n**Example Queries:**\n• "My dog has been vomiting for 2 days"\n• "Show available cats for adoption"\n• "Puppy vaccination schedule"\n\nHow may I assist you today?`,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: [
          'Health Assessment',
          'Available Pets',
          'Vaccination Schedule',
          'Emergency Protocols'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Fast AI response - no delays
      const response = await chatbotService.sendMessage(input, isAdmin);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '😔 I apologize, but I encountered a technical issue. Please try rephrasing your question or contact our support team if the problem persists.',
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ['Try again', 'Contact support', 'Pet care basics', 'Available pets']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Fab
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
          color: 'white',
          boxShadow: '0 8px 24px rgba(30, 60, 114, 0.4)',
          border: '2px solid #ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #2a5298, #1e3c72)',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 32px rgba(30, 60, 114, 0.6)',
          }
        }}
        onClick={() => setOpen(true)}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5
        }}>
          <Box sx={{ fontSize: '18px', fontWeight: 'bold' }}>AI</Box>
          <Box sx={{ fontSize: '8px', opacity: 0.8 }}>VET</Box>
        </Box>
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { height: '600px', display: 'flex', flexDirection: 'column' }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px solid #0d47a1'
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ffffff, #e3f2fd)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              <Box sx={{ color: '#1565c0', fontSize: '24px', fontWeight: 'bold' }}>AI</Box>
            </Box>
           <Box>
  <Typography
    variant="h6"
    sx={{
      fontWeight: 600,
      mb: 0.5,
      color: '#fff'
    }}
  >
    Veterinary AI Assistant
  </Typography>

  <Typography
    variant="caption"
    sx={{
      opacity: 0.9,
      color: '#fff'
    }}
  >
        Professional Medical Guidance
      </Typography>
        </Box>

        <Chip
          label="Clinical Grade"
          size="small"
          sx={{
          bgcolor: 'rgba(191, 191, 191, 0.97)',
          color: 'white',
          fontWeight: 500,
          border: '1px solid rgba(255,255,255,0.3)'
           }}
          />
          </Box>
          <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {messages.map((message) => (
              <Box key={message.id} sx={{ mb: 2 }}>
                <Box display="flex" alignItems="flex-start" gap={1}
                     justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'}>
                  {message.sender === 'bot' && (
                    <Avatar sx={{ 
                      bgcolor: 'linear-gradient(135deg, #1e3c72, #2a5298)', 
                      width: 36, 
                      height: 36,
                      border: '2px solid #e3f2fd'
                    }}>
                      <Box sx={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>AI</Box>
                    </Avatar>
                  )}
                  <Paper
                    sx={{
                      p: 2.5,
                      maxWidth: '75%',
                      bgcolor: message.sender === 'user' ? 'linear-gradient(135deg, #1e3c72, #2a5298)' : '#f8f9fa',
                      color: message.sender === 'user' ? 'white' : '#2c3e50',
                      border: message.sender === 'bot' ? '1px solid #e0e0e0' : 'none',
                      borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ whiteSpace: 'pre-line' }}
                      dangerouslySetInnerHTML={{
                        __html: message.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/🏥|💊|⏰|⚠️|📝|🗓️|📋/g, '<span style="font-size: 1.1em;">$&</span>')
                      }}
                    />
                    <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Paper>
                  {message.sender === 'user' && (
                    <Avatar sx={{ bgcolor: '#27AE60', width: 32, height: 32 }}>
                      <Person fontSize="small" />
                    </Avatar>
                  )}
                </Box>
                
                {message.suggestions && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'flex-start' }}>
                    {message.suggestions.map((suggestion, index) => (
                      <Chip
                        key={index}
                        label={suggestion}
                        size="small"
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            ))}
            {loading && (
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ bgcolor: '#4A90E2', width: 32, height: 32 }}>
                  <SmartToy fontSize="small" />
                </Avatar>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2">AI is analyzing your question</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Box sx={{ width: 4, height: 4, bgcolor: '#4A90E2', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                      <Box sx={{ width: 4, height: 4, bgcolor: '#4A90E2', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.2s' }} />
                      <Box sx={{ width: 4, height: 4, bgcolor: '#4A90E2', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.4s' }} />
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Divider />
          <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Describe symptoms, ask about pets, or request medical guidance..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              helperText={loading ? 'AI processing your medical query...' : 'Professional veterinary guidance available 24/7'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#1e3c72',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2a5298',
                    borderWidth: '2px'
                  }
                }
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim() || loading}
              sx={{
                background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
                color: 'white',
                borderRadius: '12px',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #2a5298, #1e3c72)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(30, 60, 114, 0.4)'
                },
                '&:disabled': {
                  background: '#e0e0e0',
                  color: '#9e9e9e'
                }
              }}
            >
              <Send />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PetCareChatbot;