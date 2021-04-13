//alert("HERE")
let latitude;
let longitude;
let inputCityState;
let selectCityState;
let searchCityState;
let okToProceed;
let cityWeatherList = [];

// Add event listener to search button
searchBtn.addEventListener("click", function () {
    okToProceed = checkCityEntry()
    if (okToProceed) {
        okToProceed = getLongLat()
    }
    if (okToProceed) {
        okToProceed = getWeather()
    }
    $("#selectCityState").val('');//Reset the picklist after the weater dispalys
    saveTheCity()
    loadCityWeatherList()
});


function checkCityEntry() {
    inputCityState = $("#inputCityState").val().replace(/\s/g, "");
    selectCityState = $("#selectCityState").val()
    if (inputCityState == "" && selectCityState == null) {
        alert('Please enter a "city,state" combo  or select one from the list')
        okToProceed = false
    }
    else if (selectCityState != null && inputCityState != "") {
        alert('You entered a "city,state" combo and selected one from the picklist, so the typed in value will override your entries.')
        searchCityState = inputCityState.toUpperCase()
        okToProceed = true
    }
    else if (selectCityState != null) {
        searchCityState = selectCityState.toUpperCase()
        okToProceed = true
    }
    else {
        if (inputCityState.includes(",")) {
            searchCityState = inputCityState.toUpperCase()
            okToProceed = true
        }
        else {
            alert('Your entry for city and state must be separated by a comma (,) please try again.')
            okToProceed = false
        }
    }
    return okToProceed
};

// getLongLat function uses the city, state that was entered or selected to get the lat/lon to pass to the OneCall Weather API for the full weather details
function getLongLat() {
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCityState},USA&Appid=5ed5e49ac39b037ea9bc2e6bc2eab0a6&units=imperial`
    fetch(weatherUrl)
        .then(function (response1) {
            if (response1.ok) {
                response1.json().then(function (data1) {
                    latitude = data1.coord.lat
                    longitude = data1.coord.lon
                    okToProceed = true
                })
            }
            else {

                console.log(response1)
                okToProceed = false
            }
        })
    return okToProceed
};

// getWeather function uses the lat/lon of the city, state that was entered or selected to callthe OneCall Weather API for the full weather details
function getWeather() {
    let oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=5ed5e49ac39b037ea9bc2e6bc2eab0a6&units=imperial`
    fetch(oneCallUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    //Loop to populate the 5-day forecast
                    for (let i = 1; i < 6; i++) {
                        let dayTitleCard = $(`#day0${i}Title`)
                        dayTitleCard.text(dayjs.unix(data.daily[i].dt).format('ddd'))
                        let dayIconCard = $(`#day0${i}Icon`)
                        dayIconCard.attr("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png")
                        let dayDescCard = $(`#day0${i}Desc`)
                        dayDescCard.html(`Lo: ${parseInt(data.daily[i].temp.min)}\xB0 F</br>Hi: ${parseInt(data.daily[i].temp.max)}\xB0 F</br>Humid: ${data.daily[i].humidity} %</br>Wind: ${data.daily[i].wind_speed} MPH `)
                    }
                    //For the current day weather
                    let weatherTitle = $("#weatherTitle")
                    weatherTitle.text(`The Week Ahead: ${searchCityState}`)
                    let curDateCard = $("#currentTitle")
                    curDateCard.text(dayjs.unix(data.current.dt).format('ddd, MMM DD, YYYY'))
                    let curIconCard = $("#currentIcon")
                    curIconCard.attr("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png")
                    let currTempCard = $("#currentTemp")
                    currTempCard.text(`Temp: ${data.current.temp}`)
                    let currCondCard = $("#currentDesc")
                    currCondCard.text(`Conditions: ${data.current.weather[0].main}`)
                    let currUviCard = $("#currentUvi")
                    currUviCard.text(`UV Index: ${data.current.uvi}`)
                    //For the detail cards Add to HTML
                    let dewCard = $("#dewpoint")
                    dewCard.text(`${data.current.dew_point}\xB0 F`)
                    let windCard = $("#wind")
                    windCard.text(`${data.current.wind_speed} MPH`)
                    let humidCard = $("#humidity")
                    humidCard.text(`${data.current.humidity} %`)
                    let uviCard = $("#uvIndex")
                    uviCard.text(data.current.uvi)
                    let visCard = $("#visibility")
                    visCard.text(`${(parseInt(data.current.visibility) / 1609).toFixed(2)} Mi`)
                    let sunCard = $("#sunrise")
                    sunCard.html("Sunrise: " + dayjs.unix(data.current.sunrise).format('hh:MM:A') + "</br>Sunset: " + dayjs.unix(data.current.sunset).format('hh:MM:A'))
                    // UV index: < 3 favorable; 3-5 moderate; 6-7 severe; 8+ extreme
                    if (parseInt(data.current.uvi) < 3) {
                        $("#currentUvi").addClass("uviGood")
                    }
                    else if (parseInt(data.current.uvi) < 6) {
                        $("#currentUvi").addClass("uviModerate")
                    }
                    else if (parseInt(data.current.uvi) < 8) {
                        $("#currentUvi").addClass("uviBad")
                    }
                    else {
                        $("#currentUvi").addClass("uviExtreme")
                    }
                })
                okToProceed = true
            }
            else {
                console.log(response)
                okToProceed = false
            }
        })
    return okToProceed
};

function saveTheCity() {
    let matchFound = false
    cityWeatherList = JSON.parse(localStorage.getItem("cityWeatherList"));

    if (!cityWeatherList) {
        localStorage.setItem("cityWeatherList", JSON.stringify(""));
        cityWeatherList = []
    }
    if (cityWeatherList) {
        for (let i = 0; i <= cityWeatherList.length; i++) {
            if (cityWeatherList[i] == searchCityState) {
                matchFound = true
                break;
            }
        }
        if (!matchFound) {
            cityWeatherList.push(searchCityState)
            localStorage.setItem("cityWeatherList", JSON.stringify(cityWeatherList));
        }
    }


}
//localStorage.removeItem("cityWeatherList");

//code to load the saved cities from localstorage into the options of the select input
function loadCityWeatherList() {
    cityWeatherList = JSON.parse(localStorage.getItem("cityWeatherList"));
    if (cityWeatherList) {
        for (let i = 0; i <= cityWeatherList.length; i++) {
            $('#selectCityState').append($('<option>', {
                value: cityWeatherList[i],
                text: cityWeatherList[i]
            }));
        }
    }
};

loadCityWeatherList()
