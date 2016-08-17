#!/usr/bin/env node

/*
 * Extract images from specified JSON file, and put result in a separate folder.
 * Also cleanup the JSON during the process, and gets missing picture/banners from facebook.
 */

var args = process.argv.splice(2);
var fs = require('fs');
var path = require('path');
var FB = new require('fb');
var request = require('request-promise');
var cheerio = require('cheerio');
var _ = require('lodash');
var Promise = require("bluebird");
var iconvlite = require('iconv-lite');

var json = require(path.isAbsolute(args[0]) ? args[0] : path.join(__dirname, args[0]));
var fixesFile = 'fixes.json';
var fixes = require(path.isAbsolute(fixesFile) ? fixesFile : path.join(__dirname, fixesFile));
var outFolder = 'out';
var baseJsonPath = args[1] ? path.isAbsolute(args[1]) ? args[1] : path.join(__dirname, args[1]) : null;
var baseJson = args[1] ? require(baseJsonPath) : null;
var imagesFolder = path.join(outFolder, 'artists');
var imagesPrefix = 'images/artists/';
var artists = [];
var scenes = [
  {
    "name": "Main",
    "hide": false,
    "sets": []
  },
  {
    "name": "Alternative",
    "hide": false,
    "sets": []
  }
];

if (!fs.existsSync(outFolder)) {
  fs.mkdirSync(outFolder);
  fs.mkdirSync(imagesFolder);
}

var numPhotos = 0;
var numBanners = 0;
var promises = [];
var duplicates = {};
var auth = facebookAuth();

console.log('Loaded ' + json.length + ' artists');

json.forEach(function (i) {
  var artist = i.artist;
  var buffer, filename, promise;

  // Cleanup
  artist.id = '' + artist.id;
  artist.name = fixName(artist.name).trim();
  artist.country = artist.origin;
  artist.label = artist.label;
  artist.bio = {fr: fixBio(artist.bioFr)};
  artist.website = cleanUrl(artist.website);
  artist.mixcloud = cleanUrl(fixUrl(artist.mixcloud, 'mixcloud.com'));
  artist.soundcloud = cleanUrl(fixUrl(artist.soundcloud, 'soundcloud.com'));
  artist.facebook = cleanUrl(fixUrl(artist.facebook, 'facebook.com'));

  if (artist.photo) {
    buffer = new Buffer(artist.photo, 'base64');
    filename = 'photo-' + artist.id + '.jpg';
    fs.writeFileSync(path.join(imagesFolder, filename), buffer);
    numPhotos++;
    artist.photo = imagesPrefix + filename;
  // } else if (artist.facebook) {
  //   promise = getFacebookUserId(artist.facebook)
  //     .then(function(id) {
  //       return getFacebookPhoto(id);
  //     })
  //     .then(function(data) {
  //       console.log('Got ' + artist.name + '\'s photo from facebook');
  //       // var buffer = new Buffer(data, 'binary');
  //       var filename = 'photo-' + artist.id + '.jpg';
  //       fs.writeFileSync(path.join(imagesFolder, filename), data, 'binary');
  //       numPhotos++;
  //       artist.photo = imagesPrefix + filename;
  //     })
  //     .catch(function(err) {
  //       console.warn('Error, cannot get artist ' + artist.name + ' photo from facebook!');
  //       // console.warn('Error details: ' + err);
  //     })
  //   promises.push(promise);
  }

  if (artist.banner) {
    buffer = new Buffer(artist.banner, 'base64');
    filename = 'banner-' + artist.id + '.jpg';
    fs.writeFileSync(path.join(imagesFolder, filename), buffer);
    numBanners++;
    artist.banner = imagesPrefix + filename;
  // } else if (artist.facebook) {
  //   promise = getFacebookUserId(artist.facebook)
  //     .then(function(id) {
  //       return getFacebookCover(id);
  //     })
  //     .then(function(data) {
  //       console.log('Got ' + artist.name + '\'s cover from facebook');
  //       var filename = 'banner-' + artist.id + '.jpg';
  //       fs.writeFileSync(path.join(imagesFolder, filename), data, 'binary');
  //       numBanners++;
  //       artist.banner = imagesPrefix + filename;
  //     })
  //     .catch(function(err) {
  //       console.warn('Error, cannot get artist ' + artist.name + ' cover from facebook!');
  //     })
  //   promises.push(promise);
  }

  delete artist.origin;
  delete artist.bannerXOffset;
  delete artist.bannerYOffset;
  delete artist.createdAt;
  delete artist.updatedAt;
  delete artist.bioEn;
  delete artist.bioFr;
  delete artist.isFavorite;

  artist = applyArtistFix(artist);

  if (!artist.bio || (!artist.bio.fr && !artist.bio.en)) {
    console.warn('Artist ' + artist.name + ' does not have a bio! | ' + artist.id);
  }

  if (artist.website) {
    console.log('Artist ' + artist.name + ' has website');
  }

  if (!artist.photo) {
    console.warn('Artist ' + artist.name + ' does not have a photo! | ' + artist.id);
  }

  if (!artist.banner) {
    console.warn('Artist ' + artist.name + ' does not have a banner! | ' + artist.id);
  }

  var duplicate = _.find(artists, { name: artist.name });
  var skip = false;

  if (duplicate) {
    console.warn('Duplicate artist ' + artist.name + ' | ' + artist.id + ', ' + duplicate.id);
    duplicates[artist.name] = duplicate;
    skip = true;
    console.log('Fixed duplicate artist ' + artist.name + ' | ' + artist.id + ', ' + duplicate.id);
  }

  var duplicateInfos = _.find(artists, { facebook: artist.facebook });
  if (!duplicate && duplicateInfos) {
    console.warn('Duplicate artist info ' + artist.name + ' | ' + artist.id + ' -> ' + duplicateInfos.id);
  }

  if (!skip) {
    artists.push(artist);
  }

  var set = {
    type: i.type,
    start: i.start,
    end: i.end,
    artistId: duplicate ? duplicates[artist.name].id : artist.id
  };
  scenes[i.stage.id - 1].sets.push(set);

});

artists = _.sortBy(artists, ['name']);

scenes.forEach(function (scene) {
  scene = applyLineupFix(scene);
  scene.sets = _.sortBy(scene.sets, ['start']);
});

// Check for orphan artists
_.each(artists, function (artist) {
  var sets = [];
  _.each(scenes, function(scene) {
    _.each(scene.sets, function(set) {
      if (set.artistId === artist.id) {
        sets.push(set);
      };
    });
  });
  if (!sets.length) {
    console.warn('Warning, artist ' + artist.name + ' has no sets!');
  }
});

// Check for holes in lineup
_.each(scenes, function(scene) {
  var previous = null;
  _.each(scene.sets, function(set) {
    if (previous && previous.end !== set.start && previous.start !== set.start) {
      console.warn('Warning, hole between sets: ' + previous.artistId + '[' + previous.end + ']->' + set.artistId + '[' + set.start + '] on scene ' + scene.name);
    }
    previous = set;
  });
});


var newJson = {lineup: scenes, artists: artists};

Promise.all(promises).then(function() {
  fs.writeFileSync(path.join(outFolder, 'data.json'), JSON.stringify(newJson, null, 2));

  console.log('Extracted: ' + numPhotos + ' photos, ' + numBanners + ' banners');

  if (baseJson) {
    _.assign(baseJson, newJson);

    fs.writeFileSync(baseJsonPath, JSON.stringify(baseJson, null, 2));

    console.log('Updated ' + baseJsonPath);
  }
});


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

function applyArtistFix(artist) {
  var fix = _.find(fixes.artists, {id: artist.id});

  if (fix) {
    _.assign(artist, fix);
  }

  return artist;
}

function applyLineupFix(lineup) {
  var fix = _.find(fixes.lineup, {name: lineup.name});

  if (fix) {
    _.assign(lineup, fix);
  }

  return lineup;
}

function capitalize(str) {
  return str.replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
}

function getFacebookUserId(url) {
  return request({
    // Use mobile version as it does not require JS
    uri: url.replace('www.', 'm.'),
    transform: function (body) {
      return cheerio.load(body);
    },
    headers: {
      // Simulate Chrome
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
    }
  })
  .then(function ($) {
    // Get facebook user id
    var content = $.html();
    var re = /fbid=.*?id=(\d*?)&/gm;
    var match = re.exec(content);

    if (!match || match[1]) {
      console.warn('Could not find FB user id for url: ' + url + ', trying with url');
      return url;
    }

    return match[1];
  });
}

function facebookAuth() {
  return new Promise(function (resolve, reject) {
    FB.api('oauth/access_token', {
      client_id: '1795175897368530',
      client_secret: process.env.FB_SECRET,
      grant_type: 'client_credentials'
    }, function (res) {
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        reject();
      } else {
        var accessToken = res.access_token;
        FB.setAccessToken(accessToken);
        resolve(accessToken);
      }
    });
  });
}

function getFacebookPhoto(userId) {
  return auth.then(function () {
    return new Promise(function (resolve, reject) {
      FB.api(userId + '/picture?height=720&width=720', function (res) {
        if (!res) {
          reject();
        } else {
          resolve(res);
        }
      });
    });
  });
}

function getFacebookCover(userId) {
  return auth
    .then(function () {
      return new Promise(function (resolve, reject) {
        FB.api(userId + '?fields=cover', function (res) {
          if (!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            reject();
          } else {
            resolve(res.cover.source);
          }
        });
      });
    })
    .then(function (url) { return request(url); });
}
