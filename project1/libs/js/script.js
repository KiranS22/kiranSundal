$(document).ready(() => {
  let allCountries = [];
  let allRestCountries = [];
  let polygons = [];
  let countryCodeFromOpenCage = null;
  // ajax request functions
  const getCountries = () => {
    console.log("getCountries called");
    $.ajax({
      type: "GET",
      url: "libs/php/getCountries.php",
      data: "",
      dataType: "json",
      success: function (response) {
        let countryInfo = response.features;

        let str = "";
        countryInfo.forEach((country) => {
          str += `<option value="${country.properties.iso_a2}">${country.properties.name}</option>`;
        });
        $("#selectCountries").append(str);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  const getRestCountries = () => {
    console.log("getRestCountries called");
    $.ajax({
      type: "GET",
      url: "libs/php/getRestCountries.php",
      dataType: "json",
      success: function (response) {
        allRestCountries = response.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  const getWeatherInfo = (lat, long) => {
    console.log("getWeather call");
    $.ajax({
      type: "GET",
      url: "libs/php/getWeather.php",
      data: { lat: lat, long: long },
      dataType: "json",
      success: function (response) {
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
    console.log("getCountryByCoord call");
    $.ajax({
      type: "GET",
      url: "libs/php/getCountryByCoord.php",
      data: { lat: lat, long: long },
      dataType: "json",
      success: function (response) {
        console.log("getCountryByCoord", response);

        countryCodeFromOpenCage =
          response.data.results[0].components["ISO_3166-1_alpha-2"];
        // Calling change event once data comes back from openCage (reverse geocode)
        $("#selectCountries").val(countryCodeFromOpenCage).change();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  /* the first time the app runs data comes back as null for the  selected country and some countries data is also null  */
  const getCountryFromOpenCageByName = (countryName) => {
    console.log("Inside open cage, countryName", countryName);
    $.ajax({
      type: "GET",
      url: "libs/php/getCountryByCoord.php",
      data: { country: countryName },
      dataType: "json",
      success: function (response) {
        if (response.data !== null) {
          console.log("getCountryFromOpenCageByName", response);
          let lat = response.data.results[0].geometry.lat;
          let long = response.data.results[0].geometry.lng;

          if (marker !== null) {
            map.removeLayer(marker);
          }
          map.panTo([lat, long], { animate: true, duration: 1 });
          marker = L.marker([lat, long]).addTo(map);
        } else {
          console.log("Data is null");
        }
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
    console.log("gwtWiki call");
    $.ajax({
      type: "GET",
      url: "libs/php/getWikiLinks.php",
      data: { lat: lat, long: long },
      dataType: "json",
      success: function (response) {
        console.log("response from  Wiki", response.data.geonames);
        if (response.data.geonames.length > 0) {
          let wikiInfo = response.data.geonames;
          let linksToDisplay = wikiInfo.slice(0, 3).map((url) => {
            let fullUrl = "https://" + url.wikipediaUrl;
            return fullUrl;
          });

          let str = "";
          linksToDisplay.forEach((link) => {
            str += `<li class="wikiLinks"><a href="${link}">${link}</a></li>`;
          });
          $("#u-result-2").html(str);
        } else {
          console.log("else running");
          $("#u-result-2").html(`<p>No articles found</p>`);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const getSingleCountryBorders = (isoCode) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getCountries.php",
      data: { iso: isoCode },
      dataType: "json",
      success: function (response) {
        drawBorders(response);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("getSinngleCountryBorder error block");
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const drawBorders = (country) => {
    let countryGeometry = country.geometry;
    let type = countryGeometry.type;
    console.log("country type ", type, "country geometry", countryGeometry);
    L.geoJSON(country).addTo(map);
    let myStyle = {
      color: "#ff7800",
      weight: 5,
      opacity: 0.65,
    };

    let polygon = L.geoJSON(country, {
      style: myStyle,
    }).addTo(map);
    polygons.push(polygon);
  };

  const removeBorders = () => {
    map.eachLayer(function (layer) {
      if (layer instanceof L.GeoJSON) map.removeLayer(layer);
    });
  };
  // Getting current location
  let map = L.map("map");
  let marker;
  function getGeoeolocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        let location = [];
        location.push(lat, lon);
        map.setView(location, 4);
        marker = L.marker(location).addTo(map);
        //Calling getCountries to populate select
        getCountries();
        //Calling getRestCountries to get more info
        getRestCountries();

        // call  getting country by coordinate
        getCountryByCoord(lat, lon);

        return location;
      });
    }
  }
  getGeoeolocation();
  // map initalisation, modal buttons and markers
  L.tileLayer(
    "https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key=c4edb04533mshba882524ef1f0e1p1f0643jsna3c2c78e057f",
    {
      attribution:
        '&copy; <a href="http://www.maptilesapi.com/">MapTiles API</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      apikey: "c4edb04533mshba882524ef1f0e1p1f0643jsna3c2c78e057f",
      maxZoom: 19,
      minZoom: 2,
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

  // Opening instructions modal
  $("#appInstructions").modal("show");

  $("#selectCountries").change(() => {
    let selectval = $("#selectCountries").val();
    console.log("selectVal", selectval);

    if (polygons !== undefined) {
      removeBorders();
    }

    //  draws borders
    getSingleCountryBorders(selectval);
    // brings back coords based on iso code
    getCountryFromOpenCageByName(selectval);

    const singleRestCountry = allRestCountries.find(
      (restCountry) => selectval === restCountry.cca2
    );

    if (singleRestCountry) {
      $("#result-1").html(singleRestCountry.name.common);
      $("#result-2").html(singleRestCountry.capital[0]);
      $("#result-3").html(singleRestCountry.population);
      $("#result-4").html(
        `<img class="flag" src="${singleRestCountry.flags.png}"/>`
      );
      if (singleRestCountry.borders) {
        let str = "";

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
      console.log("latlng", singleRestCountry);
      getWeatherInfo(lat, long);
      // Populating Weather modal
      $("#w-result-4").html(lat);
      $("#w-result-5").html(long);
      let countryCurrency = Object.keys(singleRestCountry.currencies)[0];
      // calling getExchangeRate for useful info modal
      getExchangeRate(countryCurrency);
      getWikiLinks(lat, long);
      //makes maker jump to country
    } else {
      console.log("Country Not Found");
    }
  });
});
