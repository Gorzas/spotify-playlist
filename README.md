# Spotify Playlist

A brief example of the usage of the Spotify API with Node. The code connects
with the Spotify API and it retrieves all the songs of an specific playlist.
Then, it exports the metadata to a text file in markdown format.

## Usage:

1. Ensure that Node.js is installed
2. Run `npm install` to ensure the required dependencies are installed
3. Register your application in Spotify following their [tutorial](https://developer.spotify.com/web-api/tutorial/)
4. Include your `client_id` and your `client_secret` in */node/config.json* following the example in *config_sample.json*
5. `cd node/`
6. Run `node get_playlist_tracks.js <playlist_uri>`