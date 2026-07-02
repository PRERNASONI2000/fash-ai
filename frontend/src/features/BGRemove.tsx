// src/features/BGRemove.tsx
// Feature page for background removal
// TODO: Integrate with backend API for background removal at /api/bg-remove

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { runGeneration } from "../lib/fashnService";
import { Upload, Sparkles, Image as ImageIcon, Loader2, X, Download, Eraser } from "lucide-react";

// File to Base64 helper
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export function BackgroundRemove() {
  const navigate = useNavigate();
  // Input State (Sirf ek image)
  const [sourceImage, setSourceImage] = useState<string>("");
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);

  // Export Modal States
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportImageUrl, setExportImageUrl] = useState<string>("");
  const [exportFormat, setExportFormat] = useState("png"); // Transparent ke liye PNG best hai
  const [exportQuality, setExportQuality] = useState(100);

  // Fixed Credit
  const estimatedCredits = 1;

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setSourceImage(base64);
    }
  };

  // Generate Function
  const handleGenerate = async () => {
    if (!sourceImage) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const inputs: Record<string, any> = {
        image: sourceImage // API ko 'image' key chahiye is model mein
      };

      const data = await runGeneration("background-remove", inputs);
      
      if (Array.isArray(data.output)) {
        setResults(data.output);
      } else if (data.output) {
        setResults([data.output]);
      } else {
        throw new Error("No output received from API");
      }

    } catch (err) {
      if (err.message === 'UPGRADE_REQUIRED') {
        navigate('/subscriptions'); 
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to remove background");
    } finally {
      setLoading(false);
    }
  };

  // Export & Download Logic
  const handleExportDownload = () => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = exportImageUrl;
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      
      const mimeType = exportFormat === 'jpg' ? 'image/jpeg' : `image/${exportFormat}`;
      const qualityFraction = exportQuality / 100;
      
      const dataUrl = canvas.toDataURL(mimeType, qualityFraction);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `fashn-nobg.${exportFormat}`;
      link.click();
    };
  };

  const openExportModal = (url: string) => {
    setExportImageUrl(url);
    setIsExportOpen(true);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f2eee6] to-[#faf9f7] dark:from-[#121212] dark:to-[#1a1a1a] transition-colors duration-300 flex flex-col">
       
       {/* EXPORT IMAGE MODAL */}
      {isExportOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsExportOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800"><X className="w-5 h-5"/></button>
            <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Export Image</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 block">Format</label>
                <div className="grid grid-cols-4 gap-2">
                  {['webp', 'original', 'jpg', 'png'].map(fmt => (
                    <button key={fmt} onClick={() => setExportFormat(fmt)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-all ${exportFormat === fmt ? 'bg-[#b5652a] text-white border-[#b5652a]' : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'}`}>
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 block">Quality: {exportQuality}%</label>
                <input type="range" min="10" max="100" value={exportQuality} onChange={(e) => setExportQuality(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#b5652a]" />
              </div>

              <button onClick={handleExportDownload}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#b5652a] to-[#d97a40] text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-8 pb-4 text-center border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#b5652a] to-[#d97a40]">
            <Eraser className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#b5652a] to-[#d97a40] bg-clip-text text-transparent">
            Background Remove
          </h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Remove backgrounds instantly in 1 credit</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto w-full">
        
        {/* LEFT SIDE: Input */}
        <div className="lg:w-1/2 flex flex-col gap-5 overflow-y-auto pb-4">
          
          {/* Image Upload */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-[#b5652a]" /> Source Image (Required)
            </label>
            <div className="relative border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg h-64 flex items-center justify-center hover:border-[#b5652a] transition-colors cursor-pointer bg-zinc-50 dark:bg-zinc-800/50">
              {sourceImage ? (
                <img src={sourceImage} alt="Source" className="h-full object-contain p-2" />
              ) : (
                <div className="text-center text-zinc-400">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Drop image or click to upload</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <input 
              type="text" 
              placeholder="Or paste image URL here..." 
              onChange={(e) => setSourceImage(e.target.value)}
              className="mt-2 w-full text-sm border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 rounded-md p-2 focus:ring-1 focus:ring-[#b5652a] outline-none"
            />
          </div>
        </div>

        {/* RIGHT SIDE: Results Display */}
        <div className="lg:w-1/2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col min-h-[500px] relative">
          
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/90 flex flex-col items-center justify-center z-10 rounded-xl backdrop-blur-sm">
              <Loader2 className="w-12 h-12 text-[#b5652a] animate-spin mb-4" />
              <p className="font-medium text-zinc-800 dark:text-white">Removing background...</p>
              <p className="text-sm text-zinc-500 mt-1">This takes ~3 seconds</p>
            </div>
          )}

          <div className="p-4 border-b dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-semibold text-zinc-800 dark:text-white">Transparent Output</h3>
            {results.length > 0 && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex items-center justify-center">
            {results.length > 0 ? (
              <div className="relative w-full h-full flex items-center justify-center group">
                {/* Checkerboard background for transparency visibility */}
                <div className="absolute inset-0 m-4 rounded-lg" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}></div>
                
                <img src={results[0]} alt="Result" className="relative z-10 max-h-full object-contain p-4" />
                
                {/* Download Button */}
                <button 
                  onClick={() => openExportModal(results[0])} 
                  className="absolute bottom-6 right-6 z-20 bg-white/90 dark:bg-zinc-900/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-zinc-200 dark:border-zinc-700"
                >
                  <Download className="w-5 h-5 text-[#b5652a]"/>
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                <Eraser className="w-16 h-16 mb-4 stroke-1" />
                <p className="text-lg font-medium">No result yet</p>
                <p className="text-sm">Upload an image and click Run</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Run Bar */}
      <div className="sticky bottom-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Fixed Cost: <span className="font-bold text-[#b5652a]">{estimatedCredits} Credit</span>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !sourceImage}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#b5652a] to-[#d97a40] text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>Remove Background <Eraser className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl text-sm font-medium">
          Error: {error}
        </div>
      )}
    </section>
  );
}