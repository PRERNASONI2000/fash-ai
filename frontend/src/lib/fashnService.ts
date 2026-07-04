// src/lib/fashnService.ts
// import { getAuth } from 'firebase/auth';
// export async function runGeneration(modelImage: string, garmentImage: string) {
//   const response = await fetch("http://localhost:5000/api/fashn-tryon", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ modelImage, garmentImage }),
//   });
//   return await response.json();
// }

const API_URL = import.meta.env.VITE_API_URL

let historyCache: any = null;


// Credits check karne ka function
export async function checkCredits() {
  const response = await fetch(`${API_URL}/api/fashn/credits`);
  if (!response.ok) throw new Error("Failed to fetch credits");
  return await response.json();
}

// History fetch karne ka function
export async function fetchHistory() {
  // Cache available hai to wahi return karo
  if (historyCache) {
    return historyCache;
  }

  const response = await fetch(`${API_URL}/api/fashn/history`, {
    headers: {
      ...(localStorage.getItem("token") && {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
    },
  });

  if (!response.ok) throw new Error("Failed to fetch history");

  const data = await response.json();

  // Cache me save
  historyCache = data;

  return data;
}


export function clearHistoryCache() {
  historyCache = null;
}

// Latest result fetch karne ka function
export async function fetchLatestResult() {
  const response = await fetch(`${API_URL}/api/fashn/latest`, {
    headers: {
      ...(localStorage.getItem('token') && {  
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
  }
  });
  if (!response.ok) throw new Error("Failed to fetch latest result");
  return await response.json();
}

// Generalized generation function for both TryOn and ProductToModel
export async function runGeneration(
  modelName: string,
  inputs: Record<string, any> 
) {
  const response = await fetch(`${API_URL}/api/fashn/${modelName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(localStorage.getItem('token') && {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    },
    body: JSON.stringify(inputs),
  });

  const data = await response.json();

 if (!response.ok || data.error) {
  if (data.error === 'INSUFFICIENT_CREDITS') {
    throw new Error('UPGRADE_REQUIRED');
  }
  const errMsg = data.message || data.error?.message || (typeof data.error === 'string' ? data.error : null) || 'Generation failed';
  throw new Error(errMsg);
}

  clearHistoryCache();

  return data; // { success: true, output: ["url1", "url2"], credits_used: 2 }
}