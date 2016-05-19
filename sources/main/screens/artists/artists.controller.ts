import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

export class ArtistsController {

  private logger: ILogger;

  constructor(logger: LoggerService) {
    this.logger = logger.getLogger('artists');
    this.logger.log('init');
  }

}

app.controller('artistsController', ArtistsController);
