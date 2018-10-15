require("dotenv").config();
var request = require("request"),
    fs = require("fs"),
    keys = require("./keys.js"),
    infoInput = process.argv,
    action = process.argv[2],
    title = ""
if (process.argv[3] !== undefined) {
    for (i = 3; i < infoInput.length; i++) {
        title += infoInput[i] + " ";
    };
};

switch (action) {
    case "movie-this":
    movie();
    break;

};

function movie() {
    var queryURL = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";

    request(queryURL, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            if (body) {
                var data = JSON.parse(body);
                if (data.Error == 'Movie not found!') {
                    var logNoMovies = "\n********************************** MOVIE THIS **********************************\nOMDB could not find any movies that matched that title.  Please try again.\n********************************************************************************\n";
                    console.log(logNoMovies);
                } else if (data.Ratings.length < 2) {
                    var logMovies = "\n********************************** MOVIE THIS **********************************\nTitle: " + data.Title +   "\nRelease Year: " + data.Year +  "\nIMDB Rating: " + data.imdbRating + "\nRotten Tomatoes Rating: No Rotten Tomatoes Rating\nCountry movie produced in: " + data.Country +   "\nLanguage: " + data.Language + "\nPlot: " + data.Plot + "\nActors: " + data.Actors + "\n********************************************************************************\n";    
                    console.log(logMovies);
                    return
                } else if (data.Ratings[1].Value !== undefined) {
                    var logMovies =  "\n********************************** MOVIE THIS **********************************\nTitle: " + data.Title + "\nRelease Year: " + data.Year + "\nIMDB Rating: " + data.imdbRating + "\nRotten Tomatoes Rating: " + data.Ratings[1].Value +  "\nCountry movie produced in: " + data.Country + "\nLanguage: " + data.Language + "\nPlot: " + data.Plot + "\nActors: " + data.Actors + "\n********************************************************************************\n";    
                    console.log(logMovies);
                    
                };
            };
        };

    });
}


