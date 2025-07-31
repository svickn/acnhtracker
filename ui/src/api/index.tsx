import { useEffect, useState } from 'react'
import axios from 'axios'
import type { ApiData, ApiResponse } from './types';

axios.defaults.headers.common['X-API-KEY'] = '921748d0-02ee-429f-a16d-dfce8775722e'
axios.defaults.baseURL = 'https://api.nookipedia.com'

// Generic hook for data caching with localStorage
export const useData = (url: string, cacheKey: string):ApiData => {
  const [response, setResponse] = useState<ApiResponse[] | null | undefined>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check localStorage first
        const cachedData = localStorage.getItem(cacheKey);
        
        if (cachedData) {
          // Use cached data if it exists
          setResponse(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        // Only fetch from API if no cache or expired
        const res = await axios.get(url);
        const data = res.data;
        
        // Store in localStorage
        localStorage.setItem(cacheKey, JSON.stringify(data));
        
        setResponse(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, [url, cacheKey]);

  return { response, error, loading };
};

// Hook for fish data with localStorage caching
export const useFishData = () => {
  return useData('/nh/fish', 'fishData');
};

// Hook for bug data with localStorage caching
export const useBugData = () => {
  return useData('/nh/bugs', 'bugData');
};

// Hook for sea creature data with localStorage caching
export const useSeaCreatureData = () => {
  return useData('/nh/sea', 'seaCreatureData');
};