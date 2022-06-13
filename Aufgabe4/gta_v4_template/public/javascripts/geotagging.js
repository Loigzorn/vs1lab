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

  const latitude = helper.latitude;
  const longitude = helper.longitude;

  document.getElementById("latitude").value = latitude;
  document.getElementById("longitude").value = longitude;

  document.getElementById("searchLatitude").value = latitude;
  document.getElementById("searchLongitude").value = longitude;

  let imageView = document.getElementById("mapView");
  let tagsAsString = imageView.dataset.tags
  let tags = JSON.parse(tagsAsString);

  const map = new MapManager("bWQM84jzA43ETIOGOIyfighZXKAUFXmm");
  const mapURL = map.getMapUrl(latitude, longitude, tags);
  document.getElementById("mapView").attributes.getNamedItem("src").value = mapURL;
}

 function addGeoTagOnTaggingFormEvent(event) { 
  event.preventDefault();
  
  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;
  const tagName = document.getElementById("tagName").value;
  const hashtag = document.getElementById("hashtag").value;
  const data = {
    "latitude": latitude,
    "longitude": longitude,
    "tagName": tagName,
    "hashtag": hashtag
  }

  postGeoTag("http://localhost:3000/api/geotags", data).then(data => updateLocation(data))
  .catch(err => console.error(err));
}

 function searchGeoTagsOnDiscoveryEvent(event) {
   event.preventDefault();
   alert("Event " + event.type + "fired on element " + this.tagName); //Test
   $.getJSON(); //HTTP get mit jquery
  
 }

 async function postGeoTag(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return response.json();
 }

/*Funktion zur Aktualisierung der Darstellung im Discovery-Widget, 
 soll die Ergebnisliste und die Karte aktualisieren. 
 Die Aktualisierung soll sowohl beim Anlegen eines neuen Filters als auch eines neuen GeoTags erfolgen.*/

// Wait for the page to fully load its DOM content, then call updateLocation
// It is senseless to wait for the DOMContentLoaded event, 
// as the event has already happend at this stage.
if (JSON.stringify(document.getElementById("searchLongitude").value).match("\d")) {
  LocationHelper.findLocation(updateLocation);
}

submitTag.addEventListener("click", addGeoTagOnTaggingFormEvent);
searchTag.addEventListener("click", searchGeoTagsOnDiscoveryEvent);

document.addEventListener("DOMContentLoaded", () => {
  //Evtl. Code hier einfügen ("nach dem Laden der Seite...")
});
  
 