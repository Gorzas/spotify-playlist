/**
 * Get Playlist Tracks names and artists with Spotify
 * --------------------------------------------------
 * 
 * Script for Node based in the examples provided for Spotify.
 * 
 * - Spotify original examples: 
 * https://github.com/spotify/web-api-auth-examples/
 *
 *
 * Usage:
 *   node get_playlist_tracks.js <playlist_uri>
 * 
 **/

// Variables
var url_token = 'https://accounts.spotify.com/api/token';
var request = require('request');
var fs = require('fs');
var config = require('./config.json');
var auth_options, user_id, playlist_id;

// Functions
/**
 * extract_playlist_args
 * ---------------------
 *
 * Parses a Spotify playlist URI and gets from it the parameters *user_id* and
 * *playlist_id*.
 * 
 * @param  {string}   playlist_uri  URI or URL of the playlist
 * @param  {string}   separator     String needed to parse the playlist_uri
 *                                  and to get their parameters
 * @param  {int}      min_length    Minimum length expected of the playlist_uri
 *                                  after being splited with the separator
 * @return {boolean}                True if it was a valid playlist_uri
 */
function extract_playlist_args(playlist_uri, separator, min_length) {
  var playlist;

  if ('string' !== typeof(playlist_uri)) {
    throw new Error('extract_playlist_args: playlist_uri must be a string');
  }

  playlist = playlist_uri.split(separator);

  if (playlist.length >= min_length) {
    user_id = playlist[min_length - 3];
    playlist_id = playlist[min_length -1];

    return true;
  }

  return false;
}
/**
 * get_args
 * --------
 *
 * Evaluate arguments passed to the script and gets the playlist uri
 * 
 * @param  {array}   argv Passed arguments
 * @return {boolean}      True if the passed arguments were correct
 */
function get_args(argv) {
  var min_length = 0;
  var playlist, separator

  if (argv.length < 3) {
    console.log('Error: not enough arguments');
    console.log(
      'Usage: node get_playlist_tracks.js <playlist_uri>'
    );

    return false;
  }

  playlist = argv[2];

  if (playlist.indexOf('http') === 0) {
    separator = '/';
    min_length = 7;
  } else if (playlist.indexOf('spotify') === 0) {
    separator = ':';
    min_length = 5;
  } 

  if (
    (min_length === 0) || 
    (!extract_playlist_args(playlist, separator, min_length))
  ) {
    console.log('Error: incorrect playlist string');

    return false;
  }

  return true;
}
/**
 * get_tracks
 * ----------
 *
 * Handles a list of tracks of the Spotify API and translates it into an
 * Array with name of the track and the artists who made it.
 * 
 * @param  {Array} tracks Array with the total of tracks information of the 
 *                        Spotify API
 *                        
 * @return {Array}        A parsed Array with the name of the track and the 
 *                        artist
 */
function get_tracks(tracks) {
  var songs = [];

  tracks.forEach(function (item) {
    var artists = [];

    item.track.artists.forEach(function (artist) {
      artists.push(artist.name);
    });

    songs.push({
      artists: artists.join(', '),
      name : item.track.name
    });
  });

  return songs;
}
/**
 * export_playlist_tracks
 * ----------------------
 * 
 * Receives a JSON Object and exports it in a text file.
 *
 * The text file is an ordered list in markdown with a list of the total of
 * artists of the playlist. 
 * 
 * This is an example of retrieving data with the Spotify API and you can
 * modify this code as you like.
 * 
 * @param  {Object} json JSON response of the Spotify API
 * 
 * @return {Boolean}     True if everything went OK
 */
function export_playlist_tracks(json) {
  var items = json.items;
  var tags = [];
  var text = 'Playlist id: ' + playlist_id +'\n\n';
  var songs = [];
  var i = 1;

  if ('undefined' !== typeof items && items.forEach) {
    songs = get_tracks(items);

    if (songs.length < 1) {
      console.log('Error: empty playlist');

      return false;
    }

    songs.forEach(function (song) {
      text += i + '. ' + song.artists + ' - ' + song.name + '\n';
      tags.push(song.artists);

      i++;
    });

    text += '\nArtists: ' + tags.join(', ');

    fs.writeFile('./export.md', text, function (err) {
      if(err) {
        console.log(err);
      } else {
        console.log("The file was saved!");
      }
    });

    return true;
  }

  return false;
}

// check if config file is correct
if (!config.client_id || !config.client_secret) {
  console.log('Error: incorrect config data');
  process.exit();
}

if (!get_args(process.argv)) {
  process.exit();
}

// connection with Spotify API to get access_token
auth_options = {
  url : url_token,
  headers : {
    'Authorization' : 'Basic ' + 
      (new Buffer(config.client_id + ':' + config.client_secret)
        .toString('base64'))
  },
  form: {
    grant_type : 'client_credentials'
  },
  json : true
};

console.log('Fetching access token');
console.log('---------------------');

request.post(auth_options, function (err, resp, body) {
  var options, token;

  if (!err && resp.statusCode === 200) {
    token = body.access_token;

    console.log('\n');
    console.log('Retrieving songs');
    console.log('---------------------');

    options = {
      uri : 'https://api.spotify.com/v1/users/' + user_id + 
        '/playlists/' + playlist_id + '/tracks',
      headers : {
        'Authorization' : 'Bearer ' + token
      },
      json : true
    };

    request.get(options, function (err, resp, body) {
      if (!err && resp.statusCode === 200) {
        // handle the tracks list
        export_playlist_tracks(body);
      }
    });
  }
});