
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Radhey</h1>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest leading-none">Cards Scanner</p>
          </div>
        </div>
        <div className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md border border-indigo-100 uppercase tracking-tighter">
          Gemini 3 Pro
        </div>
      </div>
    </header>
  );
};

export default Header;
