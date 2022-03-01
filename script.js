"use strict";
const search = document.querySelector(".search");
const input = document.querySelector(".search__input");
const locationGeo = document.querySelector(".location__geo");
const locationTime = document.querySelector(".location__time");
const temperature = document.querySelector(".summary-weather__temperature");
const weatherIcon = document.querySelector(".summary-weather__icon");
const descWeather = document.querySelector(".desc-weather");
const pressureStatus = document.querySelector(".pressure-value");
const windStatus = document.querySelector(".wind-value");
const humidityStatus = document.querySelector(".humidity-value");
const searchBtn = document.querySelector(".fas.fa-search");
const searchInput = document.querySelector(".search__input");
const body = document.querySelector("body");

function init(input) {
  const city = input.toLowerCase().trim();
  async function getJSON(url) {
    const response = await fetch(url).then((response) => {
      if (!response.ok)
        throw new Error("Không tìm thấy thành phố bạn tìm kiếm");
      return response.json();
    });

    return response;
  }

  getJSON(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=dc9dda943e5f538fc0507819f258d1b9`
  ).then((data) => {
    console.log(data);
    const cityName = locationGeo.firstElementChild;
    const countryName = locationGeo.lastElementChild;

    const timezoneDiff = data.timezone / 3600;
    cityName.innerText = data.name;
    countryName.innerText = data.sys.country;
    const { description, icon } = data.weather[0];
    descWeather.textContent = description;
    weatherIcon.firstElementChild.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${icon}@2x.png`
    );
    const { temp, pressure, humidity } = data.main;
    temperature.innerHTML = `${Math.round(temp)}<i class="wi wi-celsius"></i
			>`;
    pressureStatus.textContent = `${pressure} hPa`;
    humidityStatus.textContent = `${humidity} %`;
    windStatus.textContent = `${data.wind.speed} m/s`;
    locationTime.textContent = formatDateTime(
      calcTime(timezoneDiff),
      data.sys.country
    );

    changeBgByCondition(data.weather[0].id);
  });

  function formatDateTime(time, country) {
    const newTime = new Intl.DateTimeFormat(country, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(time);
    return newTime;
  }

  function changeBgByCondition(conditonCode) {
    if (conditonCode >= 600 && conditonCode <= 622)
      body.style.backgroundImage = "url(images/ajBVEbr-snow-wallpaper-hd.jpg)";

    if (conditonCode > 700 && conditonCode <= 781)
      body.style.backgroundImage =
        "url(images/wp10508059-winter-mist-desktop-wallpapers.jpg)";

    if (conditonCode === 800)
      body.style.backgroundImage = "url(images/warm_picture.jpg)";

    if (conditonCode > 800 && conditonCode < 805)
      body.style.backgroundImage =
        "url(images/wp7033716-cloudy-day-wallpapers.jpg)";

    if (conditonCode >= 300 && conditonCode <= 321)
      body.style.backgroundImage =
        "url(images/wp6398338-cloudy-day-wallpapers.jpg)";

    if (conditonCode >= 200 && conditonCode <= 232)
      body.style.backgroundImage =
        "url(images/GEtSJ7f-thunderstorm-wallpaper.jpg)";

    if (conditonCode >= 500 && conditonCode <= 531)
      body.style.backgroundImage =
        "url(images/wp5600009-rain-pc-wallpapers.jpg)";
  }
  function calcTime(offset) {
    const d = new Date();

    const utc = d.getTime() + d.getTimezoneOffset() * 60000;

    const nd = new Date(utc + 3600000 * offset);

    return nd;
  }
}

searchInput.addEventListener("keydown", function (e) {
  if (e.code === "Enter" || e.code === "NumpadEnter") {
    init(input.value);
    input.value = "";
  }
});

searchBtn.addEventListener("click", function () {
  init(input.value);
  input.value = "";
});

// function to calculate local time
// in a different city
// given the city's UTC offset
function calcTime(city, offset) {
  // create Date object for current location
  const d = new Date();

  // convert to msec
  // add local time zone offset
  // get UTC time in msec
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;

  // create new Date object for different city
  // using supplied offset
  const nd = new Date(utc + 3600000 * offset);

  // return time as a string
  return "The local time in " + city + "is " + nd.toLocaleString();
}

// get Singapore time
//alert(calcTime("Singapore", "+8"));

// // get London time
// alert(calcTime("London", "+1"));
