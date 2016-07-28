import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {ScrollService} from 'helpers/scroll/scroll.service';

export class HomeController {

  animate = false;
  nowPlaying = {
    artist: {
      id: 0,
      name: 'The Green Nuns of the Revolution'
    },
    scene: 'Main floor',
    slot: '22:00 - 0:00'
  };

  private logger: ILogger;

  constructor(private $cordovaInAppBrowser: any,
              private $state: angular.ui.IStateService,
              $scope: ng.IScope,
              $interval: ng.IIntervalService,
              logger: LoggerService,
              scrollService: ScrollService) {

    this.logger = logger.getLogger('home');
    this.logger.log('init');

    // Trigger pound animation
    let poundPromise = $interval(() => {
      this.animate = !this.animate;
    }, 5000);

    $scope.$on('destroy', () => {
      $interval.cancel(poundPromise);
    });

    scrollService.fixXScrollWithHandle('artists-scroll');
    scrollService.fixXScrollWithHandle('photos-scroll');
  }

  showArtist(artistId: number) {
    this.$state.go('app.artist', {artistId: artistId});
  }

  open(url: string) {
    this.$cordovaInAppBrowser.open(url, '_system');
  }

  updateNowPlayingInfos() {

  }

}

app.controller('homeController', HomeController);
