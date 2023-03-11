$(document).ready(() => {
  // variable definitions
  let allRestCountries = [];
  let polygons = [];
  let countryCodeFromOpenCage = null;
  let year = new Date().getFullYear();
  let currentYear = year.toString();

  // map initalisation
  let map = L.map("map");
  map.setView([51.509865, -0.118092], 4);
  let marker = null;

  // tile layer
  L.tileLayer(
    "https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key=c4edb04533mshba882524ef1f0e1p1f0643jsna3c2c78e057f",
    {
      attribution:
        '&copy; <a href="http://www.maptilesapi.com/">MapTiles API</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      apikey: "c4edb04533mshba882524ef1f0e1p1f0643jsna3c2c78e057f",
      maxZoom: 19,
      minZoom: 4,
    }
  ).addTo(map);

  //easy buttons
  // Triggers basic Contry Infomatiobn Modal
  L.easyButton("fa-globe", (btn, map) => {
    if ($("#selectCountries").val() === "") {
      alert("Please Select a Country");
    } else {
      let basicCountryImfo = new bootstrap.Modal($("#countryInfo"), {});
      basicCountryImfo.show();
    }
  }).addTo(map);

  // Triggers basic Weather  Modal
  L.easyButton("fa-cloud", (btn, map) => {
    if ($("#selectCountries").val() === "") {
      alert("Please Select a Country");
    } else {
      let weatherModal = new bootstrap.Modal($("#weatherInfo"), {});
      weatherModal.show();
    }
  }).addTo(map);

  // Triggers useful information  Modal
  L.easyButton("fa-info", (btn, map) => {
    if ($("#selectCountries").val() === "") {
      alert("Please Select a Country");
    } else {
      let usefulInfoModal = new bootstrap.Modal($("#usefulInfo"), {});
      usefulInfoModal.show();
    }
  }).addTo(map);

  // Triggers puplic holidays modal
  L.easyButton("fa-umbrella-beach", (btn, map) => {
    if ($("#selectCountries").val() === "") {
      alert("Please Select a Country");
    } else {
      let holidaysModal = new bootstrap.Modal($("#public-holiday"), {});
      holidaysModal.show();
    }
  }).addTo(map);

  // Triggers news headlines modal
  L.easyButton("fa-newspaper", (btn, map) => {
    if ($("#selectCountries").val() === "") {
      alert("Please Select a Country");
    } else {
      let newsModal = new bootstrap.Modal($("#news-headlines"), {});
      newsModal.show();
    }
  }).addTo(map);

  // ------------------------------------------
  // Ajax request functinas
  const getCountries = () => {
    $.ajax({
      type: "GET",
      url: "libs/php/getCountries.php",
      data: "",
      dataType: "json",
      success: (response) => {
        console.log("getCountry", response);
        let countryInfo = response;
        countryInfo = Object.values(countryInfo).sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        let str = "";
        for (let i = 0; i < countryInfo.length; i++) {
          const country = countryInfo[i];
          str += `<option value="${country.code}">${country.name}</option>`;
        }

        $("#selectCountries").append(str);
        getGeoeolocation();
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  const getGeoeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;

          let location = [];
          location.push(lat, lon);

          marker = L.marker(location).addTo(map);

          // call  getting country by coordinate
          getCountryByCoord(lat, lon);

          return location;
        },
        () => {
          $("#selectCountries").val("GB").change();
        }
      );
    } else {
      $("#selectCountries").val("GB").change();
    }
  };

  const getCountryByCoord = (lat, long) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getCountryByCoord.php",
      data: { lat: lat, long: long },
      dataType: "json",
      success: (response) => {
        countryCodeFromOpenCage =
          response.data.results[0].components["ISO_3166-1_alpha-2"];
        // Calling change event once data comes back from openCage (reverse geocode)
        $("#selectCountries").val(countryCodeFromOpenCage).change();
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  const getRestCountries = () => {
    $.ajax({
      type: "GET",
      url: "libs/php/getRestCountries.php",
      dataType: "json",
      success: (response) => {
        console.log("restCountry  success running");
        allRestCountries = response.data;
        populateModals();
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  const removeBorders = () => {
    map.eachLayer((layer) => {
      if (layer instanceof L.GeoJSON) map.removeLayer(layer);
    });
  };

  const getSingleCountryBorders = (isoCode) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getCountries.php",
      data: { iso: isoCode },
      dataType: "json",
      success: (response) => {
        drawBorders(response);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const drawBorders = (country) => {
    let border = L.geoJSON(country).addTo(map);
    map.fitBounds(border.getBounds());
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

  const getCountryFromOpenCageByName = (countryName, latlng) => {
    /*The second parameter latng is used because the bellow ajax request returns null for some values. If this is the case the second parameter will be used  */

    $.ajax({
      type: "GET",
      url: "libs/php/getCountryByCoord.php",
      data: { country: countryName },
      dataType: "json",
      success: (response) => {
        let lat;
        let long;

        if (response.data !== null) {
          lat = response.data.results[0].geometry.lat;
          long = response.data.results[0].geometry.lng;
        } else {
          lat = latlng[0];
          long = latlng[1];
        }

        if (marker !== null) {
          map.removeLayer(marker);
        }
        marker = L.ExtraMarkers.icon({
          icon: "fa-map-marker-alt",
          className: "capital-marker",
          prefix: "fa-solid",
        });

        L.marker([lat, long], { icon: marker }).addTo(map);

        map.panTo([lat, long], { animate: true, duration: 1 });
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  const getWeatherInfo = (lat, long) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getWeather.php",
      data: { lat: lat, long: long },
      dataType: "json",
      success: (response) => {
        let t = (parseFloat(response.data.main.temp) - 273.15).toFixed(2);

        let t_diff = parseInt(response.data.timezone) / 3600; //Converting into UTC

        let t_utc = t_diff > 0 ? `UTC +${t_diff}` : `UTC ${t_diff}`;
        // Populating weather Modal
        $("#w-result-1").html(response.data.weather[0].description);
        $("#w-result-2").html(t);
        $("#w-result-3").html(t_utc);
      },
      error: (jqXHR, textStatus, errorThrown) => {
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
      success: (response) => {
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
      error: (jqXHR, textStatus, errorThrown) => {
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
      success: (response) => {
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
          $("#u-result-2").html(`<p>No articles found</p>`);
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const getPublicHolidayInfo = (countryCode, currentYear) => {
    console.log("Country Code:", countryCode, "year", currentYear);
    $.ajax({
      type: "GET",
      url: "libs/php/getPublicHolidayInfo.php",
      data: { countryCode: countryCode, year: currentYear },
      dataType: "json",
      success: function (response) {
        // Sort through holidays and display them
        let holidayInformation = response;

        const ids = holidayInformation.map((o) => o.name);
        const filteredHolidays = holidayInformation.filter(
          ({ name }, index) => !ids.includes(name, index + 1)
        );
        console.log("filteredHolidays", filteredHolidays);
        let content = '<table class="table table-striped">';

        for (i = 0; i < filteredHolidays.length; i++) {
          const holiday = filteredHolidays[i];

          content += `<thead class ="thead-styling">
          <tr>
            <th>Name</th>
            <th>Locaslly Known As</th>
            <th>Date (YYY/MM/DD)</th>
          </tr>
         </thead>
         <tbody>
           <tr>
             <td>${holiday.name}</td>
             <td>${holiday.localName}</td>
             <td>${holiday.date}</td>
           </tr>`;
        }
        content += "</table>";

        $("#ph-info-1").append(content);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  const getNewsHeadlines = (countryCode) => {
    console.log("newsHeadlines CountryCoded", countryCode);
    $.ajax({
      type: "GET",
      url: "libs/php/gettNewsHeadlines.php",
      data: { countryCode: countryCode.toLowerCase() },
      dataType: "json",
      success: function (response) {
        console.log(" gettNewsHeadlines", response);
        // Sort through holidays and display them
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const getCitiesByCountryCode = (countryCode) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getCities.php",
      data: { countryCode: countryCode },
      dataType: "json",
      success: function (response) {
        console.log("cityInfo", response);
        let markers = L.markerClusterGroup();

        let cityInfo = response.data;
        for (let i = 0; i < cityInfo.length; i++) {
          let icon = L.ExtraMarkers.icon({
            icon: "fa-city",
            prefix: "fa-solid",
            className: "city-marker",
          });
          const city = cityInfo[i];
          let cityLat = city.lat;
          let cityLng = city.lng;
          let marker = L.marker([cityLat, cityLng], { icon: icon });

          markers.addLayer(marker);
        }
        map.addLayer(markers);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  // ------------------------------------------

  // Function that populates all modals
  const populateModals = () => {
    console.log("allRestCountries", allRestCountries);
    let singleRestCountry = allRestCountries.find(
      (restCountry) => countryCodeFromOpenCage === restCountry.cca2
    );

    if (singleRestCountry) {
      console.log("singleRestCountry inside populate modls", singleRestCountry);
      let content = `<table class="table table-striped w-100 " > 
      <thead class ="thead-styling">
      <tr>
        <th>Name</th>
        <th>Capital</th>
        <th>Population</th>
        <th> Flag</th></th>
        <th>Borders With</th>
        <th>Sub-region</th>
      </tr>
     </thead>`;

      content += `<tbody>
         <tr>
           <td>${singleRestCountry.name.common}</td>
           <td>${singleRestCountry.capital[0]}</td>
           <td>${singleRestCountry.population}</td>
           <td><img class="flag" src="${singleRestCountry.flags.png}"/></td>
         `;

      if (singleRestCountry.borders) {
        let str = "";

        singleRestCountry.borders.forEach((border) => {
          content += `<td class="borders-list">${(str += `<li>${border}</li>`)}</td>`;
        });
      } else {
        content += `<td class="borders-list">${(str += `<p>${"Borders Not Found"}</p>`)}</td>`;
      }
      if (singleRestCountry.subregion) {
        content += `<td class="subregion">${singleRestCountry.subregion}</td>`;
      } else {
        content += `<td class="subregion"><p>Sub-region not found</p></td>`;
      }
      content += `</tr> </tbody> </table> `;

      $("#info-1").html(content);

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
      getPublicHolidayInfo(singleRestCountry.cca2, currentYear);
      getNewsHeadlines(singleRestCountry.cca2);
      // calling getCitiesByCountryCode
      getCitiesByCountryCode(singleRestCountry.cca2);
    } else {
      console.log("Country Not Found");
    }
  };

  // Getting current location

  //Calling getCountries to populate select
  getCountries();

  //Calling getRestCountries to get more info
  getRestCountries();

  // .change callback function
  $("#selectCountries").change(() => {
    let selectval = $("#selectCountries").val();
    let countryCapital = null;
    let latlng = null;
    countryCodeFromOpenCage = selectval;
    if (allRestCountries.length > 0) {
      let singleRestCountry = allRestCountries.find(
        (restCountry) => countryCodeFromOpenCage === restCountry.cca2
      );
      latlng = singleRestCountry.latlng;

      if (singleRestCountry.capital) {
        countryCapital = singleRestCountry.capital[0];
      } else {
        console.log("Capital not found");
      }
      populateModals();
    }

    if (polygons !== undefined) {
      removeBorders();
    }

    getSingleCountryBorders(selectval);
    // brings back coords based on iso code
    let data = countryCapital ? countryCapital : selectval;

    getCountryFromOpenCageByName(data, latlng);
  });
});
