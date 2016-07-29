import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

export class PlayerController {

  private logger: ILogger;

  constructor(private $cordovaInAppBrowser: any,
              logger: LoggerService) {

    this.logger = logger.getLogger('player');
    this.logger.log('init');
  }

  open(url: string) {
    this.$cordovaInAppBrowser.open(url, '_system');
  }

}

app.controller('playerController', PlayerController);
