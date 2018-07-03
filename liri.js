require("dotenv").config();
var keys = require('./keys.js');
//console.log(keys);
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require('fs');
var spotify = new Spotify(keys.spotify);
var client = new twitter(keys.twitter);
var command = process.argv[2];
var input = process.argv[3];
// console.log('Input is ' + input);
if (command === 'do-what-it-says') {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error);
        }
        var read = data.split(',');
        command = read[0];
        input = read[1];
        console.log(command);
        console.log(input);
        logic(command, input);
    });
}
function logic (command, input) {
    switch (command) {
        case 'my-tweets':
            var params = {screen_name: 'chinkenn'};
            client.get('statuses/home_timeline', params, function(error,tweets,response) {
                if(!error){
                    for (i = 0; i < tweets.length; i++) {
                        console.log(tweets[i].user.name + ': ' + tweets[i].text);
                        console.log('Created at ' + tweets[i].created_at);
                    }
                }
                else {
                    console.log(error);
                }
            })
            break;
        case 'spotify-this-song':
            if (input === undefined) {
                spotify.search({type: 'track', query: 'The Sign'}, function (err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }
                    console.log('Artist: ' + data.tracks.items[5].artists[0].name);
                    console.log('Track Name: ' + data.tracks.items[5].name);
                    console.log('Link: ' + data.tracks.items[5].external_urls.spotify);
                    console.log('Album Name: ' + data.tracks.items[5].album.name);
                });
            }
            else {
                spotify.search({type: 'track', query: input}, function(err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }
                    //console.log(JSON.stringify(data[0], null, 2));
                    for (j = 0; j < 20; j++) {
                        console.log('Artist: ' + data.tracks.items[j].artists[0].name);
                        console.log('Track Name: ' + data.tracks.items[j].name);
                        console.log('Link: ' + data.tracks.items[j].external_urls.spotify);
                        console.log('Album Name: ' + data.tracks.items[j].album.name);
                    }
                });
            }
            break;
        case 'movie-this':
            if (input === undefined) {
                request("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy", function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    // console.log(JSON.parse(body));
                    console.log('Title: ' + JSON.parse(body).Title);
                    console.log('Year Released: ' + JSON.parse(body).Year);
                    console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
                    console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
                    console.log('Country Produced: ' + JSON.parse(body).Country);
                    console.log('Language: ' + JSON.parse(body).Language);
                    console.log('Plot: ' + JSON.parse(body).Plot);
                    console.log('Actors: ' + JSON.parse(body).Actors);
                } 
                });
            }
            else {
                request("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    // console.log(JSON.parse(body));
                    console.log('Title: ' + JSON.parse(body).Title);
                    console.log('Year Released: ' + JSON.parse(body).Year);
                    console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
                    console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
                    console.log('Country Produced: ' + JSON.parse(body).Country);
                    console.log('Language: ' + JSON.parse(body).Language);
                    console.log('Plot: ' + JSON.parse(body).Plot);
                    console.log('Actors: ' + JSON.parse(body).Actors);
                }
                });
            }
            break;
        default: 
            console.log('Operation is not valid');
    }
};
logic(command, input);