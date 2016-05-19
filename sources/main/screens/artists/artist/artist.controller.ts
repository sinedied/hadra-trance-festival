import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

export class ArtistController {

  private logger: ILogger;

  constructor(logger: LoggerService) {
    this.logger = logger.getLogger('artist');
    this.logger.log('init');
  }

}

app.controller('artistController', ArtistController);
