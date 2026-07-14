import { useState, useEffect } from 'react';
import ThemeToggle from './components/ThemeToggle.jsx';
import SourceManager from './components/SourceManager.jsx';
import Chat from './components/Chat.jsx';
import { Sparkles, Activity } from 'lucide-react';
import './App.css';

function App() {
  const [serverMessage, setServerMessage] = useState('Connecting to Express backend...');
  const [isConnected, setIsConnected] = useState(false);
  
  // Shared state for knowledge sources
  const [sources, setSources] = useState([]);

  useEffect(() => {
    // Fetch Express backend status
    fetch('http://localhost:5001/api/hello')
      .then((res) => res.json())
      .then((data) => {
        setServerMessage(data.message);
        setIsConnected(true);
      })
      .catch((err) => {
        setServerMessage('Could not reach Express backend at http://localhost:5001');
        setIsConnected(false);
        console.error(err);
      });
  }, []);

  const handleAddSource = (newSource) => {
    setSources((prev) => [...prev, newSource]);
  };

  const handleDeleteSource = (id) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Universal Sticky Top Bar */}
      <header className="sticky top-0 z-20 w-full px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
        
        {/* Branding */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-none m-0">
              KnowledgeGPT
            </h1>
            <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-0.5 leading-none">
              AI Assistant
            </p>
          </div>
        </div>

        {/* Action Controls & Badges */}
        <div className="flex items-center gap-3.5">
          
          <div 
            title={serverMessage}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all duration-300 ${
              isConnected 
                ? 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                : 'bg-rose-500/5 text-rose-600 dark:text-rose-400 border-rose-500/20'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-500' : 'text-rose-500 animate-pulse'}`} />
            <span>Backend Status: {isConnected ? 'Online' : 'Offline'}</span>
          </div>

          {/* Theme Switcher Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-grow flex flex-col md:flex-row h-[calc(100vh-65px)] overflow-hidden">
        
        {/* Left Side Panel: Source Management */}
        <section className="w-full md:w-[35%] lg:w-[30%] shrink-0 h-auto md:h-full overflow-y-auto">
          <SourceManager 
            sources={sources} 
            onAddSource={handleAddSource} 
            onDeleteSource={handleDeleteSource} 
          />
        </section>

        {/* Right Side Panel: Conversational AI chat */}
        <section className="w-full md:w-[65%] lg:w-[70%] flex flex-col h-[550px] md:h-full overflow-hidden">
          <Chat sources={sources} />
        </section>

      </main>
    </div>
  );
}

export default App;
