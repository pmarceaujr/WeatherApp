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
                    let dayTitleCard = $(`#day0${i}Title`)
                    dayTitleCard.text(dayjs.unix(data.daily[i].dt).format('ddd'))
                    let dayIconCard = $(`#day0${i}Icon`)
                    dayIconCard.attr("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png")
                    let dayDescCard = $(`#day0${i}Desc`)
                    dayDescCard.html(`Lo: ${parseInt(data.daily[i].temp.min)}\xB0 F</br>Hi: ${parseInt(data.daily[i].temp.max)}\xB0 F`)

                    console.log(data.daily[i].weather[0].description);
                    console.log(data.daily[i].weather[0].main);
                    console.log(data.daily[i].weather[0].description);

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
                sunCard.html("Sunrise: " + dayjs.unix(data.current.sunrise).format('hh:MM:A') + "</br>Sunset: " + dayjs.unix(data.current.sunset).format('hh:MM:A'))

            })
        }
        else {
            console.log("test3")
            console.log(response)
        }
    });




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
    });