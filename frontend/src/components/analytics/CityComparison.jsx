import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartContainer from '../charts/ChartContainer';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function CityComparison() {
  const [city1, setCity1] = useState('Mumbai');
  const [city2, setCity2] = useState('Delhi');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [supportedCities, setSupportedCities] = useState([]);

  useEffect(() => {
    // Fetch supported cities for autocomplete
    api.get('/weather/supported-cities')
      .then(res => setSupportedCities(res.data.cities || []))
      .catch(err => console.error(err));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/analytics/compare?city1=${city1}&city2=${city2}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSwap = () => {
    setCity1(city2);
    setCity2(city1);
  };

  if (loading && !data) return <div className="glass-card h-[500px] animate-pulse rounded-3xl" />;

  const chartData = data?.city1?.monthly_data.map((m, i) => ({
    name: monthNames[i],
    [city1]: m.avg_temp,
    [city2]: data.city2?.monthly_data[i]?.avg_temp
  }));

  const StatCard = ({ title, val1, val2, unit = "" }) => (
    <div className="bg-surface-container-low p-6 rounded-2xl border border-white/50">
      <p className="text-label-caps text-on-surface-variant mb-4">{title}</p>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-primary font-bold uppercase">{city1}</p>
          <p className="text-2xl font-bold text-on-surface">{val1}{unit}</p>
        </div>
        <div className="h-8 w-[1px] bg-outline-variant/30" />
        <div className="text-right">
          <p className="text-sm text-tertiary font-bold uppercase">{city2}</p>
          <p className="text-2xl font-bold text-on-surface">{val2}{unit}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-sm">location_on</span>
            <input 
                value={city1}
                onChange={(e) => setCity1(e.target.value)}
                placeholder="First City..."
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
        </div>
        
        <button 
            onClick={handleSwap}
            className="p-3 rounded-full bg-surface-container-high hover:bg-primary hover:text-white transition-all transform active:scale-90"
        >
            <span className="material-symbols-outlined">swap_horiz</span>
        </button>

        <div className="flex-1 w-full relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-tertiary text-sm">location_on</span>
            <input 
                value={city2}
                onChange={(e) => setCity2(e.target.value)}
                placeholder="Second City..."
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
        </div>

        <button 
            onClick={fetchData}
            className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
            Compare
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
            <ChartContainer title="Side-by-Side Monthly Temperature" className="h-full">
                <div className="h-[350px] w-full overflow-x-auto">
                    <div className="min-w-[600px] h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} unit="°C" />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                                <Legend />
                                <Bar dataKey={city1} fill="#6750a4" radius={[4, 4, 0, 0]} />
                                <Bar dataKey={city2} fill="#7E57C2" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </ChartContainer>
        </div>

        <div className="lg:col-span-4 space-y-4">
            <StatCard title="Annual Avg Temp" val1={data?.city1?.stats?.avg_temp.toFixed(1)} val2={data?.city2?.stats?.avg_temp.toFixed(1)} unit="°C" />
            <StatCard title="Total Rainfall" val1={data?.city1?.stats?.total_precip.toFixed(0)} val2={data?.city2?.stats?.total_precip.toFixed(0)} unit="mm" />
            <StatCard title="Avg Humidity" val1={data?.city1?.stats?.avg_humidity.toFixed(0)} val2={data?.city2?.stats?.avg_humidity.toFixed(0)} unit="%" />
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <p className="text-label-caps text-primary mb-2">Climate Verdict</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                    {city1} shows a {data?.city1?.stats?.avg_temp > data?.city2?.stats?.avg_temp ? 'warmer' : 'cooler'} average climate compared to {city2}, with {Math.abs(data?.city1?.stats?.total_precip - data?.city2?.stats?.total_precip).toFixed(0)}mm difference in annual precipitation.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
