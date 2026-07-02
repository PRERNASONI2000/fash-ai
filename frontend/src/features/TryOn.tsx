// frontend/src/features/TryOn.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { runGeneration } from "../lib/fashnService";
import { Upload, Shirt, User, Loader2, X, Download, Plus, Sparkles } from "lucide-react";

// File to Base64 helper
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// ✅ Exact Credit Calculation for tryon-max (No 'fast' mode)
const calculateCredits = (mode: string, res: string, numImages: number, modelCount: number) => {
  const creditMap: Record<string, Record<string, number>> = {
    balanced: { "1k": 2, "2k": 3, "4k": 4 },
    quality: { "1k": 3, "2k": 4, "4k": 5 },
  };

  const baseCost = creditMap[mode]?.[res] || 2;
  // Multiply by num_images AND by how many model images are selected
  return baseCost * numImages * modelCount; 
};

export function TryOn() {
  const navigate = useNavigate();
  // Input States
  const [productImage, setProductImage] = useState<string>("");
  const [modelImages, setModelImages] = useState<string[]>([]); // ✅ Max 3 models
  const [prompt, setPrompt] = useState<string>("visualize how an outfit worn by one model looks on different model");
  
  // Setting States
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [resolution, setResolution] = useState("1k");
  const [generationMode, setGenerationMode] = useState("balanced"); // Default balanced for tryon-max
  const [numImages, setNumImages] = useState<number>(1);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);

  // Export Modal States
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportImageUrl, setExportImageUrl] = useState<string>("");
  const [exportFormat, setExportFormat] = useState("png");
  const [exportQuality, setExportQuality] = useState(95);

  // Live Credit Calculation
  const estimatedCredits = calculateCredits(generationMode, resolution, numImages, modelImages.length || 1);

  // Product Image Upload Handler
  const handleProductUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setProductImage(base64); 
    }
  };

  // Model Images Upload Handler
  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && modelImages.length < 3) {
      const base64 = await fileToBase64(file);
      setModelImages(prev => [...prev, base64]); 
    }
  };

  // Remove Handlers
  const removeProductImage = () => setProductImage("");
  const removeModelImage = (index: number) => {
    setModelImages(prev => prev.filter((_, i) => i !== index));
  };

  // Generate Function
  const handleGenerate = async () => {
    if (!productImage) {
      setError("Please upload a product image (garment).");
      return;
    }
    if (modelImages.length === 0) {
      setError("Please upload at least one model image.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const baseInputs: Record<string, any> = {
        product_image: productImage,
        prompt: prompt || undefined,
        aspect_ratio: aspectRatio,
        resolution: resolution,
        generation_mode: generationMode,
        num_images: numImages,
        output_format: "png"
      };

      let allOutputs: string[] = [];

      // ✅ Loop through each selected model image to see outfit on different models
      for (const modelImg of modelImages) {
        const inputs = { ...baseInputs, model_image: modelImg };
        const data = await runGeneration("tryon-max", inputs);
        
        if (Array.isArray(data.output)) {
          allOutputs = [...allOutputs, ...data.output];
        } else if (data.output) {
          allOutputs.push(data.output);
        }
      }

      if (allOutputs.length === 0) throw new Error("No output received");
      setResults(allOutputs);

    } catch (err) {
      if (err.message === 'UPGRADE_REQUIRED') {
        navigate('/subscriptions'); 
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to generate try-on");
    } finally {
      setLoading(false);
    }
  };

  // Export Logic
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
      link.download = `fashn-tryon.${exportFormat}`;
      link.click();
    };
  };

  const openExportModal = (url: string) => {
    setExportImageUrl(url);
    setIsExportOpen(true);
  };

  // Toggle Button Component
  const SettingToggle = ({ options, current, setter }: any) => (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt: any) => (
        <button
          key={opt.value}
          onClick={() => setter(opt.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
            current === opt.value 
              ? "bg-[#b5652a] text-white border-[#b5652a] shadow-md" 
              : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-[#b5652a]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f2eee6] to-[#faf9f7] dark:from-[#121212] dark:to-[#1a1a1a] transition-colors duration-300 flex flex-col">
       {/* EXPORT MODAL */}
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
            <Shirt className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#b5652a] to-[#d97a40] bg-clip-text text-transparent">
            Try-On Max
          </h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">AI fashion photoshoots with enhanced fidelity</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto w-full">
        
        {/* LEFT SIDE */}
        <div className="lg:w-1/2 flex flex-col gap-5 overflow-y-auto pb-4">
          
          {/* 1. Product Image (Single) */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 mb-3">
              <Shirt className="w-4 h-4 text-[#b5652a]" /> Product / Garment Image
            </label>
            
            {productImage ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 group">
                <img src={productImage} alt="Product" className="w-full h-full object-contain bg-zinc-100 dark:bg-zinc-800 p-2" />
                <button onClick={removeProductImage} className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"><X className="w-4 h-4"/></button>
              </div>
            ) : (
              <label className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg cursor-pointer hover:border-[#b5652a] transition-colors bg-zinc-50 dark:bg-zinc-800/50">
                <Plus className="w-8 h-8 text-zinc-400 mb-2" />
                <span className="text-sm text-zinc-400 font-medium">Upload Product</span>
                <input type="file" accept="image/*" onChange={handleProductUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* 2. Model Images (Max 3) */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-[#b5652a]" /> Model Images (Max 3)
            </label>
            <div className="flex gap-3 flex-wrap">
              {modelImages.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 group">
                  <img src={img} alt={`Model ${idx + 1}`} className="w-full h-full object-cover" />
                  <button onClick={() => removeModelImage(idx)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors"><X className="w-3 h-3"/></button>
                </div>
              ))}
              {modelImages.length < 3 && (
                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg cursor-pointer hover:border-[#b5652a] transition-colors bg-zinc-50 dark:bg-zinc-800/50">
                  <Plus className="w-6 h-6 text-zinc-400 mb-1" />
                  <span className="text-[10px] text-zinc-400 font-medium">Add Model</span>
                  <input type="file" accept="image/*" onChange={handleModelUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* 3. Active Prompt */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1 block">Instructions (Optional)</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. visualize how an outfit worn by one model looks on different model"
              rows={3}
              className="w-full border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 rounded-md p-3 text-sm focus:ring-1 focus:ring-[#b5652a] outline-none resize-none"
            />
          </div>

          {/* 4. Settings Grid */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 border-b pb-2 mb-3">Generation Settings</h3>
            
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">Aspect Ratio</label>
              <SettingToggle options={[{label:"1:1",value:"1:1"},{label:"2:3",value:"2:3"},{label:"3:2",value:"3:2"},{label:"3:4",value:"3:4"},{label:"4:3",value:"4:3"},{label:"4:5",value:"4:5"},{label:"5:4",value:"5:4"},{label:"9:16",value:"9:16"},{label:"16:9",value:"16:9"}]} current={aspectRatio} setter={setAspectRatio} />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">Resolution</label>
              <SettingToggle options={[{label:"1K",value:"1k"},{label:"2K",value:"2k"},{label:"4K",value:"4k"}]} current={resolution} setter={setResolution} />
            </div>

            {/* ✅ Only Balanced & Quality for tryon-max */}
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">Quality</label>
              <SettingToggle options={[{label:"Balanced",value:"balanced"},{label:"Quality",value:"quality"}]} current={generationMode} setter={setGenerationMode} />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">Images per Model</label>
              <SettingToggle options={[{label:"1 Image",value:1},{label:"2 Images",value:2},{label:"3 Images",value:3},{label:"4 Images",value:4}]} current={numImages} setter={setNumImages} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Results */}
        <div className="lg:w-1/2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col min-h-[500px] relative">
          
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/90 flex flex-col items-center justify-center z-10 rounded-xl backdrop-blur-sm">
              <Loader2 className="w-12 h-12 text-[#b5652a] animate-spin mb-4" />
              <p className="font-medium text-zinc-800 dark:text-white">Generating try-on...</p>
              <p className="text-sm text-zinc-500 mt-1">Applying to {modelImages.length} model(s)</p>
            </div>
          )}

          <div className="p-4 border-b dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-semibold text-zinc-800 dark:text-white">Output Results</h3>
            {results.length > 0 && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{results.length} Generated</span>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {results.length > 0 ? (
              <div className={`grid gap-4 h-full ${results.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {results.map((url, idx) => (
                  <div key={idx} className="relative bg-zinc-50 dark:bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-100 dark:border-zinc-700 group">
                    <img src={url} alt={`Result ${idx + 1}`} className="w-full h-full object-contain" />
                    <button onClick={() => openExportModal(url)} className="absolute bottom-3 right-3 bg-white/90 dark:bg-zinc-900/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-zinc-200 dark:border-zinc-700">
                      <Download className="w-5 h-5 text-[#b5652a]"/>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                <Shirt className="w-12 h-12 mb-2 opacity-20"/>
                <p className="text-sm">Try-on results will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Run Bar */}
      <div className="sticky bottom-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Estimated Cost: <span className="font-bold text-[#b5652a]">{estimatedCredits} Credits</span>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !productImage || modelImages.length === 0}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#b5652a] to-[#d97a40] text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            {loading ? <>Processing...</> : <>Run Try-On <Sparkles className="w-4 h-4" /></>}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl text-sm font-medium z-50">
          Error: {error}
        </div>
      )}
    </section>
  );
}