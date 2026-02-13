
import React, { useState, useCallback, useEffect } from 'react';
import { Contact, AppView } from './types';
import Header from './components/Header';
import CameraScanner from './components/CameraScanner';
import ContactCard from './components/ContactCard';
import EmailDraft from './components/EmailDraft';
import Button from './components/Button';
import { extractBusinessCards } from './services/geminiService';
import { exportToCSV } from './utils/exportUtils';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('SCAN');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasKey, setHasKey] = useState<boolean>(true); // Default true, check on mount

  useEffect(() => {
    const checkKey = async () => {
      // If the environment variable isn't set, check if the user has selected one via AI Studio
      if (!process.env.API_KEY || process.env.API_KEY === "undefined") {
        if (window.aistudio) {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } else {
          // If not in AI Studio and no env key, we might be in trouble, 
          // but we'll let the service try and fail gracefully.
          setHasKey(false);
        }
      }
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Per instructions, assume success immediately after triggering openSelectKey
      setHasKey(true);
    }
  };

  const handleImagesCaptured = useCallback(async (images: string[]) => {
    setIsLoading(true);
    try {
      const extracted = await extractBusinessCards(images);
      setContacts(prev => [...prev, ...extracted]);
      setView('REVIEW');
    } catch (error: any) {
      console.error("Extraction error:", error);
      
      // Handle specific key errors by prompting for re-selection
      if (error.message?.includes("Requested entity was not found") || 
          error.message?.includes("API_KEY_INVALID") ||
          error.message?.includes("API Key is missing")) {
        setHasKey(false);
        alert("Please select a valid API key from a paid project to continue.");
      } else {
        alert("Extraction failed: " + (error.message || "Please check your connection and try again."));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteContact = (id: string) => {
    if (window.confirm("Remove this contact?")) {
      setContacts(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleExport = () => {
    if (contacts.length === 0) return;
    exportToCSV(contacts);
    alert("Exported to CSV! Ready for Google Sheets.");
  };

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto shadow-2xl">
        <div className="w-20 h-20 bg-indigo-50 rounded-[30px] flex items-center justify-center mb-8 text-indigo-600">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Connect to Gemini</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          To extract data from business cards, you need to link a Gemini API key. Please select a key from a <strong>paid GCP project</strong>.
        </p>
        <Button variant="primary" size="lg" className="w-full py-4 shadow-xl shadow-indigo-100" onClick={handleConnectKey}>
          Connect API Key
        </Button>
        <p className="mt-6 text-xs text-gray-400">
          Required for high-accuracy AI extraction. 
          <br />
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline">
            View Billing Documentation
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      <Header />
      
      <main className="flex-1 overflow-y-auto">
        {view === 'SCAN' && (
          <CameraScanner 
            onImagesCaptured={handleImagesCaptured} 
            isLoading={isLoading} 
          />
        )}

        {view === 'REVIEW' && (
          <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Scanned Contacts ({contacts.length})</h2>
              <Button variant="ghost" size="sm" onClick={() => setView('SCAN')}>
                + New Scan
              </Button>
            </div>
            
            {contacts.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                </div>
                <p className="text-gray-400 font-medium">Capture your first card</p>
                <Button variant="primary" size="sm" className="mt-4" onClick={() => setView('SCAN')}>
                  Start Scanning
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 pb-12">
                {contacts.map(contact => (
                  <ContactCard 
                    key={contact.id} 
                    contact={contact} 
                    onUpdate={updateContact}
                    onDelete={deleteContact}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'EMAIL' && (
          <EmailDraft contacts={contacts} onBack={() => setView('REVIEW')} />
        )}
      </main>

      {view === 'REVIEW' && contacts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-40 max-w-md mx-auto shadow-2xl">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={handleExport} className="flex items-center justify-center py-3.5 font-bold">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Export CSV
            </Button>
            <Button variant="primary" onClick={() => setView('EMAIL')} className="flex items-center justify-center py-3.5 font-bold">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Bulk Email
            </Button>
          </div>
        </div>
      )}

      {view === 'REVIEW' && (
        <button 
          onClick={() => setView('SCAN')}
          className="fixed bottom-24 right-4 w-14 h-14 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-all z-40 hover:bg-indigo-700 md:hidden border-4 border-white"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
        </button>
      )}
    </div>
  );
};

export default App;
