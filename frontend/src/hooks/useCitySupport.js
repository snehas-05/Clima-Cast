import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useCitySupport() {
  const [inModel, setInModel] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkSupport = useCallback(async (city) => {
    if (!city) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/check-city`, {
        params: { city }
      });
      setInModel(response.data.supported);
    } catch (err) {
      console.error("City support check failed:", err);
      setInModel(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return { inModel, loading, checkSupport };
}
