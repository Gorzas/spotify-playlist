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
const getAllTracks = require('./core');
const fs = require('fs');
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
 * Receives an Array of songs and exports it in a text file.
 *
 * The text file is an ordered list in markdown with a list of the total of
 * artists of the playlist.
 *
 * This is an example of retrieving data with the Spotify API and you can
 * modify this code as you like.
 *
 * @param  {Array} items Array items response from the Spotify API
 *
 * @return {Boolean}     True if everything went OK
 */
function export_playlist_tracks(items) {
  var tags = [];
  var text = `Playlist:\n\n`;
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

getAllTracks().then((res) => export_playlist_tracks(res));