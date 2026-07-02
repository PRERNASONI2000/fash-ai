import { useState } from "react";
import { runGeneration } from "../lib/fashnService";

export function GenerateModel() {
  // 1. Local state ka use karein (fetcher ki jagah)
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modelImage = "https://cm7xvlqw96.ufs.sh/f/wXFHUNfTHmLj9QTMwFWT5IXsA4Lhru0e7dJiKFwpQ6Glm28S";
  const garmentImage = "https://utfs.io/f/wXFHUNfTHmLjtkhepmqOUnkr8XxZbNIFmRWldShDLu320TeC";

  // 2. Simple async function, fetcher nahi
  const handleTryOn = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await runGeneration(modelImage, { garmentImage });
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.output);
      }
    } catch (err) {
      setError("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-7xl">
          <div className="flex flex-col items-center gap-4">
            <img src={garmentImage} alt="Garment Image" />
            Garment Image
          </div>

          <div className="flex flex-col items-center gap-4">
            <img src={modelImage} alt="Model Image" />
            Model Image
          </div>

          <div className="flex flex-col items-center gap-4 col-span-2 md:col-span-1">
            <div className="flex items-center justify-center gap-4 w-full h-full min-h-[300px] md:min-h-auto bg-gray-200 text-black">
              {result && <img src={result} alt="Result Image" />}
              {error && <p className="text-red-500">{error}</p>}
              {loading && <p>Loading...</p>}
            </div>
            Result Image
          </div>
        </div>

        <div className="flex gap-4 items-center justify-end flex-col sm:flex-row w-full">
          <button
            disabled={loading}
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            onClick={handleTryOn}
          >
            {loading ? "Generating..." : "Virtual Try-On"}
          </button>
        </div>
      </main>
    </div>
  );
}