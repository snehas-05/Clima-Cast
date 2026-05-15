/**
 * Centralized Temperature Conversion Utility
 */

export const cToF = (c) => (c * 9) / 5 + 32;

export const fToC = (f) => ((f - 32) * 5) / 9;

export const formatTemp = (temp, unit = 'celsius', showUnit = true) => {
  if (temp === null || temp === undefined) return '--';
  
  const val = unit === 'fahrenheit' ? cToF(temp) : temp;
  const rounded = Math.round(val);
  
  if (!showUnit) return rounded;
  return `${rounded}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
};
