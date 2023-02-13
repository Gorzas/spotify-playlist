const config = require('./config.json');
const getAllTracks = require('./core');
const fs = require('fs');
const path = require('path');

const sourceDirectory = config.source_dir;
const targetDirectory = config.target_dir;

function searchFiles(dir, trackNames) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      searchFiles(fullPath, trackNames);
    } else {
      trackNames.forEach(trackName => {
        if (file.includes(trackName)) {
          fs.copyFileSync(fullPath, path.join(targetDirectory, file));
        }
      });
    }
  });
}

getAllTracks().then((tracks) => searchFiles(sourceDirectory, tracks.map(item => item.track.name)));