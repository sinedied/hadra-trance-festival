import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

export class LineupController {

  private logger: ILogger;

  constructor(logger: LoggerService) {
    this.logger = logger.getLogger('lineup');
    this.logger.log('init');
  }

}

app.controller('lineupController', LineupController);
