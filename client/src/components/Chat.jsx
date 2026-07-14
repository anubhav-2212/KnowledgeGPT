import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  Loader2,
  X,
  Info
} from 'lucide-react';

export default function Chat({ sources }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [nickname, setNickname] = useState(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `User_${randomNum}`;
  });
  const [tempNickname, setTempNickname] = useState(nickname);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState(1);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [activeCitation, setActiveCitation] = useState(null);

  const messagesEndRef = useRef(null);

  // Suggested questions
  const starterPrompts = [
    { text: "What is this application about?", label: "About" },
    { text: "Analyze the uploaded documents", label: "Analyze Sources" },
    { text: "Help me write a summary of my text", label: "Summarize" }
  ];

  const handleAiGenerationRef = useRef(null);

  // Connect to Socket.io server
  useEffect(() => {
    const socketInstance = io('http://localhost:5001', {
      transports: ['websocket'],
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    socketInstance.on('users:count', (count) => {
      setActiveUsers(count);
    });

    socketInstance.on('chat:history', (history) => {
      setMessages(history);
    });

    socketInstance.on('chat:message', (message) => {
      setMessages((prev) => {
        // Prevent duplicate messages if received from socket history + live
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
      
      // If we receive a user message (not AI) and it was sent by us, trigger AI response
      if (message.sender !== 'KnowledgeGPT AI' && message.socketId === socketInstance.id) {
        handleAiGenerationRef.current?.(message.text, socketInstance);
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiResponding]);

  // Keep ref up to date
  useEffect(() => {
    handleAiGenerationRef.current = handleAiGeneration;
  });

  // AI Response Simulation Engine (RAG logic)
  const handleAiGeneration = async (query, socketInst) => {
    setIsAiResponding(true);

    // 1. Scan for matching sources
    const matchedSources = [];
    const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    sources.forEach(source => {
      const matchScore = keywords.reduce((score, word) => {
        if (source.title.toLowerCase().includes(word) || source.content.toLowerCase().includes(word)) {
          return score + 1;
        }
        return score;
      }, 0);

      if (matchScore > 0 || keywords.length === 0) {
        matchedSources.push(source);
      }
    });

    // 2. Draft Response Content
    let fullReply = "";
    let citations = [];

    if (sources.length === 0) {
      fullReply = "I noticed you haven't uploaded any knowledge sources yet. To experience the full capability of KnowledgeGPT, please upload a PDF, import a URL, or paste text in the **Knowledge Sources** panel on the left. I will then be able to reference your specific sources, answer detailed questions, and provide precise citations.";
    } else if (matchedSources.length > 0) {
      citations = matchedSources.map(s => ({
        id: s.id,
        title: s.title,
        type: s.type,
        snippet: s.content.substring(0, 180) + "..."
      }));
      
      const sourceListText = matchedSources.map((s, idx) => `[${idx + 1}] *${s.title}*`).join(', ');
      fullReply = `Based on the provided information in ${sourceListText}, here is what I found:\n\n1. **Core Content Match**: The sources contain reference information matching your query. Specifically, they outline structural technical details and guidelines relevant to this environment.\n2. **Synthesis**: The uploaded document details indicate proper indexing and synchronization on the backend.\n\nLet me know if you would like me to deep dive into any specific section of your uploaded documents!`;
    } else {
      // Sources exist but no direct match found
      citations = [sources[0]].map(s => ({
        id: s.id,
        title: s.title,
        type: s.type,
        snippet: s.content.substring(0, 180) + "..."
      }));
      fullReply = `I scanned your active sources but couldn't find a direct keyword match for your question. However, referring to your primary index [1] *${sources[0].title}*, here is a summary:\n\nThe project details general real-time socket communications, Tailwind CSS v4, and knowledge scraping integrations. Please feel free to add more detailed source text on this topic if you need a more specific answer!`;
    }

    // 3. Simulate streaming answer text word-by-word
    let currentText = "";
    const words = fullReply.split(" ");
    let i = 0;
    
    // Create local temp AI message for visual flow
    const tempId = `ai-temp-${Date.now()}`;
    const aiMessagePlaceholder = {
      id: tempId,
      sender: 'KnowledgeGPT AI',
      text: '',
      timestamp: new Date().toISOString(),
      socketId: 'ai',
      citations: citations,
      isStreaming: true
    };
    
    setMessages((prev) => [...prev, aiMessagePlaceholder]);

    const streamInterval = setInterval(() => {
      if (i < words.length) {
        currentText += (i === 0 ? "" : " ") + words[i];
        setMessages((prev) => 
          prev.map((msg) => msg.id === tempId ? { ...msg, text: currentText } : msg)
        );
        i++;
      } else {
        clearInterval(streamInterval);
        setIsAiResponding(false);

        // Finalize message and sync to socket history
        const finalMessage = {
          id: `ai-${Date.now()}`,
          sender: 'KnowledgeGPT AI',
          text: fullReply,
          timestamp: new Date().toISOString(),
          socketId: 'ai',
          citations: citations
        };

        // Remove temp placeholder and emit final to socket
        setMessages((prev) => prev.filter(msg => msg.id !== tempId));
        socketInst.emit('chat:message', finalMessage);
      }
    }, 45); // Typing speed
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !socket || isAiResponding) return;

    const userMessage = {
      sender: nickname,
      text: messageText.trim(),
      socketId: socket.id,
    };

    socket.emit('chat:message', userMessage);
    setMessageText('');
  };

  const handleSaveNickname = (e) => {
    e.preventDefault();
    if (tempNickname.trim()) {
      setNickname(tempNickname.trim());
      setIsEditingNickname(false);
    }
  };

  const handleQuickQuestion = (promptText) => {
    if (isAiResponding) return;
    setMessageText(promptText);
    setTimeout(() => {
      // Small timeout to allow input update, then send
      const userMessage = {
        sender: nickname,
        text: promptText,
        socketId: socket?.id,
      };
      socket?.emit('chat:message', userMessage);
    }, 50);
  };

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 relative overflow-hidden">
      
      {/* Top Header Panel */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Knowledge Assistant AI</h3>
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isEditingNickname ? (
                <form onSubmit={handleSaveNickname} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempNickname}
                    onChange={(e) => setTempNickname(e.target.value)}
                    className="px-2 py-0.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                    maxLength={15}
                  />
                  <button type="submit" className="text-[10px] text-indigo-500 hover:text-indigo-600 font-semibold px-1">Save</button>
                </form>
              ) : (
                <p className="text-xs text-slate-400">
                  Chatting as <span className="font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:underline" onClick={() => setIsEditingNickname(true)}>{nickname}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {activeUsers} user{activeUsers > 1 ? 's' : ''} online
        </div>
      </div>

      {/* Main Chat Flow Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-600 mb-6">
              <Bot className="w-8 h-8 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Welcome to KnowledgeGPT
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              This is a ChatGPT & NotebookLM hybrid system. Start by uploading knowledge sources on the left panel. The AI will then read and quote citations from those documents to answer your questions.
            </p>

            {/* Quick Prompts */}
            <div className="mt-8 w-full space-y-2">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Suggested Starter Prompts</p>
              {starterPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(prompt.text)}
                  className="w-full flex items-center justify-between p-3.5 text-left text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/10 text-slate-700 dark:text-slate-300 transition-all duration-150 group"
                >
                  <span>{prompt.text}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, index) => {
              const isSelf = msg.socketId === socket?.id;
              const isAi = msg.sender === 'KnowledgeGPT AI';
              
              return (
                <div
                  key={msg.id || index}
                  className={`flex gap-3 max-w-3xl ${isSelf ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Avatar Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 ${
                    isAi 
                      ? 'bg-indigo-600' 
                      : (isSelf ? 'bg-slate-700 dark:bg-slate-800' : 'bg-emerald-600')
                  }`}>
                    {isAi ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col min-w-0 max-w-[85%]">
                    {/* Meta info */}
                    <div className={`flex items-center gap-2 mb-1 text-[10px] text-slate-400 ${isSelf ? 'justify-end' : ''}`}>
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        {isSelf ? 'You' : msg.sender}
                      </span>
                      <span>•</span>
                      <span>{formatTime(msg.timestamp)}</span>
                    </div>

                    {/* Chat Text */}
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      isSelf
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none'
                    }`}>
                      {msg.text}

                      {/* Display typing pulse for streaming messages */}
                      {msg.isStreaming && (
                        <span className="inline-flex gap-1 items-center ml-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 typing-dot"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 typing-dot"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 typing-dot"></span>
                        </span>
                      )}
                    </div>

                    {/* Citation chips below AI answer */}
                    {isAi && msg.citations && msg.citations.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          Citations:
                        </span>
                        {msg.citations.map((cite, cIdx) => (
                          <button
                            key={cite.id || cIdx}
                            onClick={() => setActiveCitation(cite)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/80 transition-colors"
                          >
                            [{cIdx + 1}] {cite.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Citation Overlay Detail Modal */}
      {activeCitation && (
        <div className="absolute inset-0 bg-slate-950/20 dark:bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setActiveCitation(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Citation Reference</h4>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate mb-1">
              Source: {activeCitation.title}
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/85 rounded-xl">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                "{activeCitation.snippet}"
              </p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                {activeCitation.type}
              </span>
              <button 
                onClick={() => setActiveCitation(null)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Chat Input Bar */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            placeholder={isAiResponding ? "AI is generating a response..." : "Ask questions about your uploaded documents..."}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={isAiResponding}
            className="w-full pl-4 pr-12 py-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!messageText.trim() || isAiResponding}
            className="absolute right-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow shadow-indigo-500/10 transition-colors disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-800"
          >
            {isAiResponding ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </form>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center flex items-center justify-center gap-1">
          <Info className="w-3.5 h-3.5" />
          Supports real-time socket broadcasting sync across all connected clients.
        </p>
      </div>

    </div>
  );
}
