import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

export class PlayerController {

  private logger: ILogger;

  constructor(logger: LoggerService) {
    this.logger = logger.getLogger('player');
    this.logger.log('init');
  }

}

app.controller('playerController', PlayerController);
