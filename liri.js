// Read and set any environment variables with the dotenv package
require("dotenv").config();
// Load the required nodes
//npm install twitter
var Twitter = require('twitter');
//npm install --save node-spotify-api
var Spotify = require('node-spotify-api');
//npm install omdb
var omdb = require('omdb');
//links to the keys.js file
var keys = require('./keys.js');
// Take in the command line arguments
var request = require('request');
var fs = require('fs');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitterKeys);
var command = process.argv[2];
var queryString = '" ' + process.argv[3] + '"';
var line = "----------------------"

//Make twitter work//
function tweetThis() {
    var params = {
        screen_name: 'Marcin_Paszt',
        count: 20
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("#" + (i + 1) + ":  " + tweets[i].text);
                console.log("Created:  " + tweets[i].created_at);
                console.log(line);
            }
        }
    });
}

// Make spotify work//
function spotifySong() {

    spotify.search({ type: 'track', query: queryString, limit: 3 }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
        } else {
            for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
                if (i === 0) {
                    console.log("*Artist: " + data.tracks.items[0].artists[i].name);
                    console.log(line);
                } else {
                    console.log(" " + data.tracks.items[0].artists[i].name);
                    console.log(line);
                }
            }
            console.log("*Song: " + data.tracks.items[0].name);
            console.log(line);
            console.log("*Preview Link: " + data.tracks.items[0].preview_url);
            console.log(line);
            console.log("*Album: " + data.tracks.items[0].album.name);
            console.log(line);

        }
    });
}

// Make OMDB work//
var movieThis = function (queryString) {
    console.log(process.argv[3]);
    if (process.argv[3] === undefined) {
        process.argv[3] = "Mr. Nobody";
    } request("http://www.omdbapi.com/?t=" + process.argv[3] + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("* Movie title: " + JSON.parse(body).Title);
            console.log(line);
            console.log("* Movie year: " + JSON.parse(body).Year);
            console.log(line);
            console.log("* Movie IMDB rating: " + JSON.parse(body).imdbRating);
            console.log(line);
            for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
                if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
                    console.log("* Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[i].Value);
                    console.log(line);
                    if (JSON.parse(body).Ratings[i].Website !== undefined) {
                        console.log("* Rotten Tomatoes URL: " + JSON.parse(body).Ratings[i].Website);
                        console.log(line);
                    }
                }
            }
            console.log("* Country of origin: " + JSON.parse(body).Country);
            console.log(line);
            console.log("* Language: " + JSON.parse(body).Language);
            console.log(line);
            console.log("* Plot: " + JSON.parse(body).Plot);
            console.log(line);
            console.log("* Cast: " + JSON.parse(body).Actors);
            console.log(line);

            //Append to the log file//
            fs.appendFileSync('log.txt', "Title: " + JSON.parse(body).Title + "\n");
            fs.appendFileSync('log.txt', "Release Year: " + JSON.parse(body).Year + "\n");
            fs.appendFileSync('log.txt', "IMdB Rating: " + JSON.parse(body).imdbRating + "\n");
            fs.appendFileSync('log.txt', "Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating + "\n");
            fs.appendFileSync('log.txt', "Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL + "\n");
            fs.appendFileSync('log.txt', "Country: " + JSON.parse(body).Country + "\n");
            fs.appendFileSync('log.txt', "Language: " + JSON.parse(body).Language + "\n");
            fs.appendFileSync('log.txt', "Plot: " + JSON.parse(body).Plot + "\n");
            fs.appendFileSync('log.txt', "Actors: " + JSON.parse(body).Actors + "\n");
        }
    });
}

//Do something function//
function doSomething() {
    fs.readFile('random.txt', "utf8", function (error, data) {
        var st = data.split(',');

        spotifySong(st[1]);
    });
}

switch (command) {
    case "my-tweets":
        tweetThis();
        break;
    case "spotify-this-song":
        spotifySong();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doSomething();
        break;
    default:
        console.log(" Commands to use: my-tweets, spotify-this-song, movie-this, do-what-it-says");
        break;
}




