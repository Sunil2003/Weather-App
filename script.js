let cityName = document.querySelector(".weather_city");
let dateTime = document.querySelector(".weather_date_time");
let w_forecast = document.querySelector(".weather_forecast");
let w_icon = document.querySelector(".weather_icon");
let w_temperature = document.querySelector(".weather_temperature");
let w_minTem = document.querySelector(".weather_min");
let w_maxTem = document.querySelector(".weather_max");

let w_feelsLike = document.querySelector(".weather_feelsLike");
let w_humidity = document.querySelector(".weather_humidity");
let w_wind = document.querySelector(".weather_wind");
let w_pressure = document.querySelector(".weather_pressure");

let citySearch = document.querySelector(".weather_search");

let city;

const getAltitudes = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      getCityName(latitude, longitude,(cityVal)=>{
        city = `${cityVal}`
        getWeatherData();
      });
    },
    (error) => {
      console.log(error.message);
    }
  );
};

const getCityName = async (latitude, longitude, callback) => {
  let apiKey = `627b00aee18b4f40a518df85ea59ea6a`;
  const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
  try {
    const resL = await fetch(apiUrl);
    const data = await resL.json();
    console.log(data.results[0].components);

    const { city } = data.results[0].components;
    callback(city);

    
  } catch (error) {
    console.log(error.message);
    callback('unknown');
  }
};

citySearch.addEventListener("submit", (e) => {
  e.preventDefault();

  let cityName = document.querySelector(".city_name");
  city = cityName.value;

  getWeatherData();

  cityName.value = "";
});

const getCountryName = (code) => {
  return new Intl.DisplayNames([code], { type: "region" }).of(code);
};

const getCurrentDateTime = (dt) => {
  let currDate = new Date(dt * 1000);

  let options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(currDate);
};

const getWeatherData = async () => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d9b14121d978f504a9e5d1da5d7a6f2e`;

  try {
    const res = await fetch(weatherUrl);
    const data = await res.json();
    console.log(data);

    const { main, name, weather, wind, sys, dt } = data;

    cityName.innerHTML = `${name}, ${getCountryName(sys.country)}`;
    dateTime.innerHTML = `${getCurrentDateTime(dt)}`;
    w_forecast.innerHTML = weather[0].main;
    w_icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather[0].icon}@4x.png" />`;
    w_temperature.innerHTML = `${(main.temp - 273.15).toFixed(0)}&#176C`;
    w_minTem.innerHTML = `MIN : ${(main.temp_min - 273.15).toFixed(2)}&#176C`;

    w_maxTem.innerHTML = `MAX : ${(main.temp_max - 273.15).toFixed(2)}&#176C`;
    w_feelsLike.innerHTML = `${(main.feels_like - 273.15).toFixed(2)}&#176C`;
    w_humidity.innerHTML = `${main.humidity}%`;
    w_wind.innerHTML = `${(wind.speed * 3600)} Km/h`;
    w_pressure.innerHTML = `${main.pressure} hPa`;
  } catch (error) {
    console.log(error);
  }
};

document.body.addEventListener("load", getAltitudes());
