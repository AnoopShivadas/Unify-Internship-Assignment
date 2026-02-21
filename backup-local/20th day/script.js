// ==========================================
// PREMIUM WEATHER DASHBOARD - JAVASCRIPT
// Mock Data & Interactive Features
// ==========================================

// Mock Weather Data
const mockWeatherData = {
    current: {
        city: 'San Francisco',
        location: 'California, United States',
        temp_c: 22,
        temp_f: 72,
        feels_like_c: 20,
        feels_like_f: 68,
        condition: 'Sunny',
        description: 'Clear skies with light breeze',
        humidity: 45,
        wind_speed_kmh: 19,
        wind_speed_mph: 12,
        wind_direction: 'NW',
        wind_gust_kmh: 29,
        wind_gust_mph: 18,
        dew_point_c: 12,
        dew_point_f: 54,
        pressure: 1013,
        visibility: 10,
        cloud_cover: 15,
        uv_index: 6,
        precipitation: 5,
        aqi: 42,
        sunrise: '6:24 AM',
        sunset: '7:42 PM',
        heat_index_c: 23,
        heat_index_f: 74,
        wind_chill_c: 21,
        wind_chill_f: 70,
        temp_min_c: 18,
        temp_min_f: 65,
        temp_max_c: 26,
        temp_max_f: 78,
        moon_phase: 'First Quarter',
        moon_illumination: 52,
        moonrise: '12:34 PM',
        moonset: '1:23 AM'
    },
    hourly: [
        { time: 'Now', icon: '☀️', temp_c: 22, temp_f: 72, precip: '0%' },
        { time: '1 PM', icon: '☀️', temp_c: 23, temp_f: 73, precip: '0%' },
        { time: '2 PM', icon: '☀️', temp_c: 24, temp_f: 75, precip: '5%' },
        { time: '3 PM', icon: '🌤️', temp_c: 25, temp_f: 77, precip: '10%' },
        { time: '4 PM', icon: '🌤️', temp_c: 26, temp_f: 79, precip: '10%' },
        { time: '5 PM', icon: '⛅', temp_c: 25, temp_f: 77, precip: '15%' },
        { time: '6 PM', icon: '⛅', temp_c: 23, temp_f: 73, precip: '10%' },
        { time: '7 PM', icon: '🌙', temp_c: 21, temp_f: 70, precip: '5%' },
        { time: '8 PM', icon: '🌙', temp_c: 20, temp_f: 68, precip: '0%' },
        { time: '9 PM', icon: '🌙', temp_c: 19, temp_f: 66, precip: '0%' },
        { time: '10 PM', icon: '🌙', temp_c: 18, temp_f: 64, precip: '0%' },
        { time: '11 PM', icon: '🌙', temp_c: 18, temp_f: 64, precip: '0%' }
    ],
    forecast: [
        { day: 'Today', icon: '☀️', temp_c: 24, temp_f: 75, condition: 'Sunny' },
        { day: 'Tomorrow', icon: '⛅', temp_c: 23, temp_f: 73, condition: 'Partly Cloudy' },
        { day: 'Wednesday', icon: '☁️', temp_c: 21, temp_f: 70, condition: 'Cloudy' },
        { day: 'Thursday', icon: '🌧️', temp_c: 18, temp_f: 64, condition: 'Rainy' },
        { day: 'Friday', icon: '⛈️', temp_c: 19, temp_f: 66, condition: 'Thunderstorm' },
        { day: 'Saturday', icon: '🌤️', temp_c: 22, temp_f: 72, condition: 'Partly Sunny' },
        { day: 'Sunday', icon: '☀️', temp_c: 25, temp_f: 77, condition: 'Clear' }
    ]
};

// Alternative cities data
const citiesData = {
    'New York': {
        location: 'New York, United States',
        temp_c: 18, temp_f: 64, feels_like_c: 16, feels_like_f: 61,
        condition: 'Partly Cloudy', description: 'Overcast with gentle winds',
        humidity: 62, wind_speed_kmh: 24, wind_speed_mph: 15,
        icon: '⛅'
    },
    'London': {
        location: 'England, United Kingdom',
        temp_c: 12, temp_f: 54, feels_like_c: 10, feels_like_f: 50,
        condition: 'Rainy', description: 'Light rain with fog',
        humidity: 78, wind_speed_kmh: 16, wind_speed_mph: 10,
        icon: '🌧️'
    },
    'Tokyo': {
        location: 'Japan',
        temp_c: 26, temp_f: 79, feels_like_c: 28, feels_like_f: 82,
        condition: 'Clear', description: 'Bright and sunny',
        humidity: 55, wind_speed_kmh: 13, wind_speed_mph: 8,
        icon: '☀️'
    },
    'Paris': {
        location: 'France',
        temp_c: 15, temp_f: 59, feels_like_c: 14, feels_like_f: 57,
        condition: 'Cloudy', description: 'Overcast skies',
        humidity: 68, wind_speed_kmh: 19, wind_speed_mph: 12,
        icon: '☁️'
    },
    'Sydney': {
        location: 'Australia',
        temp_c: 28, temp_f: 82, feels_like_c: 30, feels_like_f: 86,
        condition: 'Partly Sunny', description: 'Warm with scattered clouds',
        humidity: 50, wind_speed_kmh: 21, wind_speed_mph: 13,
        icon: '🌤️'
    }
};

// State Management
let currentUnit = 'F'; // 'C' or 'F'
let currentCity = 'San Francisco';

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show loading overlay
    showLoading();
    
    // Simulate API call delay
    setTimeout(() => {
        loadWeatherData();
        hideLoading();
        animateElements();
    }, 2000);
    
    // Event Listeners
    setupEventListeners();
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
    // Temperature toggle
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentUnit = this.dataset.unit;
            updateTemperatureDisplay();
        });
    });
    
    // Search button
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('citySearch');
    
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

function handleSearch() {
    const searchInput = document.getElementById('citySearch');
    const cityName = searchInput.value.trim();
    
    if (cityName) {
        currentCity = cityName;
        showLoading();
        
        setTimeout(() => {
            loadWeatherData(cityName);
            hideLoading();
            animateElements();
        }, 1500);
    }
}

// ==========================================
// LOADING STATES
// ==========================================

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('active');
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('active');
}

// ==========================================
// WEATHER DATA LOADING
// ==========================================

function loadWeatherData(cityName = 'San Francisco') {
    const data = mockWeatherData.current;
    
    // Check if we have specific city data
    if (citiesData[cityName]) {
        const cityData = citiesData[cityName];
        Object.assign(data, cityData);
    }
    
    // Update city information
    document.getElementById('cityName').textContent = cityName;
    document.getElementById('locationSubtitle').textContent = 
        citiesData[cityName]?.location || data.location;
    
    // Update temperature
    updateTemperatureDisplay();
    
    // Update weather condition
    document.getElementById('condition').textContent = data.condition;
    document.getElementById('description').textContent = data.description;
    
    // Update stats - expanded
    document.getElementById('humidity').textContent = data.humidity + '%';
    document.getElementById('pressure').textContent = data.pressure + ' hPa';
    document.getElementById('visibility').textContent = data.visibility + ' km';
    document.getElementById('cloudCover').textContent = data.cloud_cover + '%';
    document.getElementById('uvIndex').textContent = data.uv_index;
    document.getElementById('precipitation').textContent = data.precipitation + '%';
    document.getElementById('windDirection').textContent = data.wind_direction;
    document.getElementById('aqiQuick').textContent = 'Good';
    
    // Update wind gust and dew point
    if (currentUnit === 'C') {
        document.getElementById('windGust').textContent = data.wind_gust_kmh + ' km/h';
        document.getElementById('dewPoint').textContent = data.dew_point_c + '°C';
        document.getElementById('heatIndex').textContent = data.heat_index_c + '°C';
        document.getElementById('windChill').textContent = data.wind_chill_c + '°C';
        document.getElementById('tempMin').textContent = data.temp_min_c + '°C';
        document.getElementById('tempMax').textContent = data.temp_max_c + '°C';
    } else {
        document.getElementById('windGust').textContent = data.wind_gust_mph + ' mph';
        document.getElementById('dewPoint').textContent = data.dew_point_f + '°F';
        document.getElementById('heatIndex').textContent = data.heat_index_f + '°F';
        document.getElementById('windChill').textContent = data.wind_chill_f + '°F';
        document.getElementById('tempMin').textContent = data.temp_min_f + '°F';
        document.getElementById('tempMax').textContent = data.temp_max_f + '°F';
    }
    
    // Update sunrise/sunset
    document.getElementById('sunrise').textContent = data.sunrise;
    document.getElementById('sunset').textContent = data.sunset;
    
    // Update moon phase
    document.getElementById('moonName').textContent = data.moon_phase;
    document.getElementById('moonIllumination').textContent = data.moon_illumination + '% Illuminated';
    document.getElementById('moonrise').textContent = data.moonrise;
    document.getElementById('moonset').textContent = data.moonset;
    
    // Update AQI
    animateCounter('aqiValue', 0, data.aqi, 1500);
    
    // Update weather icon
    updateWeatherIcon(data.condition);
    
    // Generate hourly forecast
    generateHourlyForecast();
    
    // Generate forecast
    generateForecast();
    
    // Update timestamp
    updateTimestamp();
}

function updateTemperatureDisplay() {
    const data = mockWeatherData.current;
    
    if (currentUnit === 'C') {
        document.getElementById('tempValue').innerHTML = `
            <span class="temp-number">${data.temp_c}</span>
            <span class="temp-unit">°C</span>
        `;
        document.getElementById('feelsLike').innerHTML = 
            `Feels like <span>${data.feels_like_c}°C</span>`;
        document.getElementById('windSpeed').textContent = data.wind_speed_kmh + ' km/h';
        document.getElementById('windGust').textContent = data.wind_gust_kmh + ' km/h';
        document.getElementById('dewPoint').textContent = data.dew_point_c + '°C';
        document.getElementById('heatIndex').textContent = data.heat_index_c + '°C';
        document.getElementById('windChill').textContent = data.wind_chill_c + '°C';
        document.getElementById('tempMin').textContent = data.temp_min_c + '°C';
        document.getElementById('tempMax').textContent = data.temp_max_c + '°C';
    } else {
        document.getElementById('tempValue').innerHTML = `
            <span class="temp-number">${data.temp_f}</span>
            <span class="temp-unit">°F</span>
        `;
        document.getElementById('feelsLike').innerHTML = 
            `Feels like <span>${data.feels_like_f}°F</span>`;
        document.getElementById('windSpeed').textContent = data.wind_speed_mph + ' mph';
        document.getElementById('windGust').textContent = data.wind_gust_mph + ' mph';
        document.getElementById('dewPoint').textContent = data.dew_point_f + '°F';
        document.getElementById('heatIndex').textContent = data.heat_index_f + '°F';
        document.getElementById('windChill').textContent = data.wind_chill_f + '°F';
        document.getElementById('tempMin').textContent = data.temp_min_f + '°F';
        document.getElementById('tempMax').textContent = data.temp_max_f + '°F';
    }
    
    // Regenerate hourly forecast with new units
    generateHourlyForecast();
    
    // Regenerate daily forecast with new units
    generateForecast();
    
    // Animate temperature number
    const tempNumber = document.querySelector('.temp-number');
    tempNumber.style.animation = 'none';
    setTimeout(() => {
        tempNumber.style.animation = 'countUp 0.8s ease, glow 3s ease-in-out infinite';
    }, 10);
}

function updateWeatherIcon(condition) {
    const iconContainer = document.getElementById('weatherIcon');
    
    // Weather icon SVGs
    const icons = {
        'Sunny': `
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        `,
        'Cloudy': `
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        `,
        'Rainy': `
            <line x1="16" y1="13" x2="16" y2="21"/>
            <line x1="8" y1="13" x2="8" y2="21"/>
            <line x1="12" y1="15" x2="12" y2="23"/>
            <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
        `,
        'Clear': `
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        `,
        'Partly Cloudy': `
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
            <circle cx="12" cy="12" r="3" opacity="0.5"/>
        `
    };
    
    iconContainer.innerHTML = icons[condition] || icons['Sunny'];
}

// ==========================================
// FORECAST GENERATION
// ==========================================

function generateHourlyForecast() {
    const hourlyContainer = document.getElementById('hourlyContainer');
    hourlyContainer.innerHTML = '';
    
    mockWeatherData.hourly.forEach((hour, index) => {
        const card = document.createElement('div');
        card.className = 'hourly-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        const temp = currentUnit === 'C' ? hour.temp_c : hour.temp_f;
        const unit = currentUnit === 'C' ? '°C' : '°F';
        
        card.innerHTML = `
            <div class="hourly-time">${hour.time}</div>
            <div class="hourly-icon">${hour.icon}</div>
            <div class="hourly-temp">${temp}${unit}</div>
            <div class="hourly-precip">💧 ${hour.precip}</div>
        `;
        
        hourlyContainer.appendChild(card);
    });
}

function generateForecast() {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';
    
    mockWeatherData.forecast.forEach((day, index) => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const temp = currentUnit === 'C' ? day.temp_c : day.temp_f;
        const unit = currentUnit === 'C' ? '°C' : '°F';
        
        card.innerHTML = `
            <div class="forecast-day">${day.day}</div>
            <div class="forecast-icon">${day.icon}</div>
            <div class="forecast-temp">${temp}${unit}</div>
            <div class="forecast-condition">${day.condition}</div>
        `;
        
        forecastContainer.appendChild(card);
    });
}

// ==========================================
// ANIMATIONS
// ==========================================

function animateElements() {
    // Animate stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.style.animation = 'none';
        setTimeout(() => {
            item.style.animation = `fadeInUp 0.8s ease ${index * 0.1}s both`;
        }, 10);
    });
    
    // Animate forecast cards
    const forecastCards = document.querySelectorAll('.forecast-card');
    forecastCards.forEach((card, index) => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = `scaleIn 0.5s ease ${index * 0.1}s both`;
        }, 10);
    });
}

function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function updateTimestamp() {
    const now = new Date();
    const minutes = Math.floor(Math.random() * 10) + 1;
    document.getElementById('timestamp').textContent = `Updated ${minutes} min ago`;
}

// ==========================================
// INTERACTIVE FEATURES
// ==========================================

// Hover effect on forecast cards
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const forecastCards = document.querySelectorAll('.forecast-card');
        forecastCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.05)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }, 2500);
});

// Dynamic gradient shift based on time of day
function updateBackgroundGradient() {
    const hour = new Date().getHours();
    const background = document.querySelector('.aurora-background');
    
    if (hour >= 6 && hour < 12) {
        // Morning - lighter blues
        background.style.background = 'linear-gradient(135deg, #0a0a2e, #16213e, #1a1a40)';
    } else if (hour >= 12 && hour < 18) {
        // Afternoon - vibrant
        background.style.background = 'linear-gradient(135deg, #0a0a1f, #0d1137, #1a0d2e)';
    } else if (hour >= 18 && hour < 22) {
        // Evening - warm purples
        background.style.background = 'linear-gradient(135deg, #1a0d2e, #2d1b4e, #1a0d2e)';
    } else {
        // Night - deep dark
        background.style.background = 'linear-gradient(135deg, #050510, #0a0a1f, #050510)';
    }
}

// Particle mouse interaction
document.addEventListener('mousemove', function(e) {
    const particles = document.querySelectorAll('.particle');
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    particles.forEach((particle, index) => {
        const rect = particle.getBoundingClientRect();
        const particleX = rect.left + rect.width / 2;
        const particleY = rect.top + rect.height / 2;
        
        const deltaX = mouseX - particleX;
        const deltaY = mouseY - particleY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < 200) {
            const force = (200 - distance) / 200;
            const moveX = deltaX * force * 0.1;
            const moveY = deltaY * force * 0.1;
            
            particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
            particle.style.transform = 'translate(0, 0)';
        }
    });
});

// Update gradient on load
updateBackgroundGradient();

// Refresh timestamp periodically
setInterval(updateTimestamp, 60000);

// Console log
console.log('%c🌈 Aurora Weather Dashboard', 'color: #00f5ff; font-size: 24px; font-weight: bold;');
console.log('%cPremium Weather Intelligence System', 'color: #0066ff; font-size: 14px;');
console.log('%cDesigned with ❤️ for visual excellence', 'color: #9d4dff; font-size: 12px;');