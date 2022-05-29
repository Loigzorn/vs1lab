// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation(helper) {
  const map = new MapManager("bWQM84jzA43ETIOGOIyfighZXKAUFXmm");

  const latitude = helper.latitude;
  const longitude = helper.longitude;
  const tags = helper.tags;

  const mapURL = map.getMapUrl(latitude, longitude, tags);

  document.getElementById("latitude").attributes[3].nodeValue = latitude;
  document.getElementById("longitude").attributes[3].nodeValue = longitude;

  document.getElementById("mapView").attributes.getNamedItem("src").value = mapURL;
  //NOTE Added data-tags call
  document.getElementById("mapView").attributes.getNamedItem("data-tags").value = JSON.stringify(mapURL.tagList);

  document.getElementById("searchLatitude").value = latitude;
  document.getElementById("searchLongitude").value = longitude; 
}

if (document.getElementById("searchLongitude").value == "" && document.getElementById("searchLatitude").value == "") {
  LocationHelper.findLocation(updateLocation);
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
});
