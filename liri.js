require("dotenv").config();
function helpMenu() {
    console.log( "\n" + "How to run the lookup commands... " + "\n"  +"\n" + "A movie name(node liri.js movie-this<Movie name here>)" + "\n" + "A song name(node liri.js spotify-this-song<Song name here)" + "\n" + "A band lookup(node liri.js concert-this<artist/band name here>" + "\n");
}
helpMenu();
var request = require("request"),
    fs = require("fs"),
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

if (!param || param.length < 2) {
    param = "Pulp Fiction";
};

switch (action) {
    case 'concert-this':
        bandsInTown();
        break;
    case 'spotify-this-song':
        spotifyThis(param);
        break;
    case "movie-this":
        movie();
        break;
    case "do-what-it-says":
        doIt();
        break;
};
function movie() {
    var queryURL = "http://www.omdbapi.com/?t=" + param + "&y=&plot=short&apikey=trilogy";
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
    spotify.search({
        type: 'track',
        query: song
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (var i = 0; i < data.tracks.items.length; i++) {
            if (data.tracks.items[i].preview_url && data.tracks.items[i].name && data.tracks.items[i].album.name) {
                var spotifyAppend = ("********************************** Spotify Song *********************************" + "\n" + "The song name: " + data.tracks.items[i].name + "\n" + "Album name: " + data.tracks.items[i].album.name +"\n" + "Popularity of the song: " + data.tracks.items[i].popularity + "\n" + "Song preview: " + data.tracks.items[i].preview_url + "\n" + "Track number: " + data.tracks.items[i].track_number + "\n" + "Song's Artist: " + data.tracks.items[i].artists[i].name + "\n" + "*********************************************************************************");
                console.log(spotifyAppend)
                fs.appendFile("log.txt", spotifyAppend, function (err) {
                });
                return;
            };
        };
    });
};
// function bandsInTown(parameter){
//     var queryUrl = "https://rest.bandsintown.com/artists/"+param+"/events?app_id=codecademy";
//     request(queryUrl, function(error, response, body) {
    
//     });
//     }