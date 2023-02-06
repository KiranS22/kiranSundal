$(document).ready(() => {
  

  // Opening modal
  $("#appInstructions").modal("show");
  let allCountries = [];
  let allRestCountries = [];
  let polygons = [];

  // ajax request functions
  const getCountries = () => {
    $.ajax({
      type: "GET",
      url: "libs/php/getCountries.php",
      data: "",
      dataType: "json",
      success: function (response) {
        let countryInfo = response.features;
        allCountries = countryInfo;
        allCountries.sort();
        let str = "";
        countryInfo.forEach((country) => {
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
        // console.log("weather response", response);
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
        // console.log("exchange rate response", response);
        let str = "";
        const usd = response.rates.USD;
        const gbp = response.rates.GBP;
        const eur = response.rates.EUR;

        str += `<li class="rate-li"><span class="currency">$(USD)</span>
        <span id=usd">${usd}</span>
        <li class="rate-li"><span class="currency">€(EUR)</span>
        <span id=eur">${eur}</span>
        <li class="rate-li"><span class="currency">£(GBP)</span>
        <span id=gbp">${gbp}</span>
        </li>`;
        $("#u-result-1").html(str);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("err ");
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const getWikiLinks = (lat, long) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getWikiLinks.php",
      data: { lat: lat, long: long },
      dataType: "json",
      success: function (response) {
        console.log("response from getWikiLinks", response);
        if (response === []) {
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const drawBorders = (country) => {
    console.log("Draw bordfers func", country);
    let countryGeometry = country.geometry;
    let type = countryGeometry.type;
    let correctCoords = [];
    if (type === "MultiPolygon") {
      let multiPolygonCoords = countryGeometry.coordinates;
      console.log("multiPolygonCoords inner first element", multiPolygonCoords);
      for (let i = 0; i < multiPolygonCoords.length; i++) {
        correctCoords = [];
        for (let j = 0; j < multiPolygonCoords[i][0].length; j++) {
          let first = multiPolygonCoords[i][0][j][1];
          let second = multiPolygonCoords[i][0][j][0];
          let tempCords = [];
          tempCords.push(first, second);
          correctCoords.push(tempCords);
          // console.log("multipolygon temp:", tempCords);
        }
        let polygon = L.polygon(correctCoords, {
          color: "red",
          fillColor: "#f03",
        }).addTo(map);
        polygons.push(polygon);
      }
    } else if (type === "Polygon") {
      // console.log(country, "I am a polygon");
      countryGeometry.coordinates[0].forEach((coord) => {
        console.log(coord);
        let first = coord[1];
        let second = coord[0];
        let tempCords = [];
        tempCords.push(first, second);
        correctCoords.push(tempCords);
      });

      //Drawing border
      let polygon = L.polygon(correctCoords, {
        color: "red",
        fillColor: "#f03",
      }).addTo(map);
      polygons.push(polygon);
    }
  };

  const removeBorders = () => {
    for (let i = 0; i < polygons.length; i++) {
      const element = polygons[i];
      if (element !== null) {
        map.removeLayer(element);
      }
    }
  };
  //Calling getCountries to populate select
  getCountries();
  //Calling getRestCountries to get more info
  getRestCountries();

  $("#selectCountries").change(() => {
    let selectval = $("#selectCountries").val();

    if (polygons !== undefined) {
      removeBorders();
    }
    //find t he name in geoCountries that matches select dropdown
    const singleCountry = allCountries.find((c) => {
      return c.properties.name == selectval;
    });

    const singleRestCountry = allRestCountries.find(
      (restCountry) => singleCountry.properties.iso_a3 === restCountry.cca3
    );
    //Displayting data in basic Info modal
    // console.log("SingleCountry from restCountry", singleRestCountry);
    console.log("SingleCountry", singleCountry);
    if (singleRestCountry) {
      $("#result-1").html(singleRestCountry.name.common);
      $("#result-2").html(singleRestCountry.capital[0]);
      $("#result-3").html(singleRestCountry.population);
      $("#result-4").html(
        `<img class="flag" src="${singleRestCountry.flags.png}"/>`
      );
      if (singleRestCountry.borders) {
        let str = "";
        console.log("borders", singleRestCountry.borders);
        singleRestCountry.borders.forEach((border) => {
          str += `<li>${border}</li>`;
        });
        $("#result-5").html(str);
      } else {
        $("#result-5").html("Borders Not Found");
      }
      if (singleRestCountry.subregion) {
        $("#result-6").html(singleRestCountry.subregion);
      } else {
        $("#result-6").html("Subregion Not Found");
      }

      let lat = singleRestCountry.latlng[0];
      let long = singleRestCountry.latlng[1];
      getWeatherInfo(lat, long);
      // Populating Weather modal
      $("#w-result-4").html(lat);
      $("#w-result-5").html(long);
      let countryCurrency = Object.keys(singleRestCountry.currencies)[0];
      // calling getExchangeRate for useful info modal
      getExchangeRate(countryCurrency);
      getWikiLinks(lat, long);
      //makes maker jump to country
      if (marker !== null) {
        map.removeLayer(marker);
      }
      map.panTo([lat, long], { animate: true, duration: 1 });
      marker = L.marker([lat, long]).addTo(map);

      drawBorders(singleCountry);
    } else {
      alert("Country Not Found");
    }
  });
});
