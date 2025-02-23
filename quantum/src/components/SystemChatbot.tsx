import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Atom, Cpu } from 'lucide-react';
import { chatService } from '../services/chat-service';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const SystemChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.sendMessage(input);
      
      if (response.startsWith('Service error:') || 
          response.includes('Unable to connect') ||
          response.includes('Authentication failed')) {
        setError(response);
      } else {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-br from-[#051C2C] via-[#062942] to-[#051C2C] rounded-lg shadow-lg border border-white/10">
      <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="relative">
          <Cpu className="w-8 h-8 text-[#0F62FE] animate-spin-slow" />
          <Bot className="w-4 h-4 text-[#33B1FF] absolute bottom-0 right-0" />
        </div>
        <div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-[#0F62FE] via-[#33B1FF] to-[#0F62FE] text-transparent bg-clip-text">
            Quantum Assistant
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#33B1FF]">Powered by</span>
            <img 
              src="https://1000logos.net/wp-content/uploads/2017/06/IBM-Logo-2.png" 
              alt="IBM" 
              className="h-3 brightness-0 invert opacity-80"
            />
            <span className="text-[#33B1FF] font-semibold">Granite</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg backdrop-blur-sm ${
                message.role === 'user'
                  ? 'bg-[#0F62FE]/80 text-white'
                  : 'bg-white/10 text-gray-100'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-60">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#33B1FF]" />
              <span className="text-sm text-gray-300">Processing quantum response...</span>
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 text-red-400 p-3 rounded-lg backdrop-blur-sm"
          >
            {error}
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the quantum system..."
            className="flex-1 bg-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F62FE] placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#0F62FE] text-white px-4 py-2 rounded-lg hover:bg-[#0353E9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemChatbot;