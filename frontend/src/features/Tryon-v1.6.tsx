// TryonV16.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { runGeneration } from "../lib/fashnService";
import { Upload, Shirt, User, Loader2, X, Download, Plus, Zap } from "lucide-react";

// File to Base64 helper
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// ✅ Fixed Credits: 1 credit per output image (as per docs)
const calculateCredits = (numSamples: number) => {
  return 1 * numSamples;
};

export function TryonV16() {  
  const navigate = useNavigate();
  // Input States
  const [modelImage, setModelImage] = useState<string>("");
  const [garmentImage, setGarmentImage] = useState<string>("");
  
  // Setting States (Specific to v1.6)
  const [category, setCategory] = useState("auto");
  const [segmentationFree, setSegmentationFree] = useState(true);
  const [moderationLevel, setModerationLevel] = useState("permissive");
  const [garmentPhotoType, setGarmentPhotoType] = useState("auto");
  const [mode, setMode] = useState("balanced");
  const [numSamples, setNumSamples] = useState<number>(1);

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
  const estimatedCredits = calculateCredits(numSamples);

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: Function) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setter(base64); 
    }
  };

  // Remove Handlers
  const removeImage = (setter: Function) => setter("");

    // Generate Function
  const handleGenerate = async () => {
    if (!modelImage || !garmentImage) {
      setError("Both Model and Garment images are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const inputs: Record<string, any> = {
        model_image: modelImage,
        garment_image: garmentImage,
        category: category,
        segmentation_free: segmentationFree,
        moderation_level: moderationLevel,
        garment_photo_type: garmentPhotoType,
        mode: mode,
        num_samples: numSamples,
        output_format: "png"
      };

      const data = await runGeneration("tryon-v1.6", inputs);
      
      if (Array.isArray(data.output)) {
        setResults(data.output);
      } else if (data.output) {
        setResults([data.output]);
      } else {
        throw new Error("No output received from API");
      }

    } catch (err: any) {
      if (err.message === 'UPGRADE_REQUIRED') {
        navigate('/subscriptions'); 
        return;
      }
      let errorMessage = "Failed to generate try-on";
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else {
        try {
          const parsed = JSON.parse(JSON.stringify(err));
          errorMessage = parsed?.message || parsed?.error || JSON.stringify(parsed);
        } catch (e) {
          errorMessage = String(err);
        }
      }
      
      setError(errorMessage);
    } finally {
      // ✅ Ye line missing thi isliye syntax error aa raha tha
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
      link.download = `fashn-tryon-v16.${exportFormat}`;
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

  // Reusable Image Upload Box Component
  const ImageBox = ({ label, icon: Icon, image, onRemove, onUpload }: any) => (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
      <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-[#b5652a]" /> {label}
      </label>
      
      {image ? (
        <div className="relative w-full h-56 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 group">
          <img src={image} alt="Preview" className="w-full h-full object-contain bg-zinc-100 dark:bg-zinc-800 p-2" />
          <button onClick={onRemove} className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md">
            <X className="w-4 h-4"/>
          </button>
        </div>
      ) : (
        <label className="w-full h-56 flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg cursor-pointer hover:border-[#b5652a] transition-colors bg-zinc-50 dark:bg-zinc-800/50">
          <Plus className="w-8 h-8 text-zinc-400 mb-2" />
          <span className="text-sm text-zinc-400 font-medium">Click to Upload</span>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, onUpload)} className="hidden" />
        </label>
      )}
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
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#b5652a] to-[#d97a40] bg-clip-text text-transparent">
            Try-On v1.6
          </h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Fast & lightweight e-commerce virtual try-on (1 Credit/Image)</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto w-full">
        
        {/* LEFT SIDE */}
        <div className="lg:w-1/2 flex flex-col gap-5 overflow-y-auto pb-4">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Model Image Box */}
            <ImageBox 
              label="Model Image" 
              icon={User}
              image={modelImage} 
              onRemove={() => removeImage(setModelImage)} 
              onUpload={setModelImage} 
            />

            {/* Garment Image Box */}
            <ImageBox 
              label="Garment Image" 
              icon={Shirt}
              image={garmentImage} 
              onRemove={() => removeImage(setGarmentImage)} 
              onUpload={setGarmentImage} 
            />
          </div>

          {/* Advanced Settings Grid */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 border-b pb-2 mb-3">Advanced Settings</h3>
            
            {/* Category */}
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">Garment Category</label>
              <SettingToggle 
                options={[
                  { label: "Auto", value: "auto" },
                  { label: "Tops", value: "tops" },
                  { label: "Bottoms", value: "bottoms" },
                  { label: "One-Pieces", value: "one-pieces" },
                ]} 
                current={category} 
                setter={setCategory} 
              />
            </div>

            {/* Segmentation Free Toggle */}
            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg">
              <div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Segmentation Free</p>
                <p className="text-xs text-zinc-500">Better for bulkier garments</p>
              </div>
              <button 
                onClick={() => setSegmentationFree(!segmentationFree)}
                className={`relative w-11 h-6 rounded-full transition-colors ${segmentationFree ? 'bg-[#b5652a]' : 'bg-zinc-300 dark:bg-zinc-600'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${segmentationFree ? 'translate-x-5' : ''}`}></span>
              </button>
            </div>

            {/* Moderation Level */}
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">Moderation Level</label>
              <SettingToggle 
                options={[
                  { label: "Conservative", value: "conservative" },
                  { label: "Permissive", value: "permissive" },
                  { label: "None", value: "none" },
                ]} 
                current={moderationLevel} 
                setter={setModerationLevel} 
              />
            </div>

            {/* Garment Photo Type */}
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">Garment Photo Type</label>
              <SettingToggle 
                options={[
                  { label: "Auto", value: "auto" },
                  { label: "Flat-Lay", value: "flat-lay" },
                  { label: "On Model", value: "model" },
                ]} 
                current={garmentPhotoType} 
                setter={setGarmentPhotoType} 
              />
            </div>

            {/* Mode (Performance, Balanced, Quality) */}
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">Speed / Quality Mode</label>
              <SettingToggle 
                options={[
                  { label: "Performance (5s)", value: "performance" },
                  { label: "Balanced (8s)", value: "balanced" },
                  { label: "Quality (15s)", value: "quality" },
                ]} 
                current={mode} 
                setter={setMode} 
              />
            </div>

            {/* Number of Samples (1 to 4) */}
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">Number of Samples</label>
              <SettingToggle 
                options={[
                  { label: "1 Image", value: 1 },
                  { label: "2 Images", value: 2 },
                  { label: "3 Images", value: 3 },
                  { label: "4 Images", value: 4 },
                ]} 
                current={numSamples} 
                setter={setNumSamples} 
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Results */}
        <div className="lg:w-1/2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col min-h-[500px] relative">
          
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/90 flex flex-col items-center justify-center z-10 rounded-xl backdrop-blur-sm">
              <Loader2 className="w-12 h-12 text-[#b5652a] animate-spin mb-4" />
              <p className="font-medium text-zinc-800 dark:text-white">Generating try-on...</p>
              <p className="text-sm text-zinc-500 mt-1">Fast v1.6 processing...</p>
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
                <p className="text-sm">Results will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Run Bar */}
      <div className="sticky bottom-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Estimated Cost: <span className="font-bold text-[#b5652a]">{estimatedCredits} Credit(s)</span>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !modelImage || !garmentImage}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#b5652a] to-[#d97a40] text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>Run Try-On v1.6 <Zap className="w-4 h-4" /></>
            )}
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