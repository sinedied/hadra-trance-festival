import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

export class LineupController {
  lineup = [];

  private logger: ILogger;

  constructor(logger: LoggerService) {
    this.logger = logger.getLogger('lineup');
    this.logger.log('init');

    for (let i = 0; i < 50; ++i) {
      this.lineup[i] = {
        from: new Date(),
        to: new Date(),
        type: 'DJ',
        artist: 'Shotu vs Driss'
      };
    }


  }

}

app.controller('lineupController', LineupController);
