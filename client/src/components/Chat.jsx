import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [nickname, setNickname] = useState(() => {
    // Generate a random nickname on load
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `User_${randomNum}`;
  });
  const [tempNickname, setTempNickname] = useState(nickname);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState(1);

  const messagesEndRef = useRef(null);

  // Connect to the socket server
  useEffect(() => {
    // Express / Socket.io server runs on port 5001 in our configuration
    const socketInstance = io('http://localhost:5001', {
      transports: ['websocket'], // force WebSocket transport
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
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !socket) return;

    // Send the message details to the server
    socket.emit('chat:message', {
      sender: nickname,
      text: messageText,
    });

    setMessageText('');
  };

  const handleSaveNickname = (e) => {
    e.preventDefault();
    if (tempNickname.trim()) {
      setNickname(tempNickname.trim());
      setIsEditingNickname(false);
    }
  };

  // Helper to generate consistent background colors for avatars based on user nickname
  const getAvatarColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-emerald-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-sky-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-fuchsia-500',
      'bg-pink-500',
      'bg-rose-500',
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  // Format date helper
  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4 md:px-0">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[650px] overflow-hidden backdrop-blur-md">
        
        {/* Chat Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                💬
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 m-0 text-left">KnowledgeGPT Room</h2>
              <p className="text-xs text-slate-400 text-left">
                {connected ? 'Real-time WebSocket active' : 'Disconnected, reconnecting...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Connection badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              connected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {connected ? 'Live' : 'Offline'}
            </div>

            {/* Active User counter */}
            <div className="px-3 py-1 rounded-full bg-slate-800/50 text-slate-300 border border-slate-700/50 text-xs font-semibold flex items-center gap-1.5">
              <span>👥</span>
              <span>{activeUsers} online</span>
            </div>
          </div>
        </div>

        {/* User Nickname Management */}
        <div className="bg-slate-900/50 border-b border-slate-800/50 px-6 py-3 flex items-center justify-between">
          {isEditingNickname ? (
            <form onSubmit={handleSaveNickname} className="flex gap-2 w-full max-w-sm">
              <input
                type="text"
                value={tempNickname}
                onChange={(e) => setTempNickname(e.target.value)}
                placeholder="Enter Nickname..."
                maxLength={20}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 flex-grow"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setTempNickname(nickname);
                  setIsEditingNickname(false);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs px-3 py-1.5 rounded-lg transition"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Chatting as:</span>
                <span className="font-semibold text-sm text-indigo-400">{nickname}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingNickname(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
              >
                Change Nickname
              </button>
            </div>
          )}
        </div>

        {/* Message Thread Area */}
        <div className="flex-grow p-6 overflow-y-auto bg-slate-900/30 flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
              <span className="text-4xl">👋</span>
              <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSelf = msg.sender === nickname;
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 max-w-[80%] ${
                    isSelf ? 'self-end flex-row-reverse' : 'self-start'
                  }`}
                >
                  {/* User Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md ${getAvatarColor(msg.sender)}`}>
                    {msg.sender.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex flex-col gap-1">
                    {/* Header info (Name and time) */}
                    <div className={`flex items-center gap-2 px-1 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs font-semibold text-slate-300">{msg.sender}</span>
                      <span className="text-[10px] text-slate-500">{formatTime(msg.timestamp)}</span>
                    </div>

                    {/* Bubble */}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words whitespace-pre-wrap ${
                        isSelf
                          ? 'bg-indigo-600 text-white rounded-br-none font-medium'
                          : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/50'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Panel */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800/80">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={connected ? "Type a message..." : "Connecting to server..."}
              disabled={!connected}
              className="bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 flex-grow disabled:opacity-55 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!connected || !messageText.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Send</span>
              <span>🚀</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
