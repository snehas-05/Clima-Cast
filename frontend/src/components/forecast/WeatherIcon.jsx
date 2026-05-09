import React from 'react';
import './WeatherIcon.css';

const WeatherIcon = ({ condition, className = "" }) => {
  const getIconContent = () => {
    switch (condition?.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return (
          <div className="weather-icon sun">
            <div className="sun-core"></div>
            <div className="sun-rays"></div>
          </div>
        );
      case 'clouds':
      case 'cloudy':
      case 'overcast':
        return (
          <div className="weather-icon cloud">
            <div className="cloud-body"></div>
            <div className="cloud-puffs"></div>
          </div>
        );
      case 'rain':
      case 'drizzle':
        return (
          <div className="weather-icon rain">
            <div className="cloud-body"></div>
            <div className="rain-drops">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        );
      case 'thunderstorm':
        return (
          <div className="weather-icon thunderstorm">
            <div className="cloud-body"></div>
            <div className="lightning"></div>
            <div className="rain-drops">
              <span></span>
              <span></span>
            </div>
          </div>
        );
      case 'snow':
        return (
          <div className="weather-icon snow">
            <div className="cloud-body"></div>
            <div className="snowflakes">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        );
      default:
        return <span className="material-symbols-outlined text-4xl text-primary-container">wb_sunny</span>;
    }
  };

  return (
    <div className={`weather-icon-wrapper ${className}`} aria-label={`Weather condition: ${condition}`}>
      {getIconContent()}
    </div>
  );
};

export default WeatherIcon;
