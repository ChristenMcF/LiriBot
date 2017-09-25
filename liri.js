var fs = require('fs');
var keys = require('./keys.js');
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var input1 = process.argv[2];
var input2 = process.argv.splice(3).join(" ");
var spotify = new Spotify({
  id: 'c2bbc6fe3a3746759e28b52291e1b477',
  secret: 'bbafb6407eb4416fa5c59b1e20e91a0f'
});
var app = {
  "my-tweets": function() {
    var client = new twitter(keys.twitterKeys);
    client.get('statuses/user_timeline', function(error, tweetData, response) {
      if (!error) {
        console.log(' ');
        console.log('=== My Tweets ===');
        tweetData.forEach(function(obj) {
          console.log('---');
          console.log('Time: ' + obj.created_at);
          console.log('Tweet: ' + obj.text);
          console.log('---');
          console.log(' ');
        });
          console.log('======');
          console.log(' ');
        app.logData(tweetData);
     } else {
        console.log(error);
      }
    });
  },
  "spotify-this-song": function(keyword) {
    spotify.search({ type: 'track', query: keyword || 'The Sign Ace of Base' }, function(err, data) {
      if ( err ) {
          console.log('Error occurred: ' + err);
          return;
      }
      if(data.tracks.items.length > 0) {
        var record = data.tracks.items[0];
          console.log(' ');
          console.log('=== Song Info ===');
          console.log('Artist: ' + record.artists[0].name);
          console.log('Name: ' + record.name);
          console.log('Link: ' + record.preview_url);
          console.log('Album: ' + record.album.name);
          console.log('======');
          console.log(' ');
        app.logData(data);
      } else {
        console.log('I Want It That Way');
      }
    });
  },
  "movie-this": function(query) {
    request('http://www.omdbapi.com/?t=' + (query || 'Mr.Nobody') +'&apikey=40e9cece', function (error, response, info) {
      if (!error && response.statusCode == 200) {
        var movieData = JSON.parse(info);
          console.log(' ');
          console.log('=== Movie Info ===');
          console.log('Title: ' + movieData.Title);
          console.log('Year: ' + movieData.Year);
          console.log('Rotten Tomatoes Rating: ' + movieData.tomatoRating);
          console.log('IMDB Rating: ' + movieData.imdbRating);
          console.log('Country: ' + movieData.Country);
          console.log('Language: ' + movieData.Language);
          console.log('Plot: ' + movieData.Plot);
          console.log('Actors: ' + movieData.Actors);
          console.log('=======');
          console.log(' ');
        app.logData(movieData);
      }
    });
  },
  "do-what-it-says": function() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
      if(err) throw err;
        console.log(data.toString());

      var output = data.toString().split(',');
       app[output[0].trim()](output[1].trim());
    });
  },
  logData: function(data) {
    fs.appendFile('log.txt', JSON.stringify(data, null, 2) + '\n============\n', function(err) {
      if(err) {
        console.log(err);
      }
    });
  }
};

app[input1](input2);