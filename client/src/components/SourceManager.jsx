import { useState, useRef } from 'react';
import { 
  FileText, 
  Globe, 
  FileUp, 
  Trash2, 
  Plus, 
  Clock, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  FileCode
} from 'lucide-react';

export default function SourceManager({ sources, onAddSource, onDeleteSource }) {
  const [activeTab, setActiveTab] = useState('pdf');
  
  // Tab states
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);

  // Tab selections
  const tabs = [
    { id: 'pdf', label: 'PDF Upload', icon: FileUp },
    { id: 'url', label: 'Website URL', icon: Globe },
    { id: 'text', label: 'Text Input', icon: FileText },
  ];

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Process File upload
  const handleFiles = (filesList) => {
    const file = filesList[0];
    if (file.type !== "application/pdf") {
      setErrorMessage("Please upload a PDF file only.");
      return;
    }
    
    setErrorMessage("");
    setIsSubmitting(true);

    // Simulate file reading and uploading process
    const reader = new FileReader();
    reader.onload = (e) => {
      const textMock = e.target.result ? `Simulated content from PDF: ${file.name}` : "";
      
      // Simulate indexing latency
      setTimeout(() => {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const newSource = {
          id: `pdf-${Date.now()}`,
          title: file.name,
          type: 'pdf',
          content: textMock || `Content of PDF: ${file.name}. This is an indexed PDF containing structural documentation.`,
          status: 'indexed',
          size: `${sizeMB} MB`,
          date: new Date().toLocaleDateString(),
        };
        onAddSource(newSource);
        setIsSubmitting(false);
      }, 1500);
    };
    reader.readAsText(file);
  };

  // Process URL import
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    // Simple URL validation
    let formattedUrl = urlInput.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      new URL(formattedUrl);
    } catch {
      setErrorMessage("Please enter a valid website URL.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    // Simulate web crawler indexing
    setTimeout(() => {
      const urlObj = new URL(formattedUrl);
      const newSource = {
        id: `url-${Date.now()}`,
        title: urlObj.hostname + (urlObj.pathname.length > 1 ? urlObj.pathname : ""),
        type: 'url',
        content: `Simulated crawled website content from ${formattedUrl}. This webpage details terms of service, technical documentations, and general guidelines.`,
        status: 'indexed',
        size: formattedUrl,
        date: new Date().toLocaleDateString(),
      };
      onAddSource(newSource);
      setUrlInput('');
      setIsSubmitting(false);
    }, 1500);
  };

  // Process manual Text save
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textTitle.trim() || !textContent.trim()) {
      setErrorMessage("Please provide both a title and text content.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    setTimeout(() => {
      const newSource = {
        id: `text-${Date.now()}`,
        title: textTitle.trim(),
        type: 'text',
        content: textContent.trim(),
        status: 'indexed',
        size: `${textContent.trim().length} chars`,
        date: new Date().toLocaleDateString(),
      };
      onAddSource(newSource);
      setTextTitle('');
      setTextContent('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/70 dark:bg-slate-900/60 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FileCode className="w-5 h-5 text-indigo-500" />
          Knowledge Sources
        </h2>
        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
          {sources.length} active
        </span>
      </div>

      {/* Tabs list */}
      <div className="px-4 pt-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex space-x-1 p-1 bg-slate-200/60 dark:bg-slate-950/40 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setErrorMessage("");
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg transition-all-custom ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800">
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* Tab: PDF */}
        {activeTab === 'pdf' && (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all-custom flex flex-col items-center justify-center ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/10' 
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-100/30 dark:hover:bg-slate-800/10'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            {isSubmitting ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Uploading and indexing PDF...</p>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-3">
                  <FileUp className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Drag & drop PDF here
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  or click to upload from local machine
                </p>
              </>
            )}
          </div>
        )}

        {/* Tab: URL */}
        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="example.com/documentation"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-3 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !urlInput.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Import
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Scrapes content from public web URLs and indexes it directly into KnowledgeGPT.
            </p>
          </form>
        )}

        {/* Tab: Text Input */}
        {activeTab === 'text' && (
          <form onSubmit={handleTextSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Source Title (e.g. Project Notes)"
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
            />
            <textarea
              placeholder="Paste or write your raw custom knowledge content here..."
              rows={4}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none disabled:opacity-50"
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {textContent.trim().length} characters
              </span>
              <button
                type="submit"
                disabled={isSubmitting || !textTitle.trim() || !textContent.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Save Knowledge
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Sources List */}
      <div className="flex-grow overflow-y-auto p-5 space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          Indexed Documents
        </h3>

        {sources.length === 0 ? (
          <div className="text-center py-10 px-4">
            <p className="text-sm text-slate-400">No sources uploaded yet.</p>
            <p className="text-[11px] text-slate-400/80 mt-1">Upload a PDF, link a website, or paste text to build your knowledge base.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((source) => {
              const SourceIcon = source.type === 'pdf' ? FileText : (source.type === 'url' ? Globe : FileText);
              return (
                <div
                  key={source.id}
                  className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm hover:shadow transition-shadow flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      source.type === 'pdf' 
                        ? 'bg-rose-500/10 text-rose-500' 
                        : (source.type === 'url' ? 'bg-sky-500/10 text-sky-500' : 'bg-emerald-500/10 text-emerald-500')
                    }`}>
                      <SourceIcon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                        {source.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {source.date}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {source.size}
                        </span>
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          source.status === 'indexed'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : (source.status === 'failed' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400')
                        }`}>
                          {source.status === 'indexed' ? (
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                          )}
                          {source.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onDeleteSource(source.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150 self-start"
                    title="Delete source"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
