import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {ScrollService} from 'helpers/scroll/scroll.service';

export class HomeController {

  isLoading = true;
  animate = false;
  images = [
    'images/home/party1.jpg',
    'images/home/party2.jpg',
    'images/home/party3.jpg',
    'images/home/party4.jpg',
    'images/home/party2.jpg?',
    'images/home/party3.jpg?'
  ];

  private logger: ILogger;

  constructor(private $cordovaInAppBrowser: any,
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

  open(url: string) {
    this.$cordovaInAppBrowser.open(url, '_system');
  }

}

app.controller('homeController', HomeController);
