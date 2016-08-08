import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

export class PlayerController {

  stickyControls: boolean = false;

  private logger: ILogger;

  constructor(private $scope: ng.IScope,
              private $window: ng.IWindowService,
              private $cordovaInAppBrowser: any,
              logger: LoggerService) {

    this.logger = logger.getLogger('player');
    this.logger.log('init');
  }

  open(url: string) {
    this.$cordovaInAppBrowser.open(url, '_system');
  }

  onScroll(scrollDelagte: ionic.scroll.IonicScrollDelegate) {
    let threshold = this.$window.innerHeight / 2 - 44;  // 50vh - $bar-height
    let scrollTop = scrollDelagte.getScrollPosition().top;
    this.$scope.$apply(() => {
      this.stickyControls = scrollTop >= threshold;
    });
  }

}

app.controller('playerController', PlayerController);
