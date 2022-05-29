// File origin: VS1LAB A3

const GeoTagExamples = require('../models/geotag-examples.js');
const GeoTag = require('../models/geotag.js');
/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    #geoTags = [];
    instance;

    constructor() {
        var tagList = GeoTagExamples.tagList;
        for (var i = 0; i < tagList.length; i++) {
            this.#geoTags.push(new GeoTag(tagList[i][1], tagList[i][2], tagList[i][0], tagList[i][3]));
        }
    }

    addGeoTag(geoTag) {
        if (geoTag instanceof GeoTag) {
            this.#geoTags.push(geoTag);
        } else {
            console.error("Failed to add GeoTag, as geoTag is: " + geoTag);
        }
    }

    removeGeoTag(geoTag) {
        this.#geoTags = this.#geoTags.filter(function(ele){
            return ele.tagName != geoTag.tagName;
        });
        return this.#geoTags;
    }

    getNearbyGeoTags(latitudeOne, longitudeOne) {
        const geolib = require('geolib');
        var nearbyGeoTags = [];

        for(var i = 0; i < this.#geoTags.length; i++) {
            var coordOnes = {latitude: latitudeOne, longitude: longitudeOne};
            var secondLatitude = this.#geoTags[i].latitude;
            var secondLongitude = this.#geoTags[i].longitude;
            var coordTwos = {latitude: secondLatitude, longitude: secondLongitude};
            //var distance = geolib.getDistance(coordOnes, coordTwos);
            var x = 71.5 * (latitudeOne - secondLatitude);
            var y = 111.3 * (longitudeOne - secondLongitude);
            var distance = Math.sqrt(x * x, y * y);
            if (distance <= 10) {
                nearbyGeoTags.push(this.#geoTags[i]);
            }
        }

        return nearbyGeoTags;
    }

    searchNearbyGeoTags(keyword, latitude, longitude) {
        var nearbyGeoTags = this.getNearbyGeoTags(latitude, longitude);
        var geoTagsWithKeyword = [];
        for (var i = 0; i < nearbyGeoTags.length; i++) {
            const geoTag = nearbyGeoTags[i];

            if(geoTag.hashtag.includes(keyword) || geoTag.tagName.includes(keyword)) {
                geoTagsWithKeyword.push(nearbyGeoTags[i]);
            }
        }

        return geoTagsWithKeyword;
    }

    static getInstance() {
        if(!InMemoryGeoTagStore.instance) {
            InMemoryGeoTagStore.instance = new InMemoryGeoTagStore();
        }
        return InMemoryGeoTagStore.instance;
    }
}

module.exports = InMemoryGeoTagStore
