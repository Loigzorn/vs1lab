// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

 const {v4: uuidv4} = require("uuid");

 /** *
  * A class representing geotags.
  * GeoTag objects should contain at least all fields of the tagging form.
  */
 class GeoTag {
 
     uuid; //The Universally Unique Identifier of the geoTag
     latitude;
     longitude;
     tagName = '';
     hashtag = '';
 
     /**
      * Create a new GeoTag instance.
      * @param {int} latitude The latitude of the geoTag
      * @param {int} longitude The longitude of the geoTag
      * @param {string} tagName The tag name of the geoTag
      * @param {string} hashtag The hashtag of the geoTag
      */
     constructor( latitude, longitude, tagName, hashtag) {
         this.uuid = uuidv4();
         this.latitude = latitude;
         this.longitude = longitude;
         this.tagName = tagName;
         this.hashtag = hashtag;
         return this;
     }
 
     get uuid() {
         return this.uuid
     }
 
     get latitude() {
         return this.latitude;
     }
 
     get longitude() {
         return this.longitude;
     }
 
     get tagName() {
         return this.tagName;
     }
 
     get hashtag() {
         return this.hashtag;
     }
 }
 
 module.exports = GeoTag;