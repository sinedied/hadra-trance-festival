/// <reference path="../../.tmp/typings/tsd.d.ts" />

'use strict';

// /**
//  * Entry point of the application.
//  * Only declare here global modules needed for the application to start.
//  * These modules should be kept to minimum.
//  */
// angular.module('app', [
//   // Dependencies
//   'ionic',
//   'app.controllers'
//   // Generated modules
//   // TODO: inject in build?

//   // Base modules (for root controller)

//   // Screens

// ]);

/**
 * Entry point of the application.
 * Only declare here global modules needed for the application to start.
 * These modules should be kept to minimum.
 */
angular.module('app', ['ionic', 'app.controllers', 'plangular'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, plangularConfigProvider) {

  plangularConfigProvider.clientId = 'c893b01b1f81d8cecc69fa8594f68d41';

    // home         -
    // events
    // releaases    -
    // artists      -
    //     ..
    // festival
    // workshops
    // psytrance    -
    // about        -



  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'modules/shell/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'modules/home.html'
      }
    }
  })

  .state('app.releases', {
      url: '/releases',
      views: {
        'menuContent': {
          templateUrl: 'modules/releases.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'modules/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'modules/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
