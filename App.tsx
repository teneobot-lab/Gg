
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendPrompt } from './geminiService';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: number;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendPrompt(userMsg.content);
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'error',
        content: error.message || 'Something went wrong. Please try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Gemini REST
            </h1>
            <p className="text-xs text-slate-500 font-medium">Native Fetch implementation</p>
          </div>
        </div>
        <div className="hidden sm:block text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
          Model: gemini-3-flash-preview
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 pr-2 mb-6 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 select-none">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-slate-300">No messages yet</p>
            <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">
              Start a conversation with Gemini using raw REST API calls.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`
              max-w-[85%] px-4 py-3 rounded-2xl shadow-sm
              ${msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : msg.role === 'error' 
                  ? 'bg-red-950/30 text-red-400 border border-red-500/20 rounded-tl-none'
                  : 'bg-slate-800 text-slate-100 border border-slate-700/50 rounded-tl-none'
              }
            `}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </div>
              <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-blue-100 text-right' : 'text-slate-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-800 border border-slate-700/50 px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1.5 py-1">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="relative">
        <div className="absolute inset-0 -top-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none h-12"></div>
        <div className="flex items-end gap-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan di sini..."
            rows={1}
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 py-3 px-3 resize-none max-h-40 overflow-y-auto"
            style={{ minHeight: '44px' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className={`
              p-3 rounded-xl transition-all flex-shrink-0
              ${inputValue.trim() && !isLoading
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 active:scale-95'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
            `}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-3 font-medium uppercase tracking-wider">
          Tanpa SDK • Tanpa NPM • Pure REST Fetch
        </p>
      </div>
    </div>
  );
};

export default App;
