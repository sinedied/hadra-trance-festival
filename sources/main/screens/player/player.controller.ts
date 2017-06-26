import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {PlayerService} from 'helpers/player/player.service';

export class PlayerController {

  stickyControls: boolean = false;

  private logger: ILogger;

  constructor(private $scope: ng.IScope,
              private $window: ng.IWindowService,
              private $cordovaInAppBrowser: any,
              private playerService: PlayerService,
              logger: LoggerService) {

    this.logger = logger.getLogger('player');
    this.logger.log('init');
  }

  open(url: string) {
    this.$cordovaInAppBrowser.open(url, '_system');
  }

  onScroll(scrollDelagte: ionic.scroll.IonicScrollDelegate) {
    let offset = ionic.Platform.isIOS() ? 64 : 44;          // $bar-height + $ios-statusbar-height / $bar-height
    let threshold = this.$window.innerHeight / 2 - offset;  // 50vh - offset
    let scrollTop = scrollDelagte.getScrollPosition().top;
    this.$scope.$apply(() => {
      this.stickyControls = scrollTop >= threshold;
    });
  }

  updatePlayerContext(scope: ng.IScope) {
    this.playerService.updateContext(scope);
  }

}

app.controller('playerController', PlayerController);
