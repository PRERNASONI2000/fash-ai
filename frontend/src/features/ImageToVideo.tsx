// ImageToVideo.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { runGeneration } from "../lib/fashnService";
import { Upload, Video, Loader2, X, Play, Plus, Image as ImageIcon } from "lucide-react";

// File to Base64 helper
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// ✅ Exact Video Credit Calculation from Docs
const calculateCredits = (duration: number, res: string) => {
  const creditMap: Record<number, Record<string, number>> = {
    5: { "480p": 1, "720p": 3, "1080p": 6 },
    10: { "480p": 2, "720p": 6, "1080p": 12 },
  };
  return creditMap[duration]?.[res] || 6;
};

export function ImageToVideo() {
  const navigate = useNavigate();
  // Input States
  const [image, setImage] = useState<string>("");
  const [endImage, setEndImage] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  
  // Setting States
  const [duration, setDuration] = useState<number>(5);
  const [resolution, setResolution] = useState<string>("1080p");

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]); // Will hold MP4 URLs

  // Live Credit Calculation
  const estimatedCredits = calculateCredits(duration, resolution);

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
    if (!image) {
      setError("Please upload a start image.");
      return;
    }
    
    // Constraint check from docs
    if (endImage && resolution !== "1080p") {
      setError("End Image is only supported with 1080p resolution.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const inputs: Record<string, any> = {
        image: image,
        duration: duration,
        resolution: resolution,
        prompt: prompt || undefined, // Docs say leave empty for best results
        end_image: endImage || undefined,
      };

      const data = await runGeneration("image-to-video", inputs);
      
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
      setError(err instanceof Error ? err.message : "Failed to generate video");
    } finally {
      setLoading(false);
    }
  };

  // Reusable Image Upload Box Component
  const ImageBox = ({ label, icon: Icon, image, onRemove, onUpload }: any) => (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
      <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-[#b5652a]" /> {label}
      </label>
      
      {image ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 group">
          <img src={image} alt="Preview" className="w-full h-full object-contain bg-zinc-100 dark:bg-zinc-800 p-2" />
          <button onClick={onRemove} className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md">
            <X className="w-4 h-4"/>
          </button>
        </div>
      ) : (
        <label className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg cursor-pointer hover:border-[#b5652a] transition-colors bg-zinc-50 dark:bg-zinc-800/50">
          <Plus className="w-8 h-8 text-zinc-400 mb-2" />
          <span className="text-sm text-zinc-400 font-medium">Click to Upload</span>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, onUpload)} className="hidden" />
        </label>
      )}
    </div>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f2eee6] to-[#faf9f7] dark:from-[#121212] dark:to-[#1a1a1a] transition-colors duration-300 flex flex-col">
      
      {/* Header */}
      <div className="pt-8 pb-4 text-center border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#b5652a] to-[#d97a40]">
            <Video className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#b5652a] to-[#d97a40] bg-clip-text text-transparent">
            Image to Video
          </h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Turn a single image into a 5-10 second motion clip</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto w-full">
        
        {/* LEFT SIDE: Inputs & Settings */}
        <div className="lg:w-1/2 flex flex-col gap-5 overflow-y-auto pb-4">
          
          {/* Start Image (Required) */}
          <ImageBox 
            label="Start Image (Required)" 
            icon={Upload}
            image={image} 
            onRemove={() => removeImage(setImage)} 
            onUpload={setImage} 
          />

          {/* End Image (Optional) */}
          <div className="space-y-2">
            <ImageBox 
              label="End Image (Optional - Final Frame)" 
              icon={ImageIcon}
              image={endImage} 
              onRemove={() => removeImage(setEndImage)} 
              onUpload={setEndImage} 
            />
            {endImage && resolution !== "1080p" && (
              <p className="text-xs text-red-500 pl-1">⚠️ End image only works with 1080p resolution.</p>
            )}
          </div>

          {/* Prompt (Optional) */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1 block">
              Motion Guidance (Optional)
            </label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Leave empty for automatic motion, or short instruction like 'raising hand to touch face'"
              rows={2}
              className="w-full border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 rounded-md p-3 text-sm focus:ring-1 focus:ring-[#b5652a] outline-none resize-none"
            />
          </div>

          {/* Video Settings */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 border-b pb-2 mb-3">Video Settings</h3>
            
            {/* Duration */}
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">Duration</label>
              <div className="flex gap-2">
                {[5, 10].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setDuration(sec)}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all border ${
                      duration === sec 
                        ? "bg-[#b5652a] text-white border-[#b5652a] shadow-md" 
                        : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-[#b5652a]"
                    }`}
                  >
                    {sec} Seconds
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">Resolution</label>
              <div className="flex gap-2">
                {['480p', '720p', '1080p'].map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all border ${
                      resolution === res 
                        ? "bg-[#b5652a] text-white border-[#b5652a] shadow-md" 
                        : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-[#b5652a]"
                    }`}
                  >
                    {res.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Video Results */}
        <div className="lg:w-1/2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col min-h-[500px] relative">
          
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/90 flex flex-col items-center justify-center z-10 rounded-xl backdrop-blur-sm">
              <Loader2 className="w-12 h-12 text-[#b5652a] animate-spin mb-4" />
              <p className="font-medium text-zinc-800 dark:text-white">Generating video...</p>
              <p className="text-sm text-zinc-500 mt-1">This may take 1-2 minutes</p>
            </div>
          )}

          <div className="p-4 border-b dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-semibold text-zinc-800 dark:text-white">Output Video</h3>
            {results.length > 0 && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">1 Video Ready</span>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex items-center justify-center">
            {results.length > 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-black rounded-lg overflow-hidden border border-zinc-700">
                {/* ✅ HTML5 Video Player */}
                <video 
                  key={results[0]} // Force remount on new URL
                  controls 
                  className="w-full h-full object-contain"
                  autoPlay
                >
                  <source src={results[0]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Download Button for MP4 */}
                <a 
                  href={results[0]} 
                  download="fashn-video.mp4" 
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 px-4 py-2 bg-[#b5652a] text-white rounded-lg text-sm font-medium hover:bg-[#a05520] transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> Download MP4
                </a>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                <Video className="w-12 h-12 mb-2 opacity-20"/>
                <p className="text-sm">Video will appear here</p>
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
            disabled={loading || !image}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#b5652a] to-[#d97a40] text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>Generate Video <Video className="w-4 h-4" /></>
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