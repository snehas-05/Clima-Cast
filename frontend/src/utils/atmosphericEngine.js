/**
 * CLIMA-CAST Atmospheric Engine
 * 
 * Pure logic for mapping environmental data to UI tokens.
 * Decouples raw API data from cinematic UI parameters.
 */

export const getAtmosphericState = (weatherData) => {
  if (!weatherData) return {
    condition: 'clear',
    intensity: 0,
    isDay: true,
    solarPhase: 'noon',
    mood: 'calm'
  };

  const { raw_icon, temperature, wind_kph, sunrise_ts, sunset_ts } = weatherData;
  const now = Math.floor(Date.now() / 1000);

  // 1. Condition Mapping (Standard OWM Icon codes)
  // 01: Clear, 02-04: Clouds, 09-10: Rain, 11: Storm, 13: Snow, 50: Fog
  const iconCode = raw_icon ? raw_icon.substring(0, 2) : '01';
  const isDay = raw_icon ? raw_icon.endsWith('d') : true;

  const conditionMap = {
    '01': 'clear',
    '02': 'cloudy',
    '03': 'cloudy',
    '04': 'cloudy',
    '09': 'rain',
    '10': 'rain',
    '11': 'storm',
    '13': 'snow',
    '50': 'fog'
  };

  const condition = conditionMap[iconCode] || 'clear';

  // 2. Solar Phase Calculation
  let solarPhase = 'noon';
  if (sunrise_ts && sunset_ts) {
    const hourInSeconds = 3600;
    
    if (now < sunrise_ts - hourInSeconds) {
      solarPhase = 'night';
    } else if (now < sunrise_ts + hourInSeconds) {
      solarPhase = 'dawn';
    } else if (now < sunset_ts - hourInSeconds * 2) {
      solarPhase = 'noon';
    } else if (now < sunset_ts) {
      solarPhase = 'afternoon';
    } else if (now < sunset_ts + hourInSeconds) {
      solarPhase = 'dusk';
    } else if (now < sunset_ts + hourInSeconds * 4) {
      solarPhase = 'evening';
    } else {
      solarPhase = 'night';
    }
  } else {
    // Fallback to simple day/night if timestamps are missing
    solarPhase = isDay ? 'noon' : 'night';
  }

  // 3. Intensity Mapping (0 to 1)
  // Represents how "active" the environment is.
  const tempIntensity = Math.min(Math.max((temperature - 20) / 20, 0), 1); // Normalizing 20°C to 40°C+
  const windIntensity = Math.min(wind_kph / 60, 1); // Normalizing 0 to 60kph
  
  // Base intensity on the most extreme factor
  const intensity = Math.max(tempIntensity, windIntensity);

  // 4. Mood Mapping
  // Determines the "energy" of transitions and UI glows.
  let mood = 'calm';
  if (condition === 'storm' || intensity > 0.8) {
    mood = 'intense';
  } else if (condition === 'rain' || condition === 'fog' || intensity > 0.5) {
    mood = 'alert';
  }

  return {
    condition,
    intensity,
    isDay,
    solarPhase,
    mood
  };
};
