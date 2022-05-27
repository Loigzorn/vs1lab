// File origin: VS1LAB A3

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

    constructor() {
        geoTags = GeoTagExamples.tagList();
    }

    addGeoTag(geoTag) {
        geoTags.push(geoTag);
    }

    removeGeoTag(geoTag) {
        geoTags = geoTags.filter(function(ele){
            return ele.tagName != geoTag.tagName;
        });
    }

    getNearbyGeoTags(latitude, longitude) {
        const geolib = require('geolib');
        nearbyGeoTags = [];

        for(var i = 0; i < geoTags.length; i++) {
            var distance = geolib.getDistance(latitude, longitude);
            if (distance <= 10) {
                nearbyGeoTags.push(geoTags[i]);
            }
        }

        return nearbyGeoTags;
    }

    searchNearbyGeoTags(keyword, latitude, longitude) {
        nearbyGeoTags = getNearbyGeoTags(latitude, longitude);
        geoTagsWithKeyword = [];
        for (var i = 0; i < nearbyGeoTags.length; i++) {
            const geoTag = nearbyGeoTags[i];

            if(geoTag.hashtag().includes(keyword) || geoTag.tagName().includes(keyword)) {
                geoTagsWithKeyword.push(nearbyGeoTags[i]);
            }
        }

        return geoTagsWithKeyword;
    }
}

module.exports = InMemoryGeoTagStore
