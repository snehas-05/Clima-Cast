import { useState, useEffect } from 'react';

export function useGPS() {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds timeout
      maximumAge: 0
    };

    const success = (position) => {
      setCoordinates({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      });
      setLoading(false);
    };

    const handleError = (err) => {
      if (err.code === 1) {
        setPermissionDenied(true);
      }
      setError(err.message);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, handleError, options);
  }, []);

  return { coordinates, loading, error, permissionDenied };
}
