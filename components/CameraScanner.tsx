
import React, { useRef, useState } from 'react';
import Button from './Button';

interface CameraScannerProps {
  onImagesCaptured: (images: string[]) => void;
  isLoading: boolean;
}

const MAX_IMAGE_WIDTH = 1600;
const JPEG_QUALITY = 0.8;

const CameraScanner: React.FC<CameraScannerProps> = ({ onImagesCaptured, isLoading }) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isChoosing, setIsChoosing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Utility to resize and compress images using canvas
  const processImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if too large
        if (width > MAX_IMAGE_WIDTH) {
          height = (MAX_IMAGE_WIDTH / width) * height;
          width = MAX_IMAGE_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error("Canvas context failed"));

        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        resolve(compressedBase64);
      };
      img.onerror = reject;
      img.src = base64Str;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsChoosing(false);
    setIsProcessing(true);

    try {
      const fileList: File[] = Array.from(files);
      const rawBase64Strings = await Promise.all(
        fileList.map((file: File) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.readAsDataURL(file);
          });
        })
      );

      // Compress all images to ensure payload size is manageable for mobile networks/API limits
      const compressedStrings = await Promise.all(
        rawBase64Strings.map(str => processImage(str))
      );

      onImagesCaptured(compressedStrings);
    } catch (err) {
      console.error("Image processing failed:", err);
      alert("Error processing photos. Please try a different image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    cameraInputRef.current?.click();
  };

  const triggerGallery = (e: React.MouseEvent) => {
    e.stopPropagation();
    galleryInputRef.current?.click();
  };

  const showLoading = isLoading || isProcessing;

  return (
    <div className="flex flex-col items-center justify-center space-y-10 p-8 min-h-[70vh]">
      <div 
        className="w-full max-w-sm aspect-[4/5] relative bg-white rounded-[40px] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center transition-all hover:border-indigo-400 shadow-xl shadow-gray-100/50 overflow-hidden group" 
        onClick={() => !showLoading && setIsChoosing(true)}
      >
        {!isChoosing ? (
          <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-indigo-50 rounded-[30px] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-inner">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <p className="text-2xl font-black text-gray-900 tracking-tight">Radhey Scan</p>
              <p className="text-sm text-gray-400 font-medium px-10">Tap to start scanning business cards</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Select Source</h3>
            
            <button 
              onClick={triggerCamera}
              className="w-full py-5 px-4 bg-indigo-600 text-white rounded-2xl flex items-center space-x-4 active:scale-95 transition-transform shadow-lg shadow-indigo-100"
            >
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold">Capture from Camera</p>
                <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">Instant Scan</p>
              </div>
            </button>

            <button 
              onClick={triggerGallery}
              className="w-full py-5 px-4 bg-white border-2 border-indigo-100 text-indigo-700 rounded-2xl flex items-center space-x-4 active:scale-95 transition-transform"
            >
              <div className="bg-indigo-50 p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold">Upload from Gallery</p>
                <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest">Select Photos</p>
              </div>
            </button>

            <Button variant="ghost" className="mt-4 text-gray-400 font-bold text-xs uppercase" onClick={(e) => { e.stopPropagation(); setIsChoosing(false); }}>
              Cancel
            </Button>
          </div>
        )}

        <div className="absolute bottom-6 flex items-center space-x-2 text-indigo-600 font-bold text-[10px] uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full">
           <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span>Powered by Gemini</span>
        </div>

        {/* Hidden Inputs */}
        <input 
          type="file" 
          ref={cameraInputRef}
          onChange={handleFileChange}
          accept="image/*"
          capture="environment"
          className="hidden"
        />
        <input 
          type="file" 
          ref={galleryInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>

      <div className="text-center max-w-xs">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <div className="h-px w-8 bg-gray-200"></div>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">AI Extraction Engine</p>
          <div className="h-px w-8 bg-gray-200"></div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Proprietary AI instantly transforms card images into high-accuracy contact records.
        </p>
      </div>

      {showLoading && (
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
          <h2 className="text-2xl font-black text-gray-900 mt-10 mb-3 tracking-tight">
            {isProcessing ? "Processing Images..." : "Radhey AI Analyzing..."}
          </h2>
          <div className="space-y-1">
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest">
              {isProcessing ? "Optimizing for mobile" : "Optimizing Extraction"}
            </p>
            <p className="text-gray-400 text-sm max-w-[200px] mx-auto">Formatting structured contact data for your review.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraScanner;
