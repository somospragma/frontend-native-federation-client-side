const fs = require('fs');

function loadManifestLocal() {
  return new Promise((resolve, reject) => {
    const MODULES_MANIFEST_URL = '../host/src/assets/federation.manifest.json';

    fs.readFile(MODULES_MANIFEST_URL, 'utf8', (err, data) => {
      err && reject(err);
      resolve(JSON.parse(data));
    });
  });
}

module.exports = {
  loadManifestLocal,
};