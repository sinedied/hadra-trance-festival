import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

export class FavoritesController {

  private logger: ILogger;

  constructor(logger: LoggerService) {
    this.logger = logger.getLogger('favorites');
    this.logger.log('init');
  }

}

app.controller('favoritesController', FavoritesController);
