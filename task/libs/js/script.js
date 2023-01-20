console.log("script file running");

$(document).ready(function () {
  console.log("running");
  $("#country-btn").click(function () {
    let country = $("#selCountry").val();
    console.log("Country", country);
  });
  $("#postcode-btn").click(() => {
    let postcode = $("#postcode").val();
    console.log("postcode", postcode);
  });
  $("#timezone-btn").click(() => {
    let lat = $("#lat").val();
    let long = $("#long").val();
    console.log("lat", lat);
    console.log("long", long);
  });
});
