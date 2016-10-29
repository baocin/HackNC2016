'use strict';
const request = require('request');
const cheerio = require('cheerio');

exports.scrape = (req, res) => {

    var url = "https://mlh.io/seasons/na-2017/events";
    var events = {};

    console.log("URL: " + url);
    request(url, function(error, response, html){
        // First we'll check to make sure no errors occurred when making the request
        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
            var $ = cheerio.load(html);
            console.log($.html());

            // Finally, we'll define the variables we're going to capture
            var eventJson = { 
                name : "", 
                id : "",  
                url : "", 
                iconUrl : "", 
                description : "", 
                sponsors : [], 
                signupUrl : "",
                startDate : "",
                endDate : "",
                city : "",
                state : "",
                location : "",
                backgroundImageUrl : ""
        };

            // events = $('.container .event .event-wrapper');
            events = [];

            $('.container .event').each(function(i, elem) {
                // Convenience variables 
                var event = $(this).children('.event-wrapper');
                var link = event.children('a');
                var innerLink = link.children('.inner');
                var address = innerLink.children('div[itemprop="address"]');

                var newEventJson = eventJson;
                newEventJson.url = link.attr('href');
                newEventJson.name = innerLink.children('h3[itemprop="name"]').text();
                newEventJson.iconUrl = innerLink.children('.event-logo').children('img').attr('src');
                newEventJson.backgroundImageUrl = innerLink.children('.image-wrap').children('img').attr('src');
                newEventJson.startDate = innerLink.children('meta[itemprop="startDate"]').attr('content');
                newEventJson.endDate = innerLink.children('meta[itemprop="endDate"]').attr('content');
                newEventJson.city = address;
                newEventJson.state = address.children('span[itemprop="addressRegion"]').text();
                newEventJson.location = address.text();
                console.log(newEventJson);
                
                events.push(newEventJson);

                
                // var newEventJson = eventJson;
                // newEventJson.url = event('a');
            });

            // for (var event in .children()){
            //     console.log(event);
            //     // events.push(event);


            //     // events.push(newEventJson);
            // }


            res.render('scraper', {
                title: 'Scraper',
                events: events
            });
        }
    })

};