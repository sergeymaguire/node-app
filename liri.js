require("dotenv").config();

function helpMenu() {
    console.log("\n" + "How to run the lookup commands... " + "\n" + "\n" + "A movie name(node liri.js movie-this<Movie name here>)" + "\n" + "A song name(node liri.js spotify-this-song<Song name here)" + "\n" + "A band lookup(node liri.js concert-this<artist/band name here>" + "\n" + "Do what it says(node liri.js do-what-it-says<Will do one of the three commands above depending on what is on your random.txt file>)" + "\n");
}
helpMenu();
const fs = require("fs");
var request = require("request"),
    keys = require("./keys.js"),
    Spotify = require('node-spotify-api'),
    spotify = new Spotify({
        id: "ada3a8a5d341447a8acba938aef731da",
        secret: "bc31d08372814073a2268765004cf010"
    }),
    infoInput = process.argv,
    action = process.argv[2],
    param = "";

if (!action || !infoInput || !infoInput.length) {
    process.exit(1);
};

if (process.argv[3] !== undefined) {
    for (i = 3; i < infoInput.length; i++) {
        param += infoInput[i] + " ";
    };
};

fs.readFile('random.txt', "utf8", function(err, data) {
    console.log(data)
});


switch (action) {
    case 'concert-this':
        if (!param || param.length < 2) {
            param = "zion i";
        }
        concertThis(param);
        break;

    case 'spotify-this-song':
        if (!param || param.length < 2) {
            param = "Ace of Spades";
        }
        spotifyThis(param);
        break;
    case "movie-this":
        if (!param || param.length < 2) {
            param = "Pulp Fiction";
        };
        movie(param);
        break;

    case "do-what-it-says":
        //doIt();
        break;
};

function movie(title) {
    var queryURL = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
    request(queryURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if (body) {
                var data = JSON.parse(body);
                if (data.Error == 'Movie not found!') {
                    var noMovie = ("\n**********************************Sorry NO MOVIE**********************************\nOMDB could not find any movies that matched that title.  Please try again.\n********************************************************************************\n");
                    console.log(noMovie)
                    fs.appendFile("log.txt", noMovie, function (err) {
                        if (err) {
                            return console.log("Movie data did not append to log.txt file.");
                        };
                    });
                } else if (!data.Ratings || data.Ratings.length < 2) {
                    var movieAppend = ("\n********************************** MOVIE **********************************\nTitle: " + data.Title + "\nRelease Year: " + data.Year + "\nIMDB Rating: " + data.imdbRating + "\nRotten Tomatoes Rating: No Rotten Tomatoes Rating\nCountry movie produced in: " + data.Country + "\nLanguage: " + data.Language + "\nPlot: " + data.Plot + "\nActors: " + data.Actors + "\n********************************************************************************\n");
                    console.log(movieAppend)
                    fs.appendFile("log.txt", movieAppend, function (err) {
                        if (err) {
                            return console.log("Movie data did not append to log.txt file.");
                        };
                    });
                    return
                } else if (data.Ratings[1].Value !== undefined) {
                    var movieAppend = ("\n********************************** MOVIE THIS **********************************\nTitle: " + data.Title + "\nRelease Year: " + data.Year + "\nIMDB Rating: " + data.imdbRating + "\nRotten Tomatoes Rating: " + data.Ratings[1].Value + "\nCountry movie produced in: " + data.Country + "\nLanguage: " + data.Language + "\nPlot: " + data.Plot + "\nActors: " + data.Actors + "\n********************************************************************************\n");
                    console.log(movieAppend)
                    fs.appendFile("log.txt", movieAppend, function (err) {

                    });
                };
            };
        };

    });
};

function spotifyThis(song) {
    song = "'" + song + "'";
    console.log("spotifyThis: " + song);
    spotify.search({
        type: 'track',
        query: song
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        if (!data.tracks.items || !data.tracks.items.length) {
            console.log("could not find this song: " + song);
            return;
        }
        for (var i = 0; i < data.tracks.items.length; i++) {
            if (data.tracks.items[i].preview_url &&
                data.tracks.items[i].name &&
                data.tracks.items[i].album.name) {
                logSongs(data.tracks.items[i]);
                return;
            }
        };
    });
};


//Log song and write to log.txt
function logSongs(item) {
    var spotifyAppend = "(********************************** Spotify Song *********************************" + "\n" +
        "The song name: ";
    if (item.name)
        spotifyAppend = spotifyAppend + item.name;
    else
        spotifyAppend = spotifyAppend + "No name";

    spotifyAppend = spotifyAppend + "\n" + "Album name: ";

    if (item.album && item.album.name)
        spotifyAppend = spotifyAppend + item.album.name + "\n";
    else
        spotifyAppend = spotifyAppend + "No Album name" + "\n";

    if (item.popularity)
        spotifyAppend = spotifyAppend + "Popularity of the song: " + item.popularity + "\n";
    else
        spotifyAppend = spotifyAppend + "Popularity of the song: no popularity rating " + "\n";

    if (item.preview_url)
        spotifyAppend = spotifyAppend + "Song preview: " + item.preview_url + "\n";
    else
        spotifyAppend = spotifyAppend + "Song preview: No song preview " + "\n";

    if (item.track_number)
        spotifyAppend = spotifyAppend + "Track number: " + item.track_number + "\n";
    else
        spotifyAppend = spotifyAppend + "Track number: no track number  " + "\n";

    if (item.artist && item.artist.name)
        spotifyAppend = spotifyAppend + "Song's Artist: " + item.artist.name + "\n";
    else
        spotifyAppend = spotifyAppend + "Song's Artist: No artist " + "\n";

    spotifyAppend = spotifyAppend + "*********************************************************************************)";
    console.log(spotifyAppend);
    fs.appendFile("log.txt", spotifyAppend, function (err) {});
}

function concertThis(bands) {
    console.log(bands);
    var bandsAppend = "";
    var queryURL = "https://rest.bandsintown.com/artists/" + bands.trim() + "/events?app_id=12677f5a7f6ea3d8f4ed813de5bf152e"
    request(queryURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            //var dateForm = month + "/" + day + "/" + year;
            //console.log(bandsAppend);
            //console.log(JSON.parse(body));
            logEvent((JSON.parse(body)));
            //console.log(body);
            fs.appendFile("log.txt", bandsAppend, function (err) {

            });
        }
    })
};
function logEvent (event) {
    //console.log(event);
    for(var i = 0; i < event.length; i++){
        console.log(event[i])
    }
}