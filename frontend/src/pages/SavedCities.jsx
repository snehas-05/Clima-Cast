import { useState, useEffect } from 'react';
import WeatherCard from '../components/cards/WeatherCard';
import Button from '../components/ui/Button';
import api from '../services/api';
import { useWeather } from '../hooks/useWeather';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

export default function SavedCities() {
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { fetchWeather } = useWeather();

  const fetchUserCities = async () => {
    try {
      setLoading(true);
      const [favRes, histRes] = await Promise.all([
        api.get('/user/favorites'),
        api.get('/user/history')
      ]);
      setFavorites(favRes.data.favorites || []);
      setHistory(histRes.data.history || []);
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCities();
  }, []);

  const handleAddCity = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setAdding(true);
      // Validate city first by fetching weather
      const weather = await fetchWeather({ city: searchQuery });
      if (weather) {
        await api.post('/user/favorites', { city: weather.city });
        setSearchQuery('');
        fetchUserCities();
      }
    } catch (err) {
      console.error('Error adding city:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveFavorite = async (city) => {
    try {
      await api.delete(`/user/favorites?city=${city}`);
      setFavorites(favorites.filter(f => f.city !== city));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass-topbar h-20 px-6 lg:px-[var(--spacing-container-padding)] flex justify-between items-center">
        <form onSubmit={handleAddCity} className="flex items-center flex-1 max-w-2xl">
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-full py-2.5 pl-12 pr-4 text-body-main focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/60"
              placeholder="Search for a city to add..."
              disabled={adding}
            />
          </div>
        </form>
        <div className="flex items-center gap-6 ml-8">
          <div className="hidden sm:flex gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-primary-container/10 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-primary-container/10 transition-colors">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
          <Button variant="solid" size="sm" className="hidden sm:flex" onClick={handleAddCity} loading={adding}>
            ADD CITY
          </Button>
        </div>
      </header>

      <section className="p-6 lg:p-[var(--spacing-container-padding)] flex-1 max-w-[1440px] mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-h2-dashboard text-on-surface">Saved Cities</h2>
            <p className="text-body-main text-on-surface-variant">
              Real-time monitoring of your primary climate interests.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-surface-container-highest text-primary">
              <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">format_list_bulleted</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-card-gap)]">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-64 glass-card rounded-3xl animate-pulse" />)
          ) : (
            <>
              {favorites.map((fav, i) => (
                <WeatherCard 
                  key={i} 
                  city={fav.city}
                  country={fav.country}
                  temperature={fav.temperature}
                  condition={fav.condition}
                  weatherIcon={fav.icon}
                  ml_available={fav.ml_available}
                  gradientClass={fav.gradient}
                  onRemove={() => handleRemoveFavorite(fav.city)} 
                />
              ))}

              <div 
                onClick={() => document.querySelector('input').focus()}
                className="glass-card bg-white/40 border-dashed border-2 border-outline-variant/50 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[220px] hover:border-primary/50 cursor-pointer group transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">add</span>
                </div>
                <p className="mt-4 text-body-main text-on-surface-variant font-medium">Add New City</p>
              </div>
            </>
          )}
        </div>

        {/* Search History Row */}
        {!loading && history.length > 0 && (
          <div className="mt-12">
            <h3 className="text-label-caps text-on-surface-variant mb-4">Recent Searches</h3>
            <div className="flex flex-wrap gap-3">
              {history.map((item, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setSearchQuery(item.city);
                    handleAddCity();
                  }}
                  className="px-4 py-2 bg-surface-container-low rounded-full text-sm font-medium text-on-surface hover:bg-primary/10 hover:text-primary border border-outline-variant/30 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] opacity-60">history</span>
                  {item.city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Climate Mission Insights */}
        <div className="mt-12 glass-card rounded-3xl p-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-xl">
              <h3 className="text-h3-card-title text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                AI Personalization Summary
              </h3>
              <p className="text-body-main text-on-surface-variant mt-2 leading-relaxed">
                Based on your saved cities, we've identified a {favorites.some(f => f.ml_available) ? 'high' : 'moderate'} correlation with active storm tracks. ML-powered alerts are now optimized for your selected global regions.
              </p>
              <div className="flex gap-4 mt-6">
                <Button variant="solid" size="sm" className="hover:scale-105">ANALYZE SAVED REGIONS</Button>
                <Button variant="ghost" size="sm">DISMISS</Button>
              </div>
            </div>
            <div className="flex-shrink-0 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 shadow-lg min-w-[200px]">
              <div className="flex items-center gap-4 mb-4">
                <span className="material-symbols-outlined text-primary">monitoring</span>
                <span className="text-label-caps text-primary">COVERAGE</span>
              </div>
              <div className="text-4xl font-bold text-on-surface">
                {favorites.length > 0 ? Math.round((favorites.filter(f => f.ml_available).length / favorites.length) * 100) : 0}%
              </div>
              <p className="text-[10px] text-label-caps text-on-surface-variant mt-1">AI Prediction Readiness</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
