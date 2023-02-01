$(document).ready(function () {
  // Opening modal
  $("#appInstructions").modal("show");
  let allCountries = [];
  let allRestCountries = [];

  // ajaz request functions
  const getCountries = () => {
    $.ajax({
      type: "GET",
      url: "libs/php/getCountries.php",
      data: "",
      dataType: "json",
      success: function (response) {
        // console.log("Countries from json", response.features);

        let countryInmfo = response.features;
        allCountries = countryInmfo;
        let str = "";
        countryInmfo.forEach((country) => {
          // console.log('',country);
          str += `<option value="${country.properties.name}">${country.properties.name}</option>`;
        });
        $("#selectCountries").append(str);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const getRestCountries = () => {
    $.ajax({
      type: "GET",
      url: "libs/php/getRestCountries.php",
      dataType: "json",
      success: function (response) {
        console.log(response);
        allRestCountries = response;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("err ");
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const getWeatherInfo = (lat, long) => {
    console.log("getWeatherInfo running");
    $.ajax({
      type: "GET",
      url: "libs/php/getWeather.php",
      data: { lat: lat, long: long },
      dataType: "json",
      success: function (response) {
        console.log("weather response", response);
        weatherInfo = response;
        let t = (parseFloat(response.main.temp) - 273.15).toFixed(2);

        let t_diff = parseInt(response.timezone) / 3600; //Converting into UTC

        let t_utc = t_diff > 0 ? `UTC +${t_diff}` : `UTC ${t_diff}`;
        // Populating weather Modal
        $("#w-result-1").html(response.weather[0].description);
        $("#w-result-2").html(t);
        $("#w-result-3").html(t_utc);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("err ");
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const getExchangeRate = (currency) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getExchangeRate.php",
      data: { currency: currency },
      dataType: "json",
      success: function (response) {
        console.log("exchange rate response", response);
        let str = "";
        const usd = response.rates.USD;
        const gbp = response.data.GBP;
        const eur = response.rates.EUR;
        console.log("usd", usd);
        console.log("gbp", gbp);
        console.log("eur", eur);

        // if(response.rates.rate === "USD"&&)
        // str += `<li class="rate-li"><span clas="currency"></span>
        // <span clas=rate"></span>
        // </li>`;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("err ");
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  //Calling getCountries to populate select
  getCountries();
  //Calling getRestCountries to get more info
  getRestCountries();

  $("#selectCountries").change(() => {
    let selectval = $("#selectCountries").val();

    //find t he name in geoCountries that matches select dropdown
    const singleCountry = allCountries.find((c) => {
      return c.properties.name == selectval;
    });

    const singleRestCountry = allRestCountries.find(
      (restCountry) => singleCountry.properties.iso_a3 === restCountry.cca3
    );
    //Displayting data in basic Info modal
    console.log("SingleCountry from restCountry", singleRestCountry);
    $("#result-1").html(singleRestCountry.name.common);
    $("#result-2").html(singleRestCountry.capital[0]);
    $("#result-3").html(singleRestCountry.population);

    $("#result-4").html(
      `<img class="flag" src="${singleRestCountry.flags.png}"/>`
    );

    let str = "";
    singleRestCountry.borders.forEach((border) => {
      str += `<li>${border}</li>`;
    });
    $("#result-5").html(str);
    $("#result-6").html(singleRestCountry.subregion);

    let lat = singleRestCountry.latlng[0];
    let long = singleRestCountry.latlng[1];
    getWeatherInfo(lat, long);
    // Populating Weather modal
    $("#w-result-4").html(lat);
    $("#w-result-5").html(long);
    let countryCurrency = Object.keys(singleRestCountry.currencies)[0];
    // calling getExchangeRate for useful info modal
    getExchangeRate(countryCurrency);
  });
});
