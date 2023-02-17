// map initalisation, modal buttons and markers

// Getting current location
$(document).ready(() => {
  let allCountries = [];
  let allRestCountries = [];
  let polygons = [];
  let countryNameFromOpenCage = null; 
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
        // console.log("get restCountries ");
        console.log(response);
        allRestCountries = response.data;
        console.log("OpenCage allRestCountries", allRestCountries);
        const singleRestCountry = allRestCountries.find(
          (restCountry) => restCountry.name.common === countryNameFromOpenCage
          // response.results[0].components["ISO_3166-1_alpha-3"] ===
          // restCountry.cca3
        );
        //find t he name in geoCountries that matches select dropdown
        let selectval = $("#selectCountries").val();
        // console.log("selectVal before find ", countryNameFromOpenCage);
        // console.log("All Countries", allCountries);
        const singleCountry = allCountries.find((c) => {
          // console.log("name in find  ", c.properties.name);
          return c.properties.name == countryNameFromOpenCage;
        });
        $("#selectCountries").val(countryNameFromOpenCage);
        // console.log("Open cage singleRestCountry ", singleRestCountry);
        //Displayting data in basic Info modal
        // console.log("SingleCountry from restCountry", singleRestCountry);
        if (singleRestCountry) {
          $("#result-1").html(singleRestCountry.name.common);
          $("#result-2").html(singleRestCountry.capital[0]);
          $("#result-3").html(singleRestCountry.population);
          $("#result-4").html(
            `<img class="flag" src="${singleRestCountry.flags.png}"/>`
          );
          if (singleRestCountry.borders) {
            let str = "";
            // console.log("borders", singleRestCountry.borders);
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
          // if (marker !== null) {
          //   map.removeLayer(marker);
          // }
          // map.panTo([lat, long], { animate: true, duration: 1 });
          // marker = L.marker([lat, long]).addTo(map);

          drawBorders(singleCountry);
        } else {
          alert("Country Not Found");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("err ");
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  const getWeatherInfo = (lat, long) => {
    // console.log("getWeatherInfo running");
    $.ajax({
      type: "GET",
      url: "libs/php/getWeather.php",
      data: { lat: lat, long: long },
      dataType: "json",
      success: function (response) {
        console.log("weather response", response);
        weatherInfo = response.data;
        let t = (parseFloat(response.data.main.temp) - 273.15).toFixed(2);

        let t_diff = parseInt(response.data.timezone) / 3600; //Converting into UTC

        let t_utc = t_diff > 0 ? `UTC +${t_diff}` : `UTC ${t_diff}`;
        // Populating weather Modal
        $("#w-result-1").html(response.data.weather[0].description);
        $("#w-result-2").html(t);
        $("#w-result-3").html(t_utc);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("err ");
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const getCountryByCoord = (lat, long) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getCountryByCoord.php",
      data: { lat: lat, long: long },
      dataType: "json",
      success: function (response) {
        console.log("response from opencage", response);

        //Fetching Country from openCage
        countryNameFromOpenCage = response.data.results[0].components.country;
        // console.log("Open cage Country", country);
      },
      error: function (jqXHR, textStatus, errorThrown) {
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
        const usd = response.data.rates.USD;
        const gbp = response.data.rates.GBP;
        const eur = response.data.rates.EUR;

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
        if (response.data.geonames !== []) {
          let wikiInfo = response.data.geonames;
          let linksToDisplay = wikiInfo.slice(0, 3).map((url) => {
            let fullUrl = "https://" + url.wikipediaUrl;
            return fullUrl;
          });
          console.log("links to display ", linksToDisplay);
          //loop over returned array
          let str = "";
          linksToDisplay.forEach((link) => {
            str = `link(<li>${link}</li>)`;
          });
          $("#u-result-2").html(str);

          // console.log("country wiki link", response.geonames[0].wikipediaUrl);
        } else {
          $("#S u-result-2").html(`<p>No articles found</p>`);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const drawBorders = (country) => {
    // console.log("Draw bordfers func", country);
    let countryGeometry = country.geometry;
    let type = countryGeometry.type;
    let correctCoords = [];
    if (type === "MultiPolygon") {
      let multiPolygonCoords = countryGeometry.coordinates;
      // console.log("multiPolygonCoords inner first element", multiPolygonCoords);
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
        // console.log(coord);
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
  // Getting current location
  let map = L.map("map");
  let marker;
  function getGeoeolocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        // console.log("position in geolocation", position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        // console.log(lat, lon);
        let location = [];
        location.push(lat, lon);
        map.setView(location, 6);
        marker = L.marker(location).addTo(map);
        // call  getting country by coordinate
        //Calling getCountries to populate select
        getCountries();
        //Calling getRestCountries to get more info
        getRestCountries();

        getCountryByCoord(lat, lon);
        getWeatherInfo(lat, lon);
        getWikiLinks(lat, lon);

        return location;
      });
    }
  }
  let view = getGeoeolocation();

  var MapTilesAPI_OSMEnglish = L.tileLayer(
    "https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key=c4edb04533mshba882524ef1f0e1p1f0643jsna3c2c78e057f",
    {
      attribution:
        '&copy; <a href="http://www.maptilesapi.com/">MapTiles API</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      apikey: "c4edb04533mshba882524ef1f0e1p1f0643jsna3c2c78e057f",
      maxZoom: 19,
    }
  ).addTo(map);

  //easy buttons
  // Triggers basic Contry Infomatiobn Modal
  L.easyButton("fa-globe", function (btn, map) {
    if ($("#selectCountries").val() === "") {
      alert("Please Select a Country");
    } else {
      let basicCountryImfo = new bootstrap.Modal($("#countryInfo"), {});
      basicCountryImfo.show();
    }
  }).addTo(map);

  // Triggers basic Weather  Modal
  L.easyButton("fa-cloud", function (btn, map) {
    if ($("#selectCountries").val() === "") {
      alert("Please Select a Country");
    } else {
      let weatherModal = new bootstrap.Modal($("#weatherInfo"), {});
      weatherModal.show();
    }
  }).addTo(map);

  // Triggers useful information  Modal
  L.easyButton("fa-circle-info", function (btn, map) {
    if ($("#selectCountries").val() === "") {
      alert("Please Select a Country");
    } else {
      let usefulInfoModal = new bootstrap.Modal($("#usefulInfo"), {});
      usefulInfoModal.show();
    }
  }).addTo(map);

  // Opening modal
  $("#appInstructions").modal("show");

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
    // console.log("SingleCountry", singleCountry);
    if (singleRestCountry) {
      $("#result-1").html(singleRestCountry.name.common);
      $("#result-2").html(singleRestCountry.capital[0]);
      $("#result-3").html(singleRestCountry.population);
      $("#result-4").html(
        `<img class="flag" src="${singleRestCountry.flags.png}"/>`
      );
      if (singleRestCountry.borders) {
        let str = "";
        // console.log("borders", singleRestCountry.borders);
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
