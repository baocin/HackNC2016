'use strict';
const request = require('request');
const cheerio = require('cheerio');

var googleGeocodingAPIKey = "AIzaSyDeTYK1pzfKymV2KaYXneXtu0QW7QWWNFE";

var addressToCoordinates = function(address){
    var googleGeocodingUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + googleGeocodingAPIKey;
    return new Promise((resolve, reject) => {
        request(googleGeocodingUrl, function (error, reponse, jsonRaw){
            if(!error){
                var json = JSON.parse(jsonRaw);
                if (json.status == "OK"){
                    resolve(json.results[0].geometry.location);
                }
            }
            reject(error);
        });
    });

};

exports.scrape = (req, res) => {
    var url = "https://mlh.io/seasons/na-2017/events";

    console.log("URL: " + url);

    request(url, function(error, response, html){
        //Store data on all hachathon events
        var events = [];

        // First we'll check to make sure no errors occurred when making the request
        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
            var $ = cheerio.load(html);

            //For each hackathon event
            $('.container .event .event-wrapper').each(function(i, elem) {
                // Convenience variables
                var link = $(this).children('a');
                var innerLink = link.children('.inner');
                var address = innerLink.find('div').last()

                var newEventJson = {};
                newEventJson.url = link.attr('href');
                newEventJson.name = innerLink.children('h3[itemprop="name"]').text();
                newEventJson.iconUrl = innerLink.children('.event-logo').children('img').attr('src');
                newEventJson.backgroundImageUrl = innerLink.children('.image-wrap').children('img').attr('src');
                newEventJson.startDate = innerLink.children('meta[itemprop="startDate"]').attr('content');
                newEventJson.endDate = innerLink.children('meta[itemprop="endDate"]').attr('content');
                newEventJson.city = address.children('span[itemprop="addressLocality"]').text();
                newEventJson.state = address.children('span[itemprop="addressRegion"]').text();
                
                // addressToCoordinates(newEventJson.city + ", " + newEventJson.state).then(function(res){
                //     newEventJson.lat = res.lat;
                //     newEventJson.long = res.lng;
                // }).catch((err) => console.error(err));

                events.push(newEventJson);

            });
        }

        // console.log(events);

        res.render('scraper', {
            title: 'Scraper',
            events: JSON.stringify(events)
        });
    })

};