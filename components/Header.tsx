
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">BizCard AI</h1>
        </div>
        <div className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
          Gemini 3
        </div>
      </div>
    </header>
  );
};

export default Header;
