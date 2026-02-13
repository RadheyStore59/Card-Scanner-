
import React, { useRef } from 'react';
import Button from './Button';

interface CameraScannerProps {
  onImagesCaptured: (images: string[]) => void;
  isLoading: boolean;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onImagesCaptured, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    const readers = fileList.map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(onImagesCaptured);
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-10 p-8 min-h-[70vh]">
      <div 
        className="w-full max-w-sm aspect-[4/5] relative bg-white rounded-[40px] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center transition-all hover:border-indigo-400 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 group cursor-pointer shadow-xl shadow-gray-100/50" 
        onClick={triggerInput}
      >
        <div className="w-24 h-24 bg-indigo-50 rounded-[30px] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-inner">
          <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="text-center space-y-2">
          <p className="text-2xl font-black text-gray-900 tracking-tight">Radhey Scan</p>
          <p className="text-sm text-gray-400 font-medium px-10">Capture or upload business cards to begin extraction</p>
        </div>
        
        <div className="mt-8 flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full">
           <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span>Ready to Extract</span>
        </div>

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          capture="environment"
          className="hidden"
        />
      </div>

      <div className="text-center max-w-xs">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <div className="h-px w-8 bg-gray-200"></div>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">AI Powered Engine</p>
          <div className="h-px w-8 bg-gray-200"></div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Proprietary AI instantly transforms card images into high-accuracy contact records ready for Sheets or Email.
        </p>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300">
          <div className="w-28 h-28 relative">
             <div className="absolute inset-0 border-[6px] border-indigo-50 rounded-[35px]"></div>
             <div className="absolute inset-0 border-[6px] border-indigo-600 rounded-[35px] border-t-transparent animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mt-10 mb-3 tracking-tight">Radhey AI Analyzing...</h2>
          <div className="space-y-1">
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Optimizing Extraction</p>
            <p className="text-gray-400 text-sm max-w-[200px] mx-auto">Formatting structured contact data for your review.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraScanner;
