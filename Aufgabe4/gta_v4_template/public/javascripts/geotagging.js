// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");
var current_page = 1;
const records_per_page = 5;
var totalCountGeoTags = 0;
var geoTagUuids = [];

function addUuid(geoTag) {
  const uuid = geoTag.uuid;
  for(let element in geoTagUuids) {
    if (element === uuid) {
      return;
    }
  }
  geoTagUuids.push(uuid);
}

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

  for (var tag in tags) {
    addUuid(tags[tag]);
  }
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

  postGeoTag("http://localhost:3000/api/geotags", data).then(() => totalCountGeoTags++)
  .catch(err => console.error(err));

  getGeoTags("http://localhost:3000/api/geotags").then(data => updateGeoTags(data)).then(() => updateDiscoveryIndexes())
  .catch(err => console.error(err));
}

function searchGeoTagsOnDiscoveryEvent(event) {
  event.preventDefault();
  var searchTerm = document.getElementById("searchNameOfTag").value;
  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;
  const data = searchTerm == "" ? {latitude: latitude, longitude: longitude} : {filter: searchTerm, latitude: latitude, longitude: longitude};
  var url = "http://localhost:3000/api/geotags/?" + encodeQueryData(data);
  console.log("Requested url: ", url);
  $.getJSON(url, updateGeoTags);
 }

 function encodeQueryData(data) {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join('&');
}

 async function postGeoTag(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return response.json();
 }

 async function getGeoTags(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
 }

 /**
  * @param {GeoTag[]} geoTags List of the geoTags
  */
 var updateGeoTags = function(geoTags) {
  let imageView = document.getElementById("mapView");
  imageView.dataset.tags = JSON.stringify(geoTags);
  LocationHelper.findLocation(updateLocation);

  var geos = document.getElementById("discoveryResults");
  geos.innerHTML = null;
  for (var key in geoTags) {
    var li = document.createElement("li");
    li.innerHTML = geoTags[key].tagName + " (" + geoTags[key].latitude + "," + geoTags[key].longitude + ") " + geoTags[key].hashtag;
    geos.appendChild(li);
  }
 };

 function showPreviousGeoTagsInDiscovery(_) {
  if (current_page > 1) {
    current_page--;
    changePage(current_page);
  }
 }

 function showNextGeoTagsInDiscovery(_) {
  if (current_page < numPages()) {
    current_page++;
    changePage(current_page);
  }
 }

 function updateDiscoveryIndexes() {
  var divElement = document.getElementById("discoveryPagingIndexes");
  divElement.innerHTML = null;
  var innerDiv = document.createElement("paragraph");
  innerDiv.innerHTML = current_page + "/" + numPages() + " (" + totalCountGeoTags + ")";
  divElement.appendChild(innerDiv);
 }

function changePage(page) {
  var btn_next = document.getElementById("discoveryPagingNextButton");
  var btn_prev = document.getElementById("discoveryPagingPreviousButton");

  getGeoTags("http://localhost:3000/api/geotags").then(data => totalCountGeoTags = data.length).then(() => updateDiscoveryIndexes())
  .catch(err => console.error(err));


  if (page == 1) {
    btn_prev.style.visibility = "hidden";
  } else {
    btn_prev.style.visibility = "visible";
  }

  if (page == numPages()) {
    btn_next.style.visibility = "hidden";
  } else {
    btn_next.style.visibility = "visible";
  }
}

function numPages() {
    return Math.ceil(totalCountGeoTags / records_per_page);
}

/*Funktion zur Aktualisierung der Darstellung im Discovery-Widget,
 soll die Ergebnisliste und die Karte aktualisieren.
 Die Aktualisierung soll sowohl beim Anlegen eines neuen Filters als auch eines neuen GeoTags erfolgen.*/

// Wait for the page to fully load its DOM content, then call updateLocation
// It is senseless to wait for the DOMContentLoaded event,
// as the event has already happend at this stage.
if (JSON.stringify(document.getElementById("searchLongitude").value).match("\d")) {
  LocationHelper.findLocation(updateLocation).then(() => changePage(1));
}

submitTag.addEventListener("click", addGeoTagOnTaggingFormEvent);
searchTag.addEventListener("click", searchGeoTagsOnDiscoveryEvent);
discoveryPagingPreviousButton.addEventListener("click", showPreviousGeoTagsInDiscovery);
discoveryPagingNextButton.addEventListener("click", showNextGeoTagsInDiscovery);

document.addEventListener("DOMContentLoaded", () => {
  //Evtl. Code hier einfügen ("nach dem Laden der Seite...")
});
