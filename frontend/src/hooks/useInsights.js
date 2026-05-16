import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useInsights(city) {
  const [insights, setInsights] = useState([]);
  const [riskScore, setRiskScore] = useState(0);
  const [trend, setTrend] = useState('stable');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async (targetCity) => {
    if (!targetCity) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/insights/summary', {
        params: { city: targetCity }
      });

      if (response.data) {
        setInsights(response.data.insights || []);
        setRiskScore(response.data.risk_score || 0);
        setTrend(response.data.overall_trend || 'stable');
      }
    } catch (err) {
      console.error("Intelligence fetch error:", err);
      setError("Failed to load climate intelligence.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (city) {
      fetchInsights(city);
    }
  }, [city, fetchInsights]);

  return { insights, riskScore, trend, loading, error, refresh: () => fetchInsights(city) };
}
