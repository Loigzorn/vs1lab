// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag.js');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store.js');
const store = new GeoTagStore();

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

 
// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  const geoTags = store.geoTags;
  res.render('index', {
    taglist: geoTags,
    set_latitude: "",
    set_longitude: "",
    set_mapView: JSON.stringify(geoTags)
  });
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// TODO: ... your code here ...

router.post('/tagging', (req, res) => {
  const geotag = new GeoTag(req.body.latitude, req.body.longitude, req.body.tagName, req.body.hashtag);
  store.addGeoTag(geotag);

  const geoTags = store.getNearbyGeoTags(geotag.latitude, geotag.longitude);
  res.render('index', {
    taglist: geoTags,
    set_latitude: req.body["latitude"],
    set_longitude: req.body["longitude"],
    set_mapView: JSON.stringify(geoTags)
  });
});
/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */
//addGeoTag removeGeoTag getNearbyGeoTags searchNearbyGeoTags
// TODO: ... your code here ...
//earchNearbyGeoTags(keyword, latitude, longitude)
router.post('/discovery', (req, res) => {
  const geoTags = req.body.searchNameOfTag ? store.searchNearbyGeoTags(req.body.searchNameOfTag, req.body.searchLatitude, req.body.searchLongitude) :
  store.getNearbyGeoTags(req.body.searchLatitude, req.body.searchLongitude);
  res.render('index', {
    taglist: geoTags,
    set_latitude: req.body["latitude"],
    set_longitude: req.body["longitude"],
    set_mapView: JSON.stringify(geoTags)
   });
});

module.exports = router;
