import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const PreferencesContext = createContext();

export const usePreferences = () => useContext(PreferencesContext);

export const PreferencesProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [preferences, setPreferences] = useState({
    theme: localStorage.getItem('theme') || 'dark',
    unit: localStorage.getItem('unit') || 'celsius',
    showConfidence: localStorage.getItem('showConfidence') !== 'false',
    reduceAtmospheric: localStorage.getItem('reduceAtmospheric') === 'true'
  });

  // Load preferences from backend on mount or when user logs in
  useEffect(() => {
    const fetchPreferences = async () => {
      if (token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/settings/preferences`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
            const serverPrefs = response.data.preferences;
            const updatedPrefs = {
              theme: serverPrefs.theme,
              unit: serverPrefs.unit,
              showConfidence: serverPrefs.show_confidence,
              reduceAtmospheric: serverPrefs.reduce_atmospheric || false
            };
            setPreferences(updatedPrefs);
            
            // Sync to localStorage
            localStorage.setItem('theme', updatedPrefs.theme);
            localStorage.setItem('unit', updatedPrefs.unit);
            localStorage.setItem('showConfidence', updatedPrefs.showConfidence);
            localStorage.setItem('reduceAtmospheric', updatedPrefs.reduceAtmospheric);
          }
        } catch (error) {
          console.error("Failed to load preferences from server", error);
        }
      }
    };

    fetchPreferences();
  }, [token]);

  const savePreferences = async (newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    
    // Local persistence
    if (newPrefs.theme) localStorage.setItem('theme', newPrefs.theme);
    if (newPrefs.unit) localStorage.setItem('unit', newPrefs.unit);
    if (newPrefs.showConfidence !== undefined) localStorage.setItem('showConfidence', newPrefs.showConfidence);
    if (newPrefs.reduceAtmospheric !== undefined) localStorage.setItem('reduceAtmospheric', newPrefs.reduceAtmospheric);
    
    // Server persistence
    if (token) {
      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/settings/preferences`, {
          theme: updated.theme,
          unit: updated.unit,
          show_confidence: updated.showConfidence,
          reduce_atmospheric: updated.reduceAtmospheric
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Failed to sync preferences to server", error);
      }
    }
  };

  const updateTheme = (theme) => savePreferences({ theme });
  const updateUnit = (unit) => savePreferences({ unit });
  const updateConfidence = (showConfidence) => savePreferences({ showConfidence });
  const updateAtmospheric = (reduceAtmospheric) => savePreferences({ reduceAtmospheric });
  
  return (
    <PreferencesContext.Provider value={{ ...preferences, updateTheme, updateUnit, updateConfidence, updateAtmospheric }}>
      {children}
    </PreferencesContext.Provider>
  );
};
