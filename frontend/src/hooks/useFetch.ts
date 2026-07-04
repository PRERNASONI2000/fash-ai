// src/hooks/useFetch.ts
import { useEffect, useState } from 'react'


 const cache = new Map<string, any>();

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
     if (cache.has(url)) {
  setData(cache.get(url));
  setLoading(false);
  return;
}
    let isMounted = true // Prevents state update if component unmounts during fetch

    setLoading(true)
    setError(null)

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => {
        cache.set(url, json);

        if (isMounted) setData(json);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [url]);


  return { data, loading, error }
}