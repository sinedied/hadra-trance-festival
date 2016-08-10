#!/usr/bin/env node

/*
 * Extract images from specified JSON file, and put result in a separate folder.
 * Also cleanup the JSON during the process.
 */

var args = process.argv.splice(2);
var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var iconvlite = require('iconv-lite');

var json = require(path.isAbsolute(args[0]) ? args[0] : path.join(__dirname, args[0]));
var fixesFile = args[1] || 'fixes.json';
var fixes = require(path.isAbsolute(fixesFile) ? fixesFile : path.join(__dirname, fixesFile));
var outFolder = args[1] || 'out';
var imagesFolder = path.join(outFolder, 'artists');
var imagesPrefix = 'images/artists/';
var artists = []
var scenes = [
  {
    "name": "Main",
    "sets": []
  },
  {
    "name": "Alternative",
    "sets": []
  }
];

if (!fs.existsSync(outFolder)){
  fs.mkdirSync(outFolder);
  fs.mkdirSync(imagesFolder);
}

var numPhotos = 0;
var numBanners = 0;

console.log('Loaded ' + json.length + ' artists');

json.forEach(function(i) {
  var artist = i.artist;
  var buffer, filename;

  if (artist.photo) {
    buffer = new Buffer(artist.photo, 'base64');
    filename = 'photo-' + artist.id + '.jpg';
    fs.writeFileSync(path.join(imagesFolder, filename), buffer);
    numPhotos++;
    artist.photo = imagesPrefix + filename;
  } else {
    console.warn('Artist ' + artist.name + ' does not have a photo!');
  }

  if (artist.banner) {
    buffer = new Buffer(artist.banner, 'base64');
    filename = 'banner-' + artist.id + '.jpg';
    fs.writeFileSync(path.join(imagesFolder, filename), buffer);
    numBanners++;
    artist.banner = imagesPrefix + filename;
  } else {
    console.warn('Artist ' + artist.name + ' does not have a banner!');
  }

  // Cleanup
  artist.id = '' + artist.id;
  artist.name = fixName(fixUnicode(artist.name));
  artist.country = fixUnicode(artist.origin);
  artist.label = fixUnicode(artist.label);
  artist.bio = { fr: fixBio(fixUnicode(artist.bioFr)) };
  artist.website = cleanUrl(artist.website);
  artist.mixcloud = cleanUrl(fixUrl(artist.mixcloud, 'mixcloud.com'));
  artist.soundcloud = cleanUrl(fixUrl(artist.soundcloud, 'soundcloud.com'));
  artist.facebook = cleanUrl(fixUrl(artist.facebook, 'facebook.com'));

  if (!artist.bioFr) {
    console.warn('Artist ' + artist.name + ' does not have a bio!');
  }

  if (artist.website) {
    console.log('Artist ' + artist.name + ' has website');
  }

  delete artist.origin;
  delete artist.bannerXOffset;
  delete artist.bannerYOffset;
  delete artist.createdAt;
  delete artist.updatedAt;
  delete artist.bioEn;
  delete artist.bioFr;
  delete artist.isFavorite;

  artist = applyManualFix(artist);
  artists.push(artist);

  var set = {
    type: i.type,
    start: i.start,
    end: i.end,
    artistId: artist.id
  }
  scenes[i.stage.id - 1].sets.push(set);

});

scenes.forEach(function(scene) {
  scene.sets = _.sortBy(scene.sets, ['start']);
});

fs.writeFileSync(path.join(outFolder, 'data.json'), JSON.stringify({ lineup: scenes, artists: artists}, null, 2));

console.log('Extracted: ' + numPhotos + ' photos, ' + numBanners + ' banners');

// Internal
// ------------------------------------

function fixUrl(url, site) {
  if (!url) {
    return null;
  }

  if (url.indexOf(site) === -1) {
    return site + '/' + url;
  }

  return url;
}

function cleanUrl(url) {
  if (!url) {
    return null;
  }

  if (url.indexOf('http:') === 0) {
    url = url.replace('http:', 'https:')
  } else if (url.indexOf('http') !== 0) {
    url = 'https://' + url;
  }

  url = url
    .replace('?fref=ts', '')
    .replace('//facebook.com', '//www.facebook.com')
    .replace('//mixcloud.com', '//www.mixcloud.com')
    .replace('m.facebook.com', 'www.facebook.com')
    .replace('m.soundcloud.com', 'soundcloud.com')

  return url;
}

function fixBio(bio) {
  if (!bio) {
    return null;
  }

  return bio
    .replace(/\r\n/g, '<br>')
    .replace(/\t/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/�\?\?/g, '\'');
}

function fixUnicode(str) {
  if (!str) {
    return;
  }

  // Fix bad DB encoding (utf8 encoded as latin1)
  str = iconvlite.encode(str, 'latin1');
  str = iconvlite.decode(str, 'utf8');

  return str;
}

function fixName(name) {
  return capitalize(name.toLowerCase())
    .replace('Dj', 'DJ');
}

function applyManualFix(artist) {
  var fix = _.find(fixes, { id: artist.id });

  if (fix) {
    _.assign(artist, fix);
  }

  return artist;
}

function capitalize(str) {
  return str.replace(/\b\w/g, function(l){
    return l.toUpperCase();
  });
}
