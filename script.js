const API_KEY = '4a1da019e2174503922101710252310';
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

const form = document.getElementById('form');
const cityInput = document.getElementById('cityInput');

const weatherCard = document.getElementById('weatherCard');
const cityNameEl = document.getElementById('cityName');
const weatherIconEl = document.getElementById('weatherIcon');
const descriptionEl = document.getElementById('description');
const tempEl = document.getElementById('temp');
const feelsEl = document.getElementById('feels');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const errorMsgEl = document.getElementById('errorMsg');

form.addEventListener('submit', e => {
  e.preventDefault();
  const city = (cityInput.value || '').trim();
  if (!city) {
    errorMsgEl.textContent = 'Please enter a city name.';
    return;
  }
  fetchWeather(city);
});

async function fetchWeather(city) {
  errorMsgEl.textContent = '';
  weatherCard.classList.add('hidden');

  try {
    const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      errorMsgEl.textContent = data.error.message || 'City not found.';
      return;
    }

    updateUI(data);
  } catch (err) {
    errorMsgEl.textContent = 'Network error. Try again.';
  }
}

function updateUI(data) {
  const loc = data.location || {};
  const cur = data.current || {};
  const cond = cur.condition || {};

  cityNameEl.textContent = `${loc.name || '-'}, ${loc.country || '-'}`;

  let iconUrl = cond.icon || '';
  if (iconUrl && iconUrl.startsWith('//')) iconUrl = 'https:' + iconUrl;
  weatherIconEl.src = iconUrl;
  weatherIconEl.alt = cond.text || '';

  descriptionEl.textContent = cond.text || '';
  tempEl.textContent = cur.temp_c !== undefined ? Math.round(cur.temp_c) : '-';
  feelsEl.textContent = cur.feelslike_c !== undefined ? Math.round(cur.feelslike_c) : '-';
  humidityEl.textContent = cur.humidity !== undefined ? `${cur.humidity}%` : '-';

  // WeatherAPI returns wind in kph — convert to m/s for consistency
  if (cur.wind_kph !== undefined) {
    const mps = (cur.wind_kph / 3.6);
    windEl.textContent = `${Math.round(mps * 10) / 10} m/s`;
  } else {
    windEl.textContent = '-';
  }

  errorMsgEl.textContent = '';
  weatherCard.classList.remove('hidden');
}
