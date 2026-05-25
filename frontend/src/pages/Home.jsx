import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

const features = [
  { id: 'atmospheric-intelligence', icon: 'cloud', iconColor: 'text-secondary-forced dark:text-slate-300', title: 'Atmospheric Intelligence', description: 'Adaptive forecasting, historical grounding, and real-time environmental understanding powered by advanced climate models.' },
  { id: 'memory-processing', icon: 'history', iconColor: 'text-cyan-600 dark:text-cyan-400', title: 'Atmospheric Memory', description: 'Historical climate grounding from decades of environmental observations.' },
  { id: 'environmental-sync', icon: 'sensors', iconColor: 'text-cyan-600 dark:text-cyan-400', title: 'Live Environmental Sync', description: 'Real-time data integration for accurate and timely climate insights.' },
  { id: 'projection-modeling', icon: 'trending_up', iconColor: 'text-indigo-600 dark:text-indigo-400', title: 'Adaptive Forecasting', description: 'Intelligent models that adapt to micro-climate shifts and patterns.' },
];

const CARD_DETAILS = {
  'atmospheric-intelligence': {
    title: 'Atmospheric Intelligence',
    subtitle: 'Planetary Climate Modelling Engine',
    icon: 'cloud',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    tag: 'SYSTEM CORE',
    alert: 'Core engine online & calibrated',
    metric: 'Integrated Multi-Model Analysis',
    description: 'The foundation of Clima-Cast. Bypasses standard meteorology by integrating historical retrofitted datasets with geostationary orbit feeds and deep ML predictions. This cohesive engine parameters climate shift anomalies, dew point thresholds, and particulate dispersion indexes instantly.',
    highlights: [
      { label: 'Compute Core', value: 'Clima-Cast AI v3.2' },
      { label: 'Data Latency', value: '124ms Inference' },
      { label: 'System Efficacy', value: '92.4% Accuracy Mesh' }
    ],
    graphLabel: 'Neural Mesh Active Stream',
    graphValue: '124ms Latency verified',
    glowColor: 'from-blue-500/20 to-purple-500/20'
  },
  'historical-grounding': {
    title: 'Historical Grounding',
    subtitle: 'Climate Analytics Baseline',
    icon: 'history',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    tag: 'PAST SYSTEM',
    alert: 'Long-term baseline verification verified',
    metric: '40+ Year Retrospective Data',
    description: 'Bypasses standard meteorological bounds by compiling four decades of public and private atmospheric telemetry (NOAA, Copernicus, and NASA satellite sensors). Our engine maps past solar cycle shifts, baseline surface temperature anomalies, and precipitation variances to calibrate current climate trend lines against strict multi-decade control parameters.',
    highlights: [
      { label: 'Control Baseline', value: '1980-2020 Mean' },
      { label: 'Data Source count', value: '18 Global Satellites' },
      { label: 'Historical Accuracy', value: '99.4% Calibrated' }
    ],
    graphLabel: 'Mean Temperature Deviation (1990 - Present)',
    graphValue: '+1.18°C Planetary Deviation',
    glowColor: 'from-indigo-500/20 to-purple-500/20'
  },
  'live-sync': {
    title: 'Live Environmental Sync',
    subtitle: 'Real-Time Planetary Telemetry',
    icon: 'sensors',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    tag: 'PRESENT SYSTEM',
    alert: 'Active IoT data pipeline operational',
    metric: 'Real-Time Satellite Feed Enabled',
    description: 'Establishes high-frequency ingestion nodes that capture real-time weather and pollution readings from ground telemetry and geostationary orbit radiometers. This system aggregates moisture values, ozone layers, and air vectors every few seconds, feeding data directly to our rendering layout for unparalleled accuracy.',
    highlights: [
      { label: 'Ingestion Delay', value: '42 Milliseconds' },
      { label: 'Active Sensors', value: '412,000 Nodes' },
      { label: 'Throughput', value: '2.4 GB/sec Continuous' }
    ],
    graphLabel: 'Sensor Telemetry Response Efficacy',
    graphValue: '100% Sync Latency Satisfied',
    glowColor: 'from-cyan-500/20 to-teal-500/20'
  },
  'adaptive-forecasting': {
    title: 'Adaptive Forecasting',
    subtitle: 'Micro-Climate Neural Projections',
    icon: 'trending_up',
    iconColor: 'text-indigo-700 dark:text-blue-400',
    tag: 'FUTURE PATHWAYS',
    alert: 'Machine Learning Projection Path Stable',
    metric: 'LSTM Deep Modeling Active',
    description: 'Prophesies upcoming localized weather changes using advanced long short-term memory (LSTM) neural networks. Unlike standard fluid dynamics simulations, our adaptive model constantly recalibrates forecast predictions based on continuous micro-climate variations, giving you hyper-accurate forecasting layers for upcoming agricultural seasons.',
    highlights: [
      { label: 'ML Architecture', value: 'LSTM & Neural Mesh' },
      { label: 'Forecast Range', value: '7-Day Predictions' },
      { label: 'Recalibration rate', value: 'Hourly Inference' }
    ],
    graphLabel: 'ML Forecasting Error Margin Deviation',
    graphValue: 'Under 1.2% Error Rate',
    glowColor: 'from-blue-500/20 to-indigo-500/20'
  },
  'aqi': {
    title: 'Air Quality Index',
    subtitle: 'Atmospheric Particulate Analysis',
    icon: 'eco',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    tag: 'METRIC MONITOR',
    alert: 'Nominal - Safe atmospheric state',
    metric: '84 AQI (Moderate)',
    description: 'Continuous scanning of particulate matter concentrations reveals balanced atmospheric conditions. PM 2.5 particles are sitting stable at 28 micrograms per cubic meter, PM 10 at 56, with trace amounts of nitrogen dioxide. Ideal for outdoor training with negligible allergen levels.',
    highlights: [
      { label: 'PM 2.5 Concentration', value: '28 µg/m³' },
      { label: 'PM 10 Level', value: '56 µg/m³' },
      { label: 'Ozone Concentration', value: '32 ppb' }
    ],
    graphLabel: 'AQI Level 24h Trend',
    graphValue: 'Stable 84 - Light Breeze Clearing',
    glowColor: 'from-yellow-500/20 to-green-500/20'
  },
  'humidity': {
    title: 'Relative Humidity',
    subtitle: 'Atmospheric Water Density',
    icon: 'water_drop',
    iconColor: 'text-blue-500 dark:text-blue-400',
    tag: 'METRIC MONITOR',
    alert: 'Balanced saturation index',
    metric: '72% Relative Moisture',
    description: 'Dynamic hygroscopic calculations show optimal atmospheric water saturation at 72%. Ambient dew point coordinates register at 18 degrees Celsius. This indicates low physical strain profiles and clean moisture balance supporting robust organic flora transpirations.',
    highlights: [
      { label: 'Absolute Humidity', value: '14.2 g/m³' },
      { label: 'Dew Point', value: '18.4°C' },
      { label: 'Thermal Humidity Index', value: 'Comfortable' }
    ],
    graphLabel: 'Moisture Balance Curve',
    graphValue: '72% Equilibrium Maintained',
    glowColor: 'from-blue-500/20 to-cyan-500/20'
  },
  'wind': {
    title: 'Wind Speed & Vectors',
    subtitle: 'Dynamic Velocity Tracking',
    icon: 'air',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    tag: 'METRIC MONITOR',
    alert: 'Steady breeze vectors confirmed',
    metric: '12 km/h NNW Direction',
    description: 'Continuous anemometer arrays register consistent surface wind speed averages of 12 km/h coming from the North-Northwest. Generates excellent atmospheric circulation supporting organic pollination cycles and natural heat dissipation without crop stress.',
    highlights: [
      { label: 'Peak Wind Gusts', value: '18 km/h' },
      { label: 'Vector Angle', value: '342° NNW' },
      { label: 'Atmospheric Drag', value: 'Low Wind-Chill Impact' }
    ],
    graphLabel: 'Wind Vector Stability Pattern',
    graphValue: 'Steady 12 km/h - Low Turbulence',
    glowColor: 'from-cyan-500/20 to-indigo-500/20'
  },
  'pressure': {
    title: 'Barometric Pressure',
    subtitle: 'Atmospheric Pressure Gradients',
    icon: 'speed',
    iconColor: 'text-green-600 dark:text-green-400',
    tag: 'METRIC MONITOR',
    alert: 'Stable high-pressure dome',
    metric: '1012 hPa Barometric Reading',
    description: 'A robust high-pressure atmospheric column covers Tokyo. Measuring at 1012 hPa, this barometric dome is keeping micro-climates stable, suppressing rapid thermal cooling and preventing unpredictable cloud cluster formations.',
    highlights: [
      { label: 'Standard Deviation', value: '+1.2 hPa' },
      { label: 'Barometric Tendency', value: 'Rising (Fair Weather)' },
      { label: 'Sea Level Equivalence', value: '1013.25 hPa' }
    ],
    graphLabel: 'Atmospheric Column Pressures',
    graphValue: '1012 hPa - Strong Stability Dome',
    glowColor: 'from-green-500/20 to-teal-500/20'
  },
  'memory-processing': {
    title: 'Atmospheric Memory Processing',
    subtitle: 'Multi-Decade Data Ingestion',
    icon: 'memory',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    tag: 'ENGINE CORE',
    alert: 'Memory models synchronized',
    metric: 'Sub-second Data Analytics',
    description: 'Processes multi-decade planetary datasets in parallel, converting standard historical reports into high-resolution environmental timelines. Allows meteorologists and researchers to extract trend variations with a sub-second response time.',
    highlights: [
      { label: 'Telemetry records', value: '4.2 Billion Datapoints' },
      { label: 'Index Resolution', value: '10km Spatial Grids' },
      { label: 'Retrieval Speed', value: '< 18 Milliseconds' }
    ],
    graphLabel: 'Historical Retrospective Processing Time',
    graphValue: 'Optimized via Planetary Memory Nodes',
    glowColor: 'from-cyan-500/20 to-indigo-500/20'
  },
  'environmental-sync': {
    title: 'Live Environmental Synchronization',
    subtitle: 'WebSocket Ingestion Core',
    icon: 'sync',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    tag: 'ENGINE CORE',
    alert: 'Low-latency connections connected',
    metric: 'Real-Time Global Node Processing',
    description: 'Manages continuous communication lines to remote weather tracking arrays. When pressure, heat, or humidity shifts anywhere in the tracked zone, the dashboard updates immediately to ensure high predictive awareness.',
    highlights: [
      { label: 'IoT Endpoints', value: '88,000 Live Feeds' },
      { label: 'Frame Loss Rate', value: '0.00%' },
      { label: 'Protocols Active', value: 'gRPC & WebSocket' }
    ],
    graphLabel: 'Environmental Data Stream Integrity',
    graphValue: 'Continuous 100% Ingestion Reliability',
    glowColor: 'from-indigo-500/20 to-teal-500/20'
  },
  'projection-modeling': {
    title: 'Long-Term Projection Modeling',
    subtitle: 'Planetary Heat Pathways',
    icon: 'timeline',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    tag: 'ENGINE CORE',
    alert: 'Projection networks active',
    metric: 'Greenhouse Model Vectors',
    description: 'Applies neural machine learning algorithms to simulate global warming impact on micro-weather dynamics. Maps potential precipitation reductions and carbon pathways across a variety of global environmental policy scenarios.',
    highlights: [
      { label: 'Model Layers', value: '96 Transformer Blocks' },
      { label: 'Scenario Range', value: 'RCP 2.6, 4.5, and 8.5' },
      { label: 'Predictive Range', value: 'Up to 2050 Baseline' }
    ],
    graphLabel: 'Planetary Projection Modeling Convergence',
    graphValue: 'High Predictive Efficacy Validated',
    glowColor: 'from-purple-500/20 to-cyan-500/20'
  }
};

/**
 * ExpandedCardDetails
 * Highly compact atmospheric panel detail view for the expandable cards.
 * Prevents bloated accordion heights and displays micro-telemetry sparklines.
 */
function ExpandedCardDetails({ cardId, details, isReducedMotion }) {
  if (!details) return null;

  const isKpi = ['aqi', 'humidity', 'wind', 'pressure'].includes(cardId);
  const isTimeline = ['historical-grounding', 'live-sync', 'adaptive-forecasting'].includes(cardId);

  const animationProps = isReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 }
      }
    : {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: 'auto' },
        exit: { opacity: 0, height: 0 },
        transition: { type: 'spring', stiffness: 220, damping: 28, mass: 0.9 }
      };

  return (
    <motion.div
      {...animationProps}
      id={`expanded-details-${cardId}`}
      className="mt-6 pt-6 border-t border-slate-200/30 dark:border-slate-800/30 space-y-4 overflow-hidden text-left relative z-20"
    >
      {/* Header tags and collapse chevron */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-widest font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
            {details.tag}
          </span>
          <span className="text-[10px] font-light text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
            {details.alert}
          </span>
        </div>
        
        {/* Subtle rotate chevron collapse indicator */}
        <span className="material-symbols-outlined text-[14px] text-slate-400 dark:text-slate-500 select-none hover:text-indigo-500 transition-colors duration-200">
          keyboard_double_arrow_up
        </span>
      </div>

      {/* Dynamic Content */}
      {isKpi ? (
        // KPI card compact atmospheric details
        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[11px] font-light text-slate-400 dark:text-slate-500 uppercase tracking-wider">{details.subtitle}</span>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">
              <span className="material-symbols-outlined text-xs select-none">trending_flat</span>
              <span>Stable Equilibrium</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-600 dark:text-slate-400 font-light leading-relaxed">
            {details.description}
          </p>
          
          {/* Micro pulsing active indicator */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/30 animate-pulse" />
            <span className="text-[8px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">Telemetry Ingestion Node Active</span>
          </div>
        </div>
      ) : isTimeline ? (
        // Timeline card spatial expansion
        <div className="space-y-3.5">
          <div className="space-y-0.5">
            <div className="text-[9px] uppercase text-slate-400 dark:text-slate-500 tracking-wider font-semibold">{details.subtitle}</div>
            <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{details.metric}</div>
          </div>
          
          <p className="text-xs text-slate-600 dark:text-slate-400 font-light leading-relaxed">
            {details.description}
          </p>
          
          {/* Highlights sub-grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/40">
            {details.highlights.map((item, index) => (
              <div key={index} className="text-left sm:text-center">
                <div className="text-[8px] uppercase text-slate-400 dark:text-slate-500 tracking-wider font-semibold">{item.label}</div>
                <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Micro-sparkline waveform */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40 space-y-1.5">
            <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-light">
              <span>{details.graphLabel}</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{details.graphValue}</span>
            </div>
            <div className="h-6 w-full bg-slate-100/30 dark:bg-slate-950/20 rounded-md relative overflow-hidden flex items-end">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-cyan-500/5 to-indigo-500/5 opacity-60" />
              <div className="w-full h-full absolute inset-0 flex items-center justify-around pointer-events-none opacity-20">
                <div className="w-[1.5px] h-[30%] bg-indigo-500 rounded" />
                <div className="w-[1.5px] h-[50%] bg-cyan-500 rounded animate-pulse" />
                <div className="w-[1.5px] h-[75%] bg-cyan-400 rounded" />
                <div className="w-[1.5px] h-[40%] bg-indigo-500 rounded" />
                <div className="w-[1.5px] h-[60%] bg-purple-500 rounded animate-pulse" />
                <div className="w-[1.5px] h-[85%] bg-cyan-500 rounded" />
                <div className="w-[1.5px] h-[20%] bg-indigo-400 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Hero / Approach expandable panels
        <div className="space-y-4">
          <div className="bg-slate-100/40 dark:bg-slate-950/20 border border-slate-200/30 dark:border-slate-800/40 rounded-xl p-3 text-center">
            <div className="text-[9px] uppercase text-slate-500 dark:text-slate-400 tracking-widest font-semibold mb-0.5">Atmospheric Telemetry Baseline</div>
            <div className="text-lg font-light text-primary-forced dark:text-white tracking-tight">{details.metric}</div>
          </div>
          
          <p className="text-xs text-slate-600 dark:text-slate-400 font-light leading-relaxed">
            {details.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/40">
            {details.highlights.map((item, index) => (
              <div key={index} className="text-left sm:text-center">
                <div className="text-[8px] uppercase text-slate-400 dark:text-slate-500 tracking-wider font-semibold">{item.label}</div>
                <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 break-words">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40 space-y-1.5">
            <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-light">
              <span>{details.graphLabel}</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{details.graphValue}</span>
            </div>
            <div className="h-7 w-full bg-slate-100/30 dark:bg-slate-950/20 rounded-md relative overflow-hidden flex items-end">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-cyan-500/5 to-indigo-500/5 opacity-60" />
              <div className="w-full h-full absolute inset-0 flex items-center justify-around pointer-events-none opacity-20">
                <div className="w-[1.5px] h-[30%] bg-indigo-500 rounded" />
                <div className="w-[1.5px] h-[55%] bg-cyan-500 rounded animate-pulse" />
                <div className="w-[1.5px] h-[80%] bg-cyan-400 rounded" />
                <div className="w-[1.5px] h-[40%] bg-indigo-500 rounded" />
                <div className="w-[1.5px] h-[65%] bg-purple-500 rounded animate-pulse" />
                <div className="w-[1.5px] h-[90%] bg-cyan-500 rounded" />
                <div className="w-[1.5px] h-[25%] bg-indigo-400 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function Home() {
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const listener = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (!expandedCardId) return;
    const handleOutsideClick = (e) => {
      // If the click is inside any expandable card, we let its local handler deal with it
      if (e.target.closest('.expandable-card')) return;
      setExpandedCardId(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [expandedCardId]);

  const toggleCard = (cardId) => {
    const isCurrentlyExpanded = expandedCardId === cardId;
    const nextState = isCurrentlyExpanded ? null : cardId;
    setExpandedCardId(nextState);

    // Dynamic Viewport Scroll Stability for Mobile
    if (nextState && window.innerWidth < 768) {
      setTimeout(() => {
        const el = document.getElementById(cardId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400); // Trigger mid-spring to ensure accurate dimensional targeting
    }
  };

  const handleKeyDown = (e, cardId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCard(cardId);
    }
  };

  // Helper for computing premium glassmorphic focal focus
  const getCardClasses = (cardId, baseClasses) => {
    const isExpanded = expandedCardId === cardId;
    const isDimmed = expandedCardId !== null && !isExpanded;
    
    let classes = `${baseClasses} expandable-card transition-all duration-500 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:focus-visible:ring-indigo-400/50 `;
    
    if (isExpanded) {
      classes += " shadow-2xl border-indigo-500/40 dark:border-indigo-400/40 bg-slate-50/90 dark:bg-slate-900/80 backdrop-blur-3xl ring-1 ring-indigo-500/20 scale-[1.01] z-30 shadow-indigo-500/5";
    } else if (isDimmed) {
      classes += " opacity-65 scale-[0.98] z-0";
    } else {
      classes += " opacity-100 hover-lift z-10";
    }
    
    return classes;
  };

  return (
    <div className="mesh-gradient w-full min-w-0">
      <main className="w-full min-w-0 max-w-[1440px] mx-auto px-6 lg:px-[var(--spacing-container-padding)]">
        {/* Hero Section */}
        <section className="relative w-full min-w-0 pt-32 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[90vh]">
          {/* Ambient Background for Hero */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="absolute w-[1000px] h-[1000px] rounded-full blur-[150px] bg-gradient-to-br from-indigo-200/40 dark:from-blue-900/20 via-transparent dark:via-slate-900 to-transparent opacity-60 dark:opacity-40" />
            <div className="absolute left-0 bottom-0 w-[800px] h-[600px] rounded-full blur-[120px] bg-gradient-to-tr from-cyan-200/40 dark:from-cyan-900/20 to-transparent mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-40" />
          </div>

          {/* Left: Typography & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-w-0 space-y-8 z-10"
          >
            <h1 className="text-8xl md:text-9xl font-bold text-primary-forced dark:text-white leading-[0.9] tracking-tight">
              Clima<br/>
              <span className="text-blue-600 dark:text-blue-200">Cast</span>
            </h1>
            <p className="text-xl md:text-2xl text-secondary-forced dark:text-slate-300 max-w-[32rem] font-light leading-relaxed">
              Real-time climate intelligence<br/>for a changing world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/dashboard">
                <Button variant="primary" size="lg" className="bg-indigo-600 dark:bg-indigo-500/90 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white border-none shadow-[0_0_20px_rgba(99,102,241,0.3)] min-w-[180px]">
                  Open Dashboard
                </Button>
              </Link>
              <Link to="/forecast">
                <Button variant="glass" size="lg" className="bg-slate-200/50 dark:bg-transparent border-[var(--theme-card-border)] dark:border-white/10 hover:bg-slate-300/50 dark:hover:bg-white/5 text-primary-forced dark:text-slate-300 shadow-sm min-w-[180px]">
                  Explore Forecasts <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Atmospheric Intelligence Card */}
          <motion.div 
            id="atmospheric-intelligence"
            role="button"
            tabIndex={0}
            aria-expanded={expandedCardId === 'atmospheric-intelligence'}
            aria-controls="expanded-details-atmospheric-intelligence"
            initial={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={expandedCardId === 'atmospheric-intelligence' ? {} : { y: -4, scale: 1.005 }}
            onClick={(e) => {
              if (e.target.closest('a') || e.target.closest('button')) return;
              toggleCard('atmospheric-intelligence');
            }}
            onKeyDown={(e) => handleKeyDown(e, 'atmospheric-intelligence')}
            className={getCardClasses('atmospheric-intelligence', 'glass-card dark:bg-transparent p-8 md:p-10 rounded-[2rem] relative overflow-hidden group')}
          >
            {/* Subtle internal atmospheric illustration */}
            <div className="absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-30 pointer-events-none">
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px]" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
            </div>

            {/* Dynamic slow gradient background glow when active */}
            <AnimatePresence>
              {expandedCardId === 'atmospheric-intelligence' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none animate-pulse -z-10"
                  style={{ animationDuration: '6s' }}
                />
              )}
            </AnimatePresence>
            
            <div className="relative z-10 space-y-8">
              {features.map((feat) => (
                <div key={feat.title} className="flex gap-5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-100/80 dark:bg-slate-900/50 border border-slate-900/10 dark:border-white/5 shrink-0 shadow-inner ${feat.iconColor}`}>
                    <span className="material-symbols-outlined opacity-90">{feat.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-primary-forced dark:text-white font-medium text-lg mb-1">{feat.title}</h3>
                    <p className="text-secondary-forced dark:text-slate-400 text-sm leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <AnimatePresence>
              {expandedCardId === 'atmospheric-intelligence' && (
                <ExpandedCardDetails 
                  cardId="atmospheric-intelligence" 
                  details={CARD_DETAILS['atmospheric-intelligence']} 
                  isReducedMotion={isReducedMotion} 
                />
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Climate Timeline Experience Centerpiece */}
        <section className="w-full min-w-0 py-32 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[56rem] mx-auto text-center mb-16 space-y-4 relative z-10"
          >
            <h2 className="text-3xl md:text-4xl font-light text-primary-forced dark:text-white tracking-tight">Climate Timeline <span className="text-indigo-600 dark:text-indigo-400">Experience</span></h2>
            <p className="w-full max-w-[48rem] mx-auto text-secondary-forced dark:text-slate-400 font-light">Seamlessly navigate from historical atmospheric memory to real-time present conditions, and explore glowing future projection paths.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-w-0 glass-card bg-slate-50/50 dark:bg-transparent p-6 sm:p-10 rounded-3xl relative overflow-hidden"
          >
            {/* Timeline Ambient Glow & Noise */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGZpbHRlciBpZD0ibiI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIvPjwvc3ZnPg==')] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-48 bg-cyan-500/10 blur-[100px] pointer-events-none" />
            
            <div className="w-full min-w-0 flex items-center justify-between relative z-10 pt-4">
              {/* Past */}
              <div className="min-w-0 flex-1 space-y-4 opacity-50 transition-opacity hover:opacity-80">
                <div className="text-label-caps text-secondary-forced dark:text-slate-400 tracking-wider">Past Observations</div>
                <div className="h-0.5 w-full bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-transparent to-slate-400 dark:to-slate-500" />
                </div>
                <div className="flex justify-between text-xs text-secondary-forced tracking-wider">
                  <span>1990</span>
                  <span>2010</span>
                </div>
              </div>

              {/* Present Node */}
              <div className="shrink-0 px-4 sm:px-8 flex flex-col items-center relative z-20 -mt-2">
                <div className="text-label-caps text-cyan-600 dark:text-cyan-400 mb-4 tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Live State</div>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-30" />
                  <div className="w-5 h-5 rounded-full bg-cyan-500 dark:bg-cyan-400 border-2 border-white dark:border-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.6)] relative z-10" />
                </div>
                <div className="mt-4 text-sm font-medium text-primary-forced dark:text-white tracking-wide">Today</div>
              </div>

              {/* Future */}
              <div className="min-w-0 flex-1 space-y-4 relative">
                <div className="text-label-caps text-blue-600 dark:text-blue-400 text-right tracking-wider">Future Trajectory</div>
                <div className="h-0.5 w-full bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent w-full animate-pulse" />
                </div>
                <div className="flex justify-between text-xs text-secondary-forced dark:text-slate-400 tracking-wider">
                  <span>+5 YRS</span>
                  <span>+20 YRS</span>
                </div>
              </div>
            </div>

            {/* Timeline Data Cards Staggered */}
            <motion.div 
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="w-full min-w-0 grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 relative z-10 items-start"
            >
              {/* Historical Grounding */}
              <motion.div 
                id="historical-grounding"
                role="button"
                tabIndex={0}
                aria-expanded={expandedCardId === 'historical-grounding'}
                aria-controls="expanded-details-historical-grounding"
                variants={{
                  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                }}
                whileHover={expandedCardId === 'historical-grounding' ? {} : { y: -4, scale: 1.01 }}
                onClick={() => toggleCard('historical-grounding')}
                onKeyDown={(e) => handleKeyDown(e, 'historical-grounding')}
                className={getCardClasses('historical-grounding', 'bg-slate-200/40 dark:bg-slate-800/40 border border-[var(--theme-card-border)] dark:border-slate-700/50 rounded-xl p-5 text-center shadow-md dark:shadow-none backdrop-blur-sm')}
              >
                <div className="material-symbols-outlined text-secondary-forced dark:text-slate-400 mb-2">history</div>
                <div className="text-sm text-primary-forced dark:text-slate-300 font-medium">Historical Grounding</div>
                <AnimatePresence>
                  {expandedCardId === 'historical-grounding' && (
                    <ExpandedCardDetails 
                      cardId="historical-grounding" 
                      details={CARD_DETAILS['historical-grounding']} 
                      isReducedMotion={isReducedMotion} 
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Live Environmental Sync */}
              <motion.div 
                id="live-sync"
                role="button"
                tabIndex={0}
                aria-expanded={expandedCardId === 'live-sync'}
                aria-controls="expanded-details-live-sync"
                variants={{
                  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                }}
                whileHover={expandedCardId === 'live-sync' ? {} : { y: -4, scale: 1.01 }}
                onClick={() => toggleCard('live-sync')}
                onKeyDown={(e) => handleKeyDown(e, 'live-sync')}
                className={getCardClasses('live-sync', 'bg-cyan-100/60 dark:bg-cyan-900/20 border border-cyan-300 dark:border-cyan-800/50 rounded-xl p-5 text-center shadow-md dark:shadow-[0_0_15px_rgba(34,211,238,0.1)] backdrop-blur-sm')}
              >
                <div className="material-symbols-outlined text-cyan-700 dark:text-cyan-400 mb-2">sensors</div>
                <div className="text-sm text-primary-forced dark:text-white font-medium">Live Environmental Sync</div>
                <AnimatePresence>
                  {expandedCardId === 'live-sync' && (
                    <ExpandedCardDetails 
                      cardId="live-sync" 
                      details={CARD_DETAILS['live-sync']} 
                      isReducedMotion={isReducedMotion} 
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Adaptive Forecasting */}
              <motion.div 
                id="adaptive-forecasting"
                role="button"
                tabIndex={0}
                aria-expanded={expandedCardId === 'adaptive-forecasting'}
                aria-controls="expanded-details-adaptive-forecasting"
                variants={{
                  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                }}
                whileHover={expandedCardId === 'adaptive-forecasting' ? {} : { y: -4, scale: 1.01 }}
                onClick={() => toggleCard('adaptive-forecasting')}
                onKeyDown={(e) => handleKeyDown(e, 'adaptive-forecasting')}
                className={getCardClasses('adaptive-forecasting', 'bg-indigo-100/60 dark:bg-blue-900/20 border border-indigo-300 dark:border-blue-800/50 rounded-xl p-5 text-center shadow-md dark:shadow-none backdrop-blur-sm')}
              >
                <div className="material-symbols-outlined text-indigo-700 dark:text-blue-400 mb-2">trending_up</div>
                <div className="text-sm text-primary-forced dark:text-slate-300 font-medium">Adaptive Forecasting</div>
                <AnimatePresence>
                  {expandedCardId === 'adaptive-forecasting' && (
                    <ExpandedCardDetails 
                      cardId="adaptive-forecasting" 
                      details={CARD_DETAILS['adaptive-forecasting']} 
                      isReducedMotion={isReducedMotion} 
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Live Climate Preview */}
        <section className="w-full min-w-0 py-24 max-w-[64rem] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-w-0 flex justify-between items-end mb-8 px-2"
          >
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-medium text-primary-forced dark:text-white tracking-tight flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                Live Climate Preview
              </h2>
              <p className="text-secondary-forced dark:text-slate-400 text-sm md:text-base font-light">Real-time atmospheric conditions reflecting the current environmental state.</p>
            </div>
            <Link to="/dashboard" className="hidden md:flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm font-medium">
              View Full Dashboard <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </motion.div>
          
          <div className="w-full min-w-0 space-y-[var(--spacing-card-gap)]">
            {/* Top Main Card (Tokyo Showcase) */}
            <motion.div 
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.005 }}
              className="glass-card dark:bg-transparent rounded-[2rem] overflow-hidden relative h-[300px]"
            >
              {/* Earth background map area */}
              <div className="absolute inset-0 right-0 sm:left-1/3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 dark:from-slate-950/90 dark:via-slate-950/80 to-transparent z-10" />
                <img
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] object-cover dark:mix-blend-screen mix-blend-multiply opacity-60 dark:opacity-90 animate-pulse"
                  style={{ animationDuration: '8s' }}
                  alt="Earth visualization"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7om3JI9Nb6OWWkb34mQbKIQ5qj5YiartZZiMDIXw8A13xxk7yLwBVayMQRxh20vLri0c3BkOHTwPXXL88sjbphg_PbrTaSPA5pMsRsJxTLVwBffTlh5hqbgf3oDtVS0TV03ov8oyWJxnavXV0FvNGsPM_9ODXg_CxD-rekdnrjQ1JWMYSwkVpRXjnjVEdy7a0nAzmY0D7Ibh4GydHe6ikzIVfz3V3sEl7P1JPO5UHk4yMhrSc32ie_mVAU9ceDpPkzeNb2h3SII9-"
                />
              </div>

              <div className="relative z-20 h-full flex flex-col justify-center p-10 md:p-12">
                <div className="text-label-caps text-cyan-600 dark:text-cyan-400 tracking-widest mb-6">GLOBAL WATCH</div>
                <div className="text-8xl font-light text-primary-forced dark:text-white tracking-tight mb-2">24°</div>
                <h3 className="text-2xl font-light text-slate-700 dark:text-slate-300 mb-2">Tokyo, Japan</h3>
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <span className="material-symbols-outlined text-xl">light_mode</span>
                  <span className="text-sm font-medium">Clear Sky</span>
                </div>
              </div>
            </motion.div>

            {/* Bottom 4 KPI Cards Staggered */}
            <motion.div 
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="w-full min-w-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[var(--spacing-card-gap)] items-start"
            >
              {/* AQI */}
              <motion.div 
                id="aqi"
                role="button"
                tabIndex={0}
                aria-expanded={expandedCardId === 'aqi'}
                aria-controls="expanded-details-aqi"
                variants={{
                  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                }}
                whileHover={expandedCardId === 'aqi' ? {} : { y: -4, scale: 1.01 }}
                onClick={() => toggleCard('aqi')}
                onKeyDown={(e) => handleKeyDown(e, 'aqi')}
                className={getCardClasses('aqi', 'glass-card dark:bg-transparent p-6 rounded-2xl relative overflow-hidden group')}
              >
                <div className="flex items-center gap-2 text-secondary-forced dark:text-slate-400 mb-6">
                  <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-lg">eco</span>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Air Quality Index</span>
                </div>
                <div className="text-3xl sm:text-4xl font-light text-primary-forced dark:text-white mb-2">84</div>
                <div className="text-yellow-600 dark:text-yellow-400 text-sm font-medium mb-3">Moderate</div>
                <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 w-[40%]" />
                </div>
                <AnimatePresence>
                  {expandedCardId === 'aqi' && (
                    <ExpandedCardDetails 
                      cardId="aqi" 
                      details={CARD_DETAILS['aqi']} 
                      isReducedMotion={isReducedMotion} 
                    />
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Humidity */}
              <motion.div 
                id="humidity"
                role="button"
                tabIndex={0}
                aria-expanded={expandedCardId === 'humidity'}
                aria-controls="expanded-details-humidity"
                variants={{
                  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                }}
                whileHover={expandedCardId === 'humidity' ? {} : { y: -4, scale: 1.01 }}
                onClick={() => toggleCard('humidity')}
                onKeyDown={(e) => handleKeyDown(e, 'humidity')}
                className={getCardClasses('humidity', 'glass-card dark:bg-transparent p-6 rounded-2xl relative overflow-hidden group')}
              >
                <div className="flex items-center gap-2 text-secondary-forced dark:text-slate-400 mb-6">
                  <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 text-lg">water_drop</span>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Humidity</span>
                </div>
                <div className="text-3xl sm:text-4xl font-light text-primary-forced dark:text-white mb-2">72%</div>
                <div className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-3">Comfortable</div>
                <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[72%]" />
                </div>
                <AnimatePresence>
                  {expandedCardId === 'humidity' && (
                    <ExpandedCardDetails 
                      cardId="humidity" 
                      details={CARD_DETAILS['humidity']} 
                      isReducedMotion={isReducedMotion} 
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Wind Speed */}
              <motion.div 
                id="wind"
                role="button"
                tabIndex={0}
                aria-expanded={expandedCardId === 'wind'}
                aria-controls="expanded-details-wind"
                variants={{
                  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                }}
                whileHover={expandedCardId === 'wind' ? {} : { y: -4, scale: 1.01 }}
                onClick={() => toggleCard('wind')}
                onKeyDown={(e) => handleKeyDown(e, 'wind')}
                className={getCardClasses('wind', 'glass-card dark:bg-transparent p-6 rounded-2xl relative overflow-hidden group')}
              >
                <div className="flex items-center gap-2 text-secondary-forced dark:text-slate-400 mb-6">
                  <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-lg">air</span>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Wind Speed</span>
                </div>
                <div className="text-3xl sm:text-4xl font-light text-primary-forced dark:text-white mb-2">12 <span className="text-lg sm:text-xl text-secondary-forced dark:text-slate-400">km/h</span></div>
                <div className="text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-3">Light Breeze</div>
                <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 dark:bg-cyan-400 w-[30%]" />
                </div>
                <AnimatePresence>
                  {expandedCardId === 'wind' && (
                    <ExpandedCardDetails 
                      cardId="wind" 
                      details={CARD_DETAILS['wind']} 
                      isReducedMotion={isReducedMotion} 
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Pressure */}
              <motion.div 
                id="pressure"
                role="button"
                tabIndex={0}
                aria-expanded={expandedCardId === 'pressure'}
                aria-controls="expanded-details-pressure"
                variants={{
                  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                }}
                whileHover={expandedCardId === 'pressure' ? {} : { y: -4, scale: 1.01 }}
                onClick={() => toggleCard('pressure')}
                onKeyDown={(e) => handleKeyDown(e, 'pressure')}
                className={getCardClasses('pressure', 'glass-card dark:bg-transparent p-6 rounded-2xl relative overflow-hidden group')}
              >
                <div className="flex items-center gap-2 text-secondary-forced dark:text-slate-400 mb-6">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">speed</span>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Pressure</span>
                </div>
                <div className="text-3xl sm:text-4xl font-light text-primary-forced dark:text-white mb-2">1012 <span className="text-lg sm:text-xl text-secondary-forced dark:text-slate-400">hPa</span></div>
                <div className="text-green-600 dark:text-green-400 text-sm font-medium mb-3">Stable</div>
                <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 dark:bg-green-400 w-[60%]" />
                </div>
                <AnimatePresence>
                  {expandedCardId === 'pressure' && (
                    <ExpandedCardDetails 
                      cardId="pressure" 
                      details={CARD_DETAILS['pressure']} 
                      isReducedMotion={isReducedMotion} 
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </section>


        {/* Our Approach & Final CTA */}
        <section className="w-full min-w-0 py-24 border-t border-[var(--theme-card-border)] dark:border-white/5  dark:bg-slate-950/40 backdrop-blur-xl relative overflow-hidden">
          <div className="w-full min-w-0 max-w-[64rem] mx-auto px-6 relative z-10">
            <div className="w-full min-w-0 grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-3xl md:text-4xl font-light text-primary-forced dark:text-white tracking-tight mb-6">Built for <span className="text-indigo-600 dark:text-indigo-400">precision</span>.<br/>Designed for <span className="text-cyan-600 dark:text-cyan-400">clarity</span>.</h2>
                <p className="text-secondary-forced dark:text-slate-400 font-light mb-8 text-lg">
                  Clima-Cast bypasses generic weather reporting. It's an atmospheric engine built to provide contextual, historical, and adaptive intelligence for those who need deep environmental understanding.
                </p>
                <motion.div 
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  {[
                    { id: 'memory-processing', icon: 'memory', text: 'Atmospheric memory processing' },
                    { id: 'environmental-sync', icon: 'sync', text: 'Live environmental synchronization' },
                    { id: 'projection-modeling', icon: 'timeline', text: 'Long-term projection modeling' }
                  ].map((item, i) => (
                    <motion.div 
                      key={item.id}
                      id={item.id}
                      role="button"
                      tabIndex={0}
                      aria-expanded={expandedCardId === item.id}
                      aria-controls={`expanded-details-${item.id}`}
                      variants={{
                        hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
                        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                      }}
                      whileHover={expandedCardId === item.id ? {} : { x: 4 }}
                      onClick={() => toggleCard(item.id)}
                      onKeyDown={(e) => handleKeyDown(e, item.id)}
                      className={getCardClasses(item.id, 'flex flex-col p-4 rounded-xl dark:bg-slate-900/50 border border-[var(--theme-card-border)]/50 dark:border-slate-700/50')}
                    >
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400">{item.icon}</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{item.text}</span>
                      </div>
                      
                      <AnimatePresence>
                        {expandedCardId === item.id && (
                          <ExpandedCardDetails 
                            cardId={item.id} 
                            details={CARD_DETAILS[item.id]} 
                            isReducedMotion={isReducedMotion} 
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.005 }}
                className="glass-card bg-slate-100/60 dark:bg-transparent p-10 rounded-3xl text-center flex flex-col justify-center items-center h-full min-h-[400px] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-indigo-100/80 dark:bg-indigo-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                    <span className="material-symbols-outlined text-3xl text-indigo-600 dark:text-indigo-400">explore</span>
                  </div>
                  <h3 className="text-2xl font-light text-primary-forced dark:text-white">Ready to explore?</h3>
                  <p className="text-secondary-forced dark:text-slate-400 max-w-[24rem] mx-auto">
                    Access the complete environmental dashboard and begin monitoring global atmospheric shifts.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/dashboard">
                      <Button variant="primary" className="bg-indigo-600 dark:bg-white text-white dark:text-primary-forced hover:bg-indigo-700 dark:hover:bg-slate-200 border-none min-w-[160px]">
                        Launch Platform
                      </Button>
                    </Link>
                    <Link to="/about">
                      <Button variant="glass" className="border-[var(--theme-card-border)] dark:border-white/10 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 min-w-[160px]">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
