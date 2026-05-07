import { useState } from 'react';
import WeatherCard from '../components/cards/WeatherCard';
import Button from '../components/ui/Button';

const initialCities = [
  {
    id: 1,
    city: 'San Francisco',
    country: 'UNITED STATES',
    temperature: '72°',
    condition: 'Mostly Sunny',
    weatherIcon: 'sunny',
    iconColor: 'text-tertiary-container',
    gradientClass: 'weather-gradient-sunny',
    trendPath: 'M0 35 Q 25 30, 50 20 T 100 5',
  },
  {
    id: 2,
    city: 'London',
    country: 'UNITED KINGDOM',
    temperature: '14°',
    condition: 'Heavy Storms',
    weatherIcon: 'thunderstorm',
    iconColor: 'text-primary',
    gradientClass: 'weather-gradient-storm',
    trendPath: 'M0 5 Q 25 25, 50 35 T 100 38',
  },
  {
    id: 3,
    city: 'Tokyo',
    country: 'JAPAN',
    temperature: '22°',
    condition: 'Overcast',
    weatherIcon: 'cloud',
    iconColor: 'text-on-surface-variant',
    gradientClass: 'weather-gradient-cloudy',
    trendPath: 'M0 20 Q 25 15, 50 20 T 100 20',
  },
  {
    id: 4,
    city: 'Sydney',
    country: 'AUSTRALIA',
    temperature: '28°',
    condition: 'Clear Skies',
    weatherIcon: 'wb_sunny',
    iconColor: 'text-tertiary-container',
    gradientClass: 'weather-gradient-sunny',
    trendPath: 'M0 35 Q 30 25, 60 15 T 100 5',
  },
  {
    id: 5,
    city: 'Paris',
    country: 'FRANCE',
    temperature: '18°',
    condition: 'Partly Cloudy',
    weatherIcon: 'filter_drama',
    iconColor: 'text-on-surface-variant',
    gradientClass: 'weather-gradient-cloudy',
    trendPath: 'M0 25 Q 25 35, 50 15 T 100 20',
  },
];

export default function SavedCities() {
  const [cities, setCities] = useState(initialCities);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRemove = (id) => {
    setCities(cities.filter(c => c.id !== id));
  };

  return (
    <>
      {/* TopBar-like specific header for this page */}
      <header className="sticky top-0 z-40 glass-topbar h-20 px-6 lg:px-[var(--spacing-container-padding)] flex justify-between items-center">
        <div className="flex items-center flex-1 max-w-2xl">
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
            />
          </div>
        </div>
        <div className="flex items-center gap-6 ml-8">
          <div className="hidden sm:flex gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-primary-container/10 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-primary-container/10 transition-colors">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
          <Button variant="solid" size="sm" className="hidden sm:flex">
            GET STARTED
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
          {cities.map((city) => (
            <WeatherCard key={city.id} {...city} onRemove={() => handleRemove(city.id)} />
          ))}

          {/* Add New City Card */}
          <div className="glass-card bg-white/40 border-dashed border-2 border-outline-variant/50 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[220px] hover:border-primary/50 cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">add</span>
            </div>
            <p className="mt-4 text-body-main text-on-surface-variant">Add New City</p>
          </div>
        </div>

        {/* Climate Mission Insights */}
        <div className="mt-12 glass-card rounded-3xl p-8 overflow-hidden relative">
          <img
            alt="Global Weather Map"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDB7dUpBcVhJueYvpaJOIDNVCtcu68t2UFO2HBHbYDENiSqxyFIuBvT_Nnr9_JtsvjU0WOTPe6jGNYaS2BhPwi7Ak_8d83Mt2k1tNIfl7pE-_rSIv60d-npRnsrNtWPRqd0VtO0tpIHbaF61JMQlbECS3T-1d4sIyloDDMElzV_5PxGjpKYyFAsYSg7XGK0TleJC98KOYfQaeIVr5dnPNd91eSDqvJVC_ZLBntvE8hJKvuvXV8xKJ9RwSYFgwffREEI-GcLDPFMtIGl"
          />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-xl">
              <h3 className="text-h3-card-title text-on-surface">Climate Mission Insights</h3>
              <p className="text-body-main text-on-surface-variant mt-2">
                Our AI predictions show a 12% increase in cooling requirements for your saved European cities this month. Plan accordingly for energy efficiency.
              </p>
              <div className="flex gap-4 mt-6">
                <Button variant="solid" size="sm" className="hover:scale-105">READ REPORT</Button>
                <Button variant="ghost" size="sm">DISMISS</Button>
              </div>
            </div>
            <div className="flex-shrink-0 bg-white/50 p-6 rounded-2xl backdrop-blur-xl border border-white/50 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="material-symbols-outlined text-primary">eco</span>
                <span className="text-label-caps text-primary">SUSTAINABILITY INDEX</span>
              </div>
              <div className="text-4xl font-bold text-on-surface">84/100</div>
              <p className="text-[10px] text-label-caps text-on-surface-variant mt-1">Above Average Performance</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
