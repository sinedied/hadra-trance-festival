import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

export class InfosController {

  private logger: ILogger;

  constructor(logger: LoggerService) {
    this.logger = logger.getLogger('infosController');
    this.logger.log('init');
  }

}

app.controller('infosController', InfosController);
