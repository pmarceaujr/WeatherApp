//alert("HERE")
///lat: 42.9956
///lon: -71.4548
let oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=42.9956&lon=-71.4548&appid=5ed5e49ac39b037ea9bc2e6bc2eab0a6&units=imperial"
let weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=Manchester,NH,USA&Appid=5ed5e49ac39b037ea9bc2e6bc2eab0a6&units=imperial"
//


fetch(oneCallUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data.daily.length)
                console.log(data)
                for (let i = 1; i < data.daily.length; i++) {
                    console.log(data.daily[i].weather[0].description);
                    console.log(data.daily[i].weather[0].icon);
                    console.log(data.daily[i].weather[0].main);
                    console.log(data.daily[i].weather[0].description);
                    console.log(data.daily[i].temp.min); //0 is the current date.... 1-7 are the next 7 days
                    console.log(data.daily[i].temp.max);
                    console.log(data.daily[i].dt);
                }
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
                sunCard.html("Sunrise: " + data.current.sunrise + "</br>Sunset: " + data.current.sunset)
                //let dewCard = $("#dewpoint")
                //   (data.current.sunset)
                //For the current day weather (left side)
                console.log(data.current.feels_like)
                console.log(data.current.temp)
                console.log(data.current.weather[0].icon)
                console.log(data.current.dt)
            })
        }
        else {
            console.log("test3")
            console.log(response)
        }
    });



/*
fetch(weatherUrl)
.then(function (response1) {
    console.log("response1")
    console.log(response1)
    if (response1.ok) {
        console.log(response1)
        console.log("test11")
        response1.json().then(function (data1) {
            console.log("realy1")
            console.log(data1)
            console.log(data1.base)
            console.log("yes,realy1")
        })
    }
    else {
        console.log("test31")
        console.log(response1)
    }
});*/