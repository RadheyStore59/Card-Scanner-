
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

    // Fix: Explicitly type fileList as File[] to avoid 'unknown' issues in mapping
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
    <div className="flex flex-col items-center justify-center space-y-8 p-8 min-h-[60vh]">
      <div className="w-full max-w-sm aspect-square relative bg-white rounded-3xl border-4 border-dashed border-gray-200 flex flex-col items-center justify-center transition-all hover:border-indigo-300 hover:bg-indigo-50 group cursor-pointer" onClick={triggerInput}>
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-xl font-semibold text-gray-800">Scan Cards</p>
        <p className="text-sm text-gray-500 mt-2 text-center px-4">Tap to capture or upload images of business cards</p>
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
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Supported by Gemini 3 Flash</p>
        <p className="text-sm text-gray-500 mt-2">Our AI automatically extracts names, emails, phones, and more from multiple cards at once.</p>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-24 h-24 relative">
             <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-2">Analyzing Cards...</h2>
          <p className="text-gray-500 max-w-xs">Gemini is extracting high-quality structured contact data from your images.</p>
        </div>
      )}
    </div>
  );
};

export default CameraScanner;
