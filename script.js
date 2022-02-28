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
function init() {
	async function getJSON(url) {
		const request = await fetch(url);
		if (!request.ok) throw new Error("Không tìm thấy thành phố bạn tìm kiếm");
		return request.json();
	}

	const renderWeatherStatus = function (input) {
		const city = input.toLowerCase().trim();
		const response = getJSON(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=dc9dda943e5f538fc0507819f258d1b9`
		);
		response.then((data) => {
			console.log(data);

			const timezoneDiff = data.timezone / 3600;
			console.log(timezoneDiff, data.timezone);
			const cityName = locationGeo.firstElementChild;
			const countryName = locationGeo.lastElementChild;

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
		});
	};

	searchInput.addEventListener("keydown", function (e) {
		if (e.code === "Enter" || e.code === "NumpadEnter") {
			renderWeatherStatus(input.value);
			input.value = "";
		}
	});

	searchBtn.addEventListener("click", function () {
		renderWeatherStatus(input.value);
		input.value = "";
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
	function changeElement() {
		const body = document.querySelector("body");
	}
	function changeThemeByCondition(temp, cond) {}
	function calcTime(offset) {
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
		return nd;
	}
}
init();
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

// get Bombay time
//alert(calcTime("Hanoi", 7));

// get Singapore time
//alert(calcTime("Singapore", "+8"));

// // get London time
// alert(calcTime("London", "+1"));
