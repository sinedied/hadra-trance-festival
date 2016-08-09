#!/usr/bin/env node

/*
 * Extract images from specified JSON file, and put result in a separate folder.
 * Also cleanup the JSON during the process.
 */

var args = process.argv.splice(2);
var fs = require('fs');
var path = require('path');

var iconvlite = require('iconv-lite');

var json = require(path.isAbsolute(args[0]) ? args[0] : path.join(__dirname, args[0]));
var outFolder = args[1] || 'out';
var imagesFolder = path.join(outFolder, 'images');
var imagesPrefix = 'images/artists/';
var artists = [];

if (!fs.existsSync(outFolder)){
  fs.mkdirSync(outFolder);
  fs.mkdirSync(imagesFolder);
}

var numPhotos = 0;
var numBanners = 0;

console.log('Loaded ' + json.length + ' artists');

json.forEach(function(i) {
  var artist = i.artist;

  if (artist.photo) {
    var buffer = new Buffer(artist.photo, 'base64');
    var filename = 'photo_' + artist.id + '.jpg';
    fs.writeFileSync(path.join(imagesFolder, filename), buffer);
    numPhotos++;
    artist.photo = imagesPrefix + filename;
  } else {
    console.warn('Artist ' + artist.name + ' does not have a photo!');
  }

  if (artist.banner) {
    var buffer = new Buffer(artist.banner, 'base64');
    var filename = 'banner_' + artist.id + '.jpg';
    fs.writeFileSync(path.join(imagesFolder, filename), buffer);
    numBanners++;
    artist.banner = imagesPrefix + filename;
  } else {
    console.warn('Artist ' + artist.name + ' does not have a banner!');
  }

  // Cleanup
  artist.id = '' + artist.id;
  artist.bio = { fr: fixBio(fixUnicode(artist.bioFr)) };
  artist.website = cleanUrl(artist.website);
  artist.mixcloud = cleanUrl(artist.mixcloud);
  artist.soundcloud = cleanUrl(artist.soundcloud);
  artist.facebook = cleanUrl(artist.facebook);

  // TODO: add soundcloud.com if needed

  if (!artist.bioFr) {
    console.warn('Artist ' + artist.name + ' does not have a bio!');
  }

  if (artist.website) {
    console.log('Artist ' + artist.name + ' has website');
  }

  delete artist.bannerXOffset;
  delete artist.bannerYOffset;
  delete artist.isfavorite;
  delete artist.createdAt;
  delete artist.updatedAt;
  delete artist.bioEn;
  delete artist.bioFr;
  delete artist.isFavorite;

  artists.push(artist);

});

fs.writeFileSync(path.join(outFolder, 'artists.json'), JSON.stringify(artists, null, 2));

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

  url = url.replace('?fref=ts', '');

  return url;
}

function fixBio(bio) {
  if (!bio) {
    return null;
  }

  return bio
    .replace(/\r\n/g, '<br>')
    .replace(/\t/g, '');
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
