'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Users, Target, ShieldAlert, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';

interface SearchResult {
  id: string;
  type: 'Pilgrim' | 'Location' | 'Incident' | 'Journey';
  title: string;
  subtitle: string;
  href: string;
  score: number;
}

const MOCK_INDEX: SearchResult[] = [
  { id: '1', type: 'Pilgrim', title: 'Ramesh Kumar', subtitle: 'ID: PIL-88992', href: '/account/manage-pilgrims', score: 0.9 },
  { id: '2', type: 'Location', title: 'Ramkund Ghat', subtitle: 'Sector 4A', href: '/account/smart-snan', score: 0.8 },
  { id: '3', type: 'Incident', title: 'Family Separation - Lost Child (7y)', subtitle: 'INC-103', href: '/government/iccc', score: 0.95 },
  { id: '4', type: 'Journey', title: 'Mahakumbh Main Snan', subtitle: 'Reg: JR-998811', href: '/account/manage-tour', score: 0.7 },
  { id: '5', type: 'Location', title: 'Trimbakeshwar Temple', subtitle: 'Sector 2B', href: '/account/smart-darshan', score: 0.85 },
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = MOCK_INDEX.filter(item => 
      item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
    ).sort((a, b) => b.score - a.score);
    setResults(filtered);
  }, [query]);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(href);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'Pilgrim': return <Users size={16} className="text-blue-500" />;
      case 'Location': return <MapPin size={16} className="text-green-500" />;
      case 'Incident': return <ShieldAlert size={16} className="text-red-500" />;
      case 'Journey': return <Target size={16} className="text-purple-500" />;
      default: return <Search size={16} />;
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors border border-gray-200"
      >
        <Search size={14} />
        <span className="text-xs font-semibold hidden sm:inline-block">Search...</span>
        <kbd className="hidden sm:inline-block text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-gray-300 ml-2">⌘K</kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-start justify-center pt-[10vh]">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          {/* Modal */}
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <Search size={20} className="text-gray-400 mr-3 shrink-0" />
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search across journeys, pilgrims, incidents, locations..."
                className="flex-1 bg-transparent border-none outline-none text-base font-semibold text-gray-800 placeholder:text-gray-400"
              />
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 bg-gray-100 rounded-md">
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query && results.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  <p className="font-semibold text-sm">No results found for "{query}"</p>
                  <p className="text-xs mt-1">Try searching for ID, name, or entity type.</p>
                </div>
              )}
              {results.length > 0 && (
                <div className="p-2 space-y-1">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result.href)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-indigo-50 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                          {getIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{result.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded",
                              result.type === 'Pilgrim' ? 'bg-blue-100 text-blue-700' :
                              result.type === 'Location' ? 'bg-green-100 text-green-700' :
                              result.type === 'Incident' ? 'bg-red-100 text-red-700' :
                              'bg-purple-100 text-purple-700'
                            )}>
                              {result.type}
                            </span>
                            <span className="text-xs text-gray-500 font-semibold truncate">{result.subtitle}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>
              )}
              {!query && (
                <div className="px-4 py-8">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Suggested Searches</h4>
                  <div className="flex flex-wrap gap-2 px-2">
                    <span onClick={() => setQuery('Lost Child')} className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full cursor-pointer transition-colors border border-gray-200">Lost Child</span>
                    <span onClick={() => setQuery('Ramkund')} className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full cursor-pointer transition-colors border border-gray-200">Ramkund</span>
                    <span onClick={() => setQuery('PIL-')} className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full cursor-pointer transition-colors border border-gray-200">Pilgrim ID</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-medium shrink-0">
              <span className="flex items-center gap-1">Powered by <span className="font-bold text-gray-700">AI Unified Index</span></span>
              <span className="hidden sm:inline-flex items-center gap-1">Use <kbd className="bg-gray-200 px-1 py-0.5 rounded text-gray-600">↑↓</kbd> to navigate, <kbd className="bg-gray-200 px-1 py-0.5 rounded text-gray-600">Enter</kbd> to select</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
