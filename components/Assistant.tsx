import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icons';
import { geminiService } from '../services/geminiService';
import { ChatMessage, ChatSender } from '../types';

interface AssistantProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

export const Assistant: React.FC<AssistantProps> = ({ isOpen, onClose, accentColor }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: ChatSender.BOT, text: 'Hello! I am your virtual assistant. Ask me about our visa services or documents needed.', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: ChatSender.USER,
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const reply = await geminiService.sendMessage(inputText);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: ChatSender.BOT,
        text: reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Assistant Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: ChatSender.BOT,
        text: "Something went wrong. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed inset-x-4 bottom-4 md:bottom-24 md:right-8 md:left-auto md:w-96 h-[600px] max-h-[80vh] bg-black/80 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 backdrop-blur-xl"
          >
            {/* Header */}
            <div className={`p-4 border-b border-white/10 flex justify-between items-center ${accentColor.split(' ')[0]}`}>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 rounded-full">
                  <Icon name="Bot" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Typing Assistant</h3>
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/70 hover:text-white p-2">
                X
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === ChatSender.USER ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.sender === ChatSender.USER 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white/10 text-gray-100 rounded-tl-sm border border-white/10'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <span className="text-[10px] opacity-50 block text-right mt-1">
                      {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about visas..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !inputText.trim()}
                  className={`p-2 rounded-xl transition-colors ${
                    !inputText.trim() ? 'bg-white/5 text-white/30' : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};