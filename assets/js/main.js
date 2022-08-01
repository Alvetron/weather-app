const API_KEY = '3a28fe5c269f4e0bac0114239223107';
const MAIN_URL = `http://api.weatherapi.com/v1/forecast.json?key=`;

const body = document.querySelector('body');

const loaderEl = document.querySelector('.loader');

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-form__input');
const searchBtn = document.querySelector('.search-form__btn');

const currentDateEl = document.querySelector('.current-weather__date');
const currentTimeEl = document.querySelector('.current-weather__time');
const cityEl = document.querySelector('.current-weather__city');
const currentWeatherImgEl = document.querySelector('.current-weather__img');
const currentWeatherTempEl = document.querySelector('.current-weather__temp');
const currentWeatherDayEl = document.querySelector('.current-weather__day');

const userDate = new Date();
let isRefreshed = false;

const errorPopup = document.querySelector('.error-popup');
const refreshBtn = document.querySelector('.error-popup__refresh');

removeLoader();
refreshUserTime();
searchByInput();
getWeather('London');

function refreshUserTime() {
  const newDate = new Date();
  const delay = (60 - newDate.getSeconds());

  if(!isRefreshed) {
    isRefreshed = true;
    currentTimeEl.textContent = `${userDate.getHours()}:${userDate.getMinutes() < 10 ? `0${userDate.getMinutes()}` : userDate.getMinutes()}`;
  }

  currentTimeEl.textContent = `${newDate.getHours()}:${newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : newDate.getMinutes()}`;
  
  setTimeout(refreshUserTime, delay * 100);
}

function removeLoader() {
  setTimeout(() => {
    loaderEl.classList.remove('active');
  }, 1000);
}

function searchByInput() {
  searchBtn.addEventListener('click', e => {
    if (!searchInput.value) {
      searchInput.classList.toggle('active');
      return;
    }
    searchByName(e)
  })

  searchForm.addEventListener('submit', searchByName);

  function searchByName(e) {
    e.preventDefault();
    getWeather(searchInput.value);
    searchInput.value = '';
    searchInput.classList.remove('active');
  }
}

async function getWeather(city) {
  const resp = await fetch(`${MAIN_URL + API_KEY}&q=${city}&days=7`)
  .catch(error => {
    errorPopup.classList.add('active');
  });


  const respJson = await resp.json();
  const respData = respJson;

  getBgByCurrentWeather(respData);
  showCurrentWeather(respData);
  showForecastWeather(respData);
}

function getBgByCurrentWeather(data) {
  const weatherCode = data.current.condition.code;

  body.classList[0] ? body.classList.remove(body.classList[0]) : '';

  if (weatherCode === 1000) {
    body.classList.add('sun-bg');
  }
  else if (weatherCode === 1003 || weatherCode === 1006 || weatherCode === 1009 || weatherCode === 1030) {
    body.classList.add('cloud-bg');
  }
  else {
    body.classList.add('other-bg');
  }

}

function showCurrentWeather(data) {
  const currentWeather = data.current;
  const imgUrl = currentWeather.condition.icon;
  const temp = currentWeather.feelslike_c;

  city = data.location.name;
  currentDateEl.textContent = getFormattedDate(userDate);
  cityEl.textContent = city;
  currentWeatherImgEl.src = `https:${getBigImg(imgUrl)}`;
  currentWeatherTempEl.textContent = Math.round(temp);
  currentWeatherDayEl.textContent = getDayName(userDate, 'long')
}

function showForecastWeather(data) {
  const forecast = data.forecast.forecastday;
  let elems = '';

  for (let i = 1; i < forecast.length; i++) {
    const date = new Date(forecast[i].date);

    elems +=
      `
    <li class="forecast__item">
      <img class="forcast__img" src="http://${forecast[i].day.condition.icon}" alt="" width="64" height="64">
      <p class="forecast__temp">${Math.round(forecast[i].day.maxtemp_c)}</p>
      <p class="forecast__day">${getDayName(date, 'short')}</p>
    </li>
    `
  }

  document.querySelector('.forecast__list').innerHTML = elems;
}

function getDayName(date, length) {
  return date.toLocaleDateString('en-EN', { weekday: length })
}

function getFormattedDate(date) {
  return date.toLocaleDateString('en-EN', { weekday: 'long', day: 'numeric', month: 'long' })
}

function getBigImg(url) {
  let newUrl = url.split('/');
  newUrl[4] = '128x128'
  return newUrl.join('/');
}


refreshBtn.addEventListener('click', () => {
  document.location.reload();
})