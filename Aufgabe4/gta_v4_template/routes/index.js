// File origin: VS1LAB A3, A4

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
 router.use(express.json()) // for parsing application/json
 router.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded
 
 
 /**
  * The module "geotag" exports a class GeoTagStore.
  * It represents geotags.
  */
 // eslint-disable-next-line no-unused-vars
 const GeoTag = require('../models/geotag');
 
 /**
  * The module "geotag-store" exports a class GeoTagStore.
  * It provides an in-memory store for geotag objects.
  */
 // eslint-disable-next-line no-unused-vars
 const GeoTagStore = require('../models/geotag-store');
 const {HttpError} = require("http-errors");
 const store = new GeoTagStore();
 // App routes (A3)
 
 /**
  * Route '/' for HTTP 'GET' requests.
  * (http://expressjs.com/de/4x/api.html#app.get.method)
  *
  * Requests cary no parameters
  *
  * As response, the ejs-template is rendered without geotag objects.
  */
 
 router.get('/', (req, res) => {
     const geoTags = store.geoTags;
     res.render('index', {
         taglist: geoTags, set_latitude: "", set_longitude: "", set_mapView: JSON.stringify(geoTags)
     });
 });
 
 // API routes (A4)
 
 /**
  * Route '/api/geotags' for HTTP 'GET' requests.
  * (http://expressjs.com/de/4x/api.html#app.get.method)
  *
  * Requests contain the fields of the Discovery form as query.
  * (http://expressjs.com/de/4x/api.html#req.body)
  *
  * As a response, an array with Geo Tag objects is rendered as JSON.
  * If 'searchterm' is present, it will be filtered by search term.
  * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
  */
 
 // TODO: Currently there is no possibility in the backend to search independently for "searchterm" and latitude and longitude
 router.get('/api/geotags', (req, res) => {
    const params = getParams(req.url);
    const filter = params.filter;
    const latitude = params.latitude;
    const longitude = params.longitude;
    console.log(filter, latitude, longitude);
    var geoTags = [];
    if (latitude !== undefined && longitude !== undefined) {
        geoTags = filter !== undefined ? store.searchNearbyGeoTags(filter, latitude, longitude) : store.getNearbyGeoTags(latitude, longitude);
    } else {
        geoTags = store.geoTags;
    }
    res.send(geoTags);
 });

 function getParams(url) {
    var request = {};
    var url = url.substring(0).split('?')[1];
    if (url === undefined) {
        return request;
    }
    var pairs = url.substring(0).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        request[pair[0]] = pair[1];
    }
return request;
}
 
 
 /**
  * Route '/api/geotags' for HTTP 'POST' requests.
  * (http://expressjs.com/de/4x/api.html#app.post.method)
  *
  * Requests contain a GeoTag as JSON in the body.
  * (http://expressjs.com/de/4x/api.html#req.query)
  *
  * The URL of the new resource is returned in the header as a response.
  * The new resource is rendered as JSON in the response.
  */
 
 router.post('/api/geotags', (req, res) => {
     const geoTag = new GeoTag(req.body.latitude, req.body.longitude, req.body.tagName, req.body.hashtag)
     store.addGeoTag(geoTag)
     res.setHeader('Location', '/api/geotags/' + geoTag.uuid)
     res.status(201).send(JSON.stringify(geoTag))
 });
 
 /**
  * Route '/api/geotags/:id' for HTTP 'GET' requests.
  * (http://expressjs.com/de/4x/api.html#app.get.method)
  *
  * Requests contain the ID of a tag in the path.
  * (http://expressjs.com/de/4x/api.html#req.params)
  *
  * The requested tag is rendered as JSON in the response.
  */
 
 router.get('/api/geotags/:id', (req, res) => {
     const geoTags = store.geoTags;
     const uri = req.params.id.split(':id').pop()
     geoTags.forEach(element => {
         if (element.uuid === uri) {
             res.send(element);
         }
     })
 });
 
 
 /**
  * Route '/api/geotags/:id' for HTTP 'PUT' requests.
  * (http://expressjs.com/de/4x/api.html#app.put.method)
  *
  * Requests contain the ID of a tag in the path.
  * (http://expressjs.com/de/4x/api.html#req.params)
  *
  * Requests contain a GeoTag as JSON in the body.
  * (http://expressjs.com/de/4x/api.html#req.query)
  *
  * Changes the tag with the corresponding ID to the sent value.
  * The updated resource is rendered as JSON in the response.
  */
 
 //TODO: Currently there is no possibility to change the geoTag in the backend without deleting it. Please add an updateGeoTag function
 
 router.put('/api/geotags/:id', (req, res) => {
     const geoTags = store.geoTags;
     const geoTag = new GeoTag(req.body.latitude, req.body.longitude, req.body.tagName, req.body.hashtag)
     const uri = req.params.id.split(':id').pop()
     geoTags.forEach(element => {
         if (element.uuid === uri) {
             store.removeGeoTag(element)
         }
     })
     store.addGeoTag(geoTag)
     res.send(JSON.stringify(geoTag))
 });
 
 
 /**
  * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
  * (http://expressjs.com/de/4x/api.html#app.delete.method)
  *
  * Requests contain the ID of a tag in the path.
  * (http://expressjs.com/de/4x/api.html#req.params)
  *
  * Deletes the tag with the corresponding ID.
  * The deleted resource is rendered as JSON in the response.
  */
 
 router.delete('/api/geotags/:id', (req, res) => {
     const geoTags = store.geoTags;
     const uri = req.params.id.split(':id').pop()
     let elementToDelete
     geoTags.forEach(element => {
         if (element.uuid === uri) {
             elementToDelete = element
         }
     })
     store.removeGeoTag(elementToDelete)
     res.send(JSON.stringify(elementToDelete))
 });
 
 module.exports = router;
 