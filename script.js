const timeEl= document.getElementById('time');
const inputval = document.querySelector('.cityinput');
const btn = document.getElementById('add');
const city = document.querySelector('.cityoutput');
const weather_icon= document.querySelector('.weather-icon');
const descrip = document.querySelector('.description');
const temperature = document.querySelector('.temperature');
const humidity= document.querySelector('.humidity');
const pressure = document.querySelector('.pressure');
const wind_speed = document.querySelector('.wind-speed');
const w_icon = document.querySelector('.image');
const forecastContainer = document.getElementById('weather-forecast');

// const Time= document.querySelector('.time');
// const Feels_Like= document.querySelector('.feels-like');
setInterval(()=>{

  const time = new Date();
  const hour=time.getHours();
  const hoursIn12HrFormat = hour >=13 ? hour %12:hour
  const mintues = time.getMinutes();
  
  const ampm = hour >=12 ? 'PM' : 'AM'

  // timeEl.innerHTML = hoursIn12HrFormat + ':' + mintues + '' + `<span id ="am-pm"> ${ampm} </span>`
  const formattedHours = hoursIn12HrFormat.toString().padStart(2, '0');
  const formattedMinutes = mintues.toString().padStart(2, '0');
  timeEl.innerHTML = `${formattedHours}:${formattedMinutes} <span id="am-pm">${ampm}</span>`;
 

},1000);
async function checkWeather(city){


    const api_key = "987229f70b6d170cb1ae2ed99e72aecf";
    const url =` https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
    const weather_data = await fetch(`${url}`).then(response => response.json());

     console.log(weather_data);

    temperature.innerHTML=`${Math.round(weather_data.main.temp - 273.15)}°C`;
    descrip.innerHTML=`${weather_data.weather[0].description}`;
    humidity.innerHTML=`${weather_data.main.humidity}%`;
    pressure.innerHTML=`${weather_data.main.pressure}`;
    w_icon.innerHTML=`<img src="https://openweathermap.org/img/wn/${weather_data.weather[0].icon}@2x.png">`;
    wind_speed.innerHTML=`${weather_data.wind.speed} KM/H`;
    document.body.style.backgroundImage = "url('http://source.unsplash.com/1600x900/?" + city + " ')"
  
   // Feels_Like.innerHTML=`${weather_data.main.feels_like}`;
   


}

// btn.addEventListener('click', ()=>{

//   checkWeather(inputval.value);
 
// });



async function getForecast(city) {
  const api_key = "987229f70b6d170cb1ae2ed99e72aecf";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city} & exclude=hourly&appid=${api_key}`;
  const forecast_data = await fetch(url).then(response => response.json());
 updateForecastUI(forecast_data);
 console.log(forecast_data);

  return forecast_data;
}


function updateForecastUI(forecastData) {
  forecastContainer.innerHTML = ''; // Clear previous forecast data

  const uniqueDays = new Set(); // To track unique days

  for (const forecast of forecastData.list) {
    const forecastTime = new Date(forecast.dt * 1000);
    const forecastDayOfWeek = forecastTime.toLocaleDateString('en-US', { weekday: 'short' });
    const forecastDayOfMonth = forecastTime.getDate();
    // Check if this day has already been added
    if (uniqueDays.has(forecastDayOfWeek)) {
      continue; // Skip this iteration
    }

    uniqueDays.add(forecastDayOfWeek);

    const forecastIcon = forecast.weather[0].icon;
    const forecastTemperature = Math.round(forecast.main.temp - 273.15);

    const forecastItem = document.createElement('div');
    forecastItem.classList.add('weather-forecast-item');
    forecastItem.innerHTML = `
      <div class="day">${forecastDayOfWeek}</div>
      <img src="https://openweathermap.org/img/wn/${forecastIcon}@2x.png" alt="weather icon" class="w-icon">
      <div class="temp">${forecastTemperature}°C</div>
    `;

    forecastContainer.appendChild(forecastItem);
  }
}
btn.addEventListener('click', async () => {
  const cityName = inputval.value;

  // Fetch current weather
  const currentWeatherData = await checkWeather(cityName);

  // Fetch 5-day forecast
  const forecastData = await getForecast(cityName);

  // Update UI
  temperature.innerHTML = `${Math.round(currentWeatherData.main.temp - 273.15)}°C`;
  descrip.innerHTML = `${currentWeatherData.weather[0].description}`;
  humidity.innerHTML = `${currentWeatherData.main.humidity}%`;
  pressure.innerHTML = `${currentWeatherData.main.pressure}`;
  w_icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png">`;

  //updateForecastUI(forecastData);
});