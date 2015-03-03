# Spotify Playlist

A brief example of the usage of the Spotify API with Node. The code connects
with the Spotify API and it retrieves all the songs of an specific playlist.
Then, it exports the metadata to a text file in markdown format.

Usage:

1. Install dependencies: *npm install*
2. Register your application in Spotify following their [tutorial](https://developer.spotify.com/web-api/tutorial/)
3. Include your **client_id** and your **client_secret** in **/node/config.json** following the example in *config_sample.json*
4. Change directory to node: cd node/
5. Launch script: node get_playlist_tracks.js <playlist_uri>