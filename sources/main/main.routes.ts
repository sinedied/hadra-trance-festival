import app from 'main.module';

/**
 * Configures the application routes.
 */
function routeConfig($stateProvider: angular.ui.IStateProvider,
                     $urlRouterProvider: angular.ui.IUrlRouterProvider,
                     gettext: angular.gettext.gettextFunction) {

  // Routes configuration
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('app', {
      template: <string>require('shell/shell.html'),
      controller: 'shellController as shell'
    })
    .state('app.home', {
      url: '/',
      views: {
        'menuContent': {
          template: <string>require('screens/home/home.html'),
          controller: 'homeController as vm',
        }
      },
      data: {title: gettext('Home')}
    })
    .state('app.artists', {
      url: '/artists',
      views: {
        'menuContent': {
          template: <string>require('screens/artists/artists.html'),
          controller: 'artistsController as vm',
        }
      },
      data: {title: gettext('Artists')}
    })
    .state('app.artist', {
      url: '/artists/:artistId',
      views: {
        'menuContent': {
          template: <string>require('screens/artists/artist/artist.html'),
          controller: 'artistController as vm',
        }
      },
      data: {title: gettext('Artist')}
    })
    .state('app.lineup', {
      url: '/lineup',
      views: {
        'menuContent': {
          template: <string>require('screens/lineup/lineup.html'),
          controller: 'lineupController as vm',
        }
      },
      data: {title: gettext('Line-up')}
    })
    .state('app.map', {
      url: '/map',
      views: {
        'menuContent': {
          template: <string>require('screens/map/map.html'),
          controller: 'mapController as vm',
        }
      },
      data: {title: gettext('Map')}
    })
    .state('app.infos', {
      url: '/infos',
      views: {
        'menuContent': {
          template: <string>require('screens/infos/infos.html'),
          controller: 'infosController as vm',
        }
      },
      data: {title: gettext('Infos')}
    })
    .state('app.info', {
      url: '/infos/:infoId',
      views: {
        'menuContent': {
          template: <string>require('screens/infos/info/info.html'),
          controller: 'infoController as vm',
        }
      },
      data: {title: gettext('Info')}
    })
    .state('app.player', {
      url: '/player',
      views: {
        'menuContent': {
          template: <string>require('screens/player/player.html'),
          controller: 'playerController as vm',
        }
      },
      data: {title: gettext('Player')}
    })
    .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          template: <string>require('screens/about/about.html'),
          controller: 'aboutController as vm',
        }
      },
      data: {title: gettext('About')}
    });

}

app.config(routeConfig);
