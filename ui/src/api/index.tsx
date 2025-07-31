import { useEffect, useState } from 'react'
import axios from 'axios'

axios.defaults.headers.common['X-API-KEY'] = '921748d0-02ee-429f-a16d-dfce8775722e'
axios.defaults.baseURL = 'https://api.nookipedia.com'

const useAxios = (url:string) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setloading] = useState(true);

  const fetchData = () => {
      axios
          .get(url)
          .then((res) => {
              setResponse(res.data);
          })
          .catch((err) => {
              setError(err instanceof Error ? err.message : 'An error occurred');
          })
          .finally(() => {
              setloading(false);
          });
  };

  useEffect(() => {
      fetchData();
  });

  // custom hook returns value
  return { response, error, loading };
};

export const useFishApi = () => {
  return useAxios('/nh/fish');
}

export const useBugApi = () => {
  return useAxios('/nh/bugs');
}

export const useSeaCreatureApi = () => {
  return useAxios('/nh/sea');
}

// Generic hook for data caching with localStorage
export const useData = (url: string, cacheKey: string) => {
  const [response, setResponse] = useState<unknown>(null);
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