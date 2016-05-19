import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

export class PlaylistController {

  private logger: ILogger;

  constructor(logger: LoggerService) {
    this.logger = logger.getLogger('playlist');
    this.logger.log('init');
  }

}

app.controller('playlistController', PlaylistController);
