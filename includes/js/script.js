//alert("HERE")
let latitude;                   //latitude of the city to pass to OneCall for weather data
let longitude;                  //longitude of the city to pass to OneCall for weather data
let inputCityState;             //City State, user input field
let selectCityState;            //City State, user selection field
let searchCityState;            //used to pass to the OneCAll API
let okToProceed;                //Boolean to control logic flow
let cityWeatherList = [];       //arry to store the locastorage city/state values in to build the option list

// Add event listener to search button
searchBtn.addEventListener("click", function () {
    okToProceed = checkCityEntry()
    if (okToProceed) {
        okToProceed = callTheAPIs()
    }
    //  $('#selectCityState').append($('<option value="" disabled selected >Enter a location or select from the list...</option>'))

    //  }

})


//Function that formats the entry to all UPPER CASE, removes any spaces from the users entry and verifies that values are entered
function checkCityEntry() {

    inputCityState = $("#inputCityState").val().replace(/\s/g, "");
    selectCityState = $("#selectCityState").val()
    if (inputCityState == "" && selectCityState == null) {
        alert('Please enter a "city,state" combo  or select one from the list')
        okToProceed = false
    }
    else if (selectCityState != null && inputCityState != "" && (!(inputCityState.includes(",")))) {
        alert('Your entry for city and state must be separated by a comma (,) please try again.')
        searchCityState = inputCityState.toUpperCase()
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
function callTheAPIs() {
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCityState},US&Appid=5ed5e49ac39b037ea9bc2e6bc2eab0a6&units=imperial`
    fetch(weatherUrl)
        .then(function (response1) {
            if (response1.ok) {
                return response1.json()
            }
            else {
                okToProceed = false
                // console.log("uggg3" + okToProceed)
                alert("Error finding the city,state you entered.")
                return Promise.reject("Error finding the city,state you entered.")
            }
        })
        .then(function (data1) {
            latitude = data1.coord.lat
            longitude = data1.coord.lon
            //set up the second fetch to return the actual weather data once we get valid longitude and latitude values.
            let oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=5ed5e49ac39b037ea9bc2e6bc2eab0a6&units=imperial`
            return fetch(oneCallUrl);
        })
        .then(function (response2) {
            if (response2.ok) {
                return response2.json()
            }
            else {
                //okToProceed = false
                //console.log("uggg2" + okToProceed)
                return Promise.reject(response2)
            }
        })
        .then(function (data2) {
            getWeather(data2)
            //call a function to process the returned data.
        })
        .catch(e => {
            //okToProceed = false
            console.log(e)
        })
};

// getWeather function uses the lat/lon of the city, state that was entered or selected to callthe OneCall Weather API for the full weather details
function getWeather(data2) {
    for (let i = 1; i < 6; i++) {
        let dayTitleCard = $(`#day0${i}Title`)
        dayTitleCard.text(dayjs.unix(data2.daily[i].dt).format('ddd    MM/DD'))
        let dayIconCard = $(`#day0${i}Icon`)
        dayIconCard.attr("src", "http://openweathermap.org/img/wn/" + data2.daily[i].weather[0].icon + ".png")
        let dayDescCard = $(`#day0${i}Desc`)
        dayDescCard.html(`Lo: ${parseInt(data2.daily[i].temp.min)}\xB0 F</br>Hi: ${parseInt(data2.daily[i].temp.max)}\xB0 F</br>Humid: ${data2.daily[i].humidity} %</br>Wind: ${data2.daily[i].wind_speed} MPH `)
    }
    //For the current day weather
    let weatherTitle = $("#weatherTitle")
    weatherTitle.text(`The Week Ahead: ${searchCityState}`)
    let curDateCard = $("#currentTitle")
    curDateCard.text(dayjs.unix(data2.current.dt).format('ddd, MMM DD, YYYY'))
    let curIconCard = $("#currentIcon")
    curIconCard.attr("src", "http://openweathermap.org/img/wn/" + data2.current.weather[0].icon + "@2x.png")
    let currTempCard = $("#currentTemp")
    currTempCard.text(`Temp: ${data2.current.temp}`)
    let currCondCard = $("#currentDesc")
    currCondCard.text(`Conditions: ${data2.current.weather[0].main}`)
    let currUviCard = $("#currentUvi")
    currUviCard.text(`UV Index: ${data2.current.uvi}`)
    //For the detail cards Add to HTML
    let dewCard = $("#dewpoint")
    dewCard.text(`${data2.current.dew_point}\xB0 F`)
    let windCard = $("#wind")
    windCard.text(`${data2.current.wind_speed} MPH`)
    let humidCard = $("#humidity")
    humidCard.text(`${data2.current.humidity} %`)
    let uviCard = $("#uvIndex")
    uviCard.text(data2.current.uvi)
    let visCard = $("#visibility")
    visCard.text(`${(parseInt(data2.current.visibility) / 1609).toFixed(2)} Mi`)
    let sunCard = $("#sunrise")
    sunCard.html("Sunrise: " + dayjs.unix(data2.current.sunrise).format('hh:MM:A') + "</br>Sunset: " + dayjs.unix(data2.current.sunset).format('hh:MM:A'))
    // UV index: < 3 favorable; 3-5 moderate; 6-7 severe; 8+ extreme
    if (parseInt(data2.current.uvi) < 3) {
        $("#currentUvi").addClass("uviGood")
    }
    else if (parseInt(data2.current.uvi) < 6) {
        $("#currentUvi").addClass("uviModerate")
    }
    else if (parseInt(data2.current.uvi) < 8) {
        $("#currentUvi").addClass("uviBad")
    }
    else {
        $("#currentUvi").addClass("uviExtreme")
    }
    saveTheCity()
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
    loadCityWeatherList()
}

//code to load the saved cities from localstorage into the options of the select input
function loadCityWeatherList() {
    $("#selectCityState").empty();
    $('#selectCityState').append($('<option value="" disabled selected >Enter a location or select from the list...</option>'))
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
//localStorage.removeItem("cityWeatherList");