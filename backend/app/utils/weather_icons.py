def get_weather_theme(icon_code: str):
    """
    Maps OpenWeather icon codes to frontend icon names and background gradients.
    Icon codes: https://openweathermap.org/weather-conditions
    """
    mapping = {
        "01d": {"icon": "sunny", "gradient": "from-blue-400 to-yellow-200", "label": "Clear Sky"},
        "01n": {"icon": "clear-night", "gradient": "from-indigo-900 to-purple-900", "label": "Clear Sky"},
        "02d": {"icon": "partly-cloudy", "gradient": "from-blue-300 to-gray-200", "label": "Few Clouds"},
        "02n": {"icon": "partly-cloudy-night", "gradient": "from-indigo-800 to-gray-700", "label": "Few Clouds"},
        "03d": {"icon": "cloudy", "gradient": "from-gray-400 to-gray-200", "label": "Scattered Clouds"},
        "03n": {"icon": "cloudy", "gradient": "from-gray-700 to-gray-500", "label": "Scattered Clouds"},
        "04d": {"icon": "broken-clouds", "gradient": "from-gray-500 to-gray-300", "label": "Broken Clouds"},
        "04n": {"icon": "broken-clouds", "gradient": "from-gray-800 to-gray-600", "label": "Broken Clouds"},
        "09d": {"icon": "rain", "gradient": "from-blue-600 to-gray-400", "label": "Shower Rain"},
        "09n": {"icon": "rain", "gradient": "from-blue-900 to-gray-700", "label": "Shower Rain"},
        "10d": {"icon": "light-rain", "gradient": "from-blue-400 to-gray-300", "label": "Rain"},
        "10n": {"icon": "light-rain", "gradient": "from-blue-800 to-gray-600", "label": "Rain"},
        "11d": {"icon": "thunderstorm", "gradient": "from-purple-600 to-gray-500", "label": "Thunderstorm"},
        "11n": {"icon": "thunderstorm", "gradient": "from-purple-900 to-gray-800", "label": "Thunderstorm"},
        "13d": {"icon": "snow", "gradient": "from-blue-100 to-white", "label": "Snow"},
        "13n": {"icon": "snow", "gradient": "from-blue-200 to-gray-100", "label": "Snow"},
        "50d": {"icon": "mist", "gradient": "from-gray-300 to-gray-100", "label": "Mist"},
        "50n": {"icon": "mist", "gradient": "from-gray-600 to-gray-400", "label": "Mist"},
    }
    
    # Default to sunny if not found
    return mapping.get(icon_code, {"icon": "sunny", "gradient": "from-blue-400 to-yellow-200", "label": "Clear Sky"})
