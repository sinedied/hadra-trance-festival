import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {PlayerService} from 'helpers/player/player.service';

export class PlayerController {

  stickyControls: boolean = false;

  private logger: ILogger;
  private statusBarHeight: number = 0;

  constructor(private $scope: ng.IScope,
              private $window: ng.IWindowService,
              private $cordovaInAppBrowser: any,
              private playerService: PlayerService,
              logger: LoggerService) {

    this.logger = logger.getLogger('player');
    this.logger.log('init');
    this.getStatusBarHeight();
  }

  open(url: string) {
    this.$cordovaInAppBrowser.open(url, '_system');
  }

  onScroll(scrollDelagte: ionic.scroll.IonicScrollDelegate) {
    let offset = this.statusBarHeight + 44 ;                // $bar-height + $ios-statusbar-height / $bar-height
    let threshold = this.$window.innerHeight / 2 - offset;  // 50vh - offset
    let scrollTop = scrollDelagte.getScrollPosition().top;
    this.$scope.$apply(() => {
      this.stickyControls = scrollTop >= threshold;
    });
  }

  updatePlayerContext(scope: ng.IScope) {
    this.playerService.updateContext(scope);
  }

  private getStatusBarHeight() {
    if (ionic.Platform.isIOS()) {
      // Try to detect iPhone X, NOT WORKING
      const div = document.createElement('div');
      document.body.appendChild(div);
      div.style.height = 'constant(safe-area-inset-left)';
      const height1 = parseInt(window.getComputedStyle(div).height, 10);
      this.logger.log('' + height1);
      div.style.height = 'env(safe-area-inset-left)';
      const height2 = parseInt(window.getComputedStyle(div).height, 10);
      this.logger.log('' + height2);
      document.body.removeChild(div);
      const height = Math.max(height1, height2);
      this.statusBarHeight = height > 0 ? height : 20;
    } else {
      this.statusBarHeight = 0;
    }
    this.logger.log('Detected statusBarHeight: ' + this.statusBarHeight);
  }

}

app.controller('playerController', PlayerController);
