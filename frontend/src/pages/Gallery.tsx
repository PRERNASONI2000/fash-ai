//src/pages/Gallery.tsx
import { useState, useEffect } from "react";
import { fetchHistory } from "../lib/fashnService";
import { Image as ImageIcon, Loader2, Download, X, Play } from "lucide-react";

export function Gallery() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Export Modal States
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportImageUrl, setExportImageUrl] = useState<string>("");
  const [exportFormat, setExportFormat] = useState("png");
  const [exportQuality, setExportQuality] = useState(95);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();
        if (data.history && data.history.length > 0) {
          setHistory(data.history);
        }
      } catch (err) {
        console.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

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
      link.download = `fashn-export.${exportFormat}`;
      link.click();
    };
  };

  const openExportModal = (url: string) => {
    setExportImageUrl(url);
    setIsExportOpen(true);
  };

  // ✅ HELPER FUNCTION: Check if URL is a video
  const isVideo = (url: string) => {
    return url.endsWith('.mp4') || url.endsWith('.webm');
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f2eee6] to-[#faf9f7] dark:from-[#121212] dark:to-[#1a1a1a] transition-colors duration-300 flex flex-col">
      
      {/* EXPORT IMAGE MODAL */}
      {isExportOpen && !isVideo(exportImageUrl) && (
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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#b5652a] to-[#d97a40] bg-clip-text text-transparent">
          Generation Gallery
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">All your past AI generations</p>
      </div>

      {/* Gallery Area */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 mt-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#b5652a] mb-4" />
            <p className="font-medium">Loading gallery...</p>
          </div>
        ) : history.length > 0 ? (
          
         <>
          <div className="flex flex-wrap gap-4">
            
            {history.map((item) => 
              item.output.map((url: string, imgIdx: number) => (
                <div 
                  key={`${item._id}-${imgIdx}`} 
                  className="relative w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-12.8px)] aspect-[3/4] group rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                >
                  {/* ✅ CONDITIONAL RENDERING: Video ya Image */}
                  {isVideo(url) ? (
                    <video 
                      src={url} 
                      className="w-full h-full object-cover" 
                      muted 
                      playsInline
                      onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseOut={(e) => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }}
                    />
                  ) : (
                    <img 
                      src={url} 
                      alt={`Result ${imgIdx + 1}`} 
                      className="w-full h-full object-contain p-1" 
                    />
                  )}

                  {/* HOVER OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3">
                    
                    <div className="flex justify-end">
                      {isVideo(url) ? (
                        // ✅ VIDEO DOWNLOAD BUTTON
                        <a 
                          href={url} 
                          download="fashn-video.mp4" 
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white/90 dark:bg-zinc-900/90 p-2 rounded-full shadow-lg hover:scale-110 transition-transform border border-zinc-200 dark:border-zinc-700"
                        >
                          <Download className="w-4 h-4 text-[#b5652a]"/>
                        </a>
                      ) : (
                        // IMAGE EXPORT BUTTON
                        <button 
                          onClick={() => openExportModal(url)} 
                          className="bg-white/90 dark:bg-zinc-900/90 p-2 rounded-full shadow-lg hover:scale-110 transition-transform border border-zinc-200 dark:border-zinc-700"
                        >
                          <Download className="w-4 h-4 text-[#b5652a]"/>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="self-start bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-sm">
                        {item.model_name?.replace(/-/g, ' ')}
                      </span>
                      
                      {/* ✅ PLAY ICON FOR VIDEOS */}
                      {isVideo(url) && (
                        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                           <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ))
            )}
          </div></>

        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 mt-20">
            <ImageIcon className="w-20 h-20 mb-4 stroke-1" />
            <p className="text-xl font-medium">No History Found</p>
            <p className="text-sm mt-2">Generate something from the Studio first!</p>
          </div>
        )}
      </div>
    </section>
  );
}