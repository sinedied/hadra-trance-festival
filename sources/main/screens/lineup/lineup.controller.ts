import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import gettextFunction = angular.gettext.gettextFunction;

export class LineupController {
  floors = [];
  selectedFloor = 0;

  private logger: ILogger;

  constructor(private moment: moment.MomentStatic,
              logger: LoggerService,
              gettext: gettextFunction) {

    this.logger = logger.getLogger('lineup');
    this.logger.log('init');

    let lineup = [];
    for (let i = 0; i < 50; ++i) {
      lineup[i] = {
        from: new Date(),
        to: new Date(),
        type: 'DJ',
        artist: 'Shotu vs Driss'
      };
    }

    this.floors = [
      {name: gettext('Main'), lineup: lineup},
      {name: gettext('Alternative'), lineup: lineup},
      {name: gettext('Chillout'), lineup: lineup},
    ];

  }

  selectFloor(index: number) {
    this.selectedFloor = index;
  }

  formatDate(date: Date) {
    return this.moment(date).format('hh:mm');
  }

}

app.controller('lineupController', LineupController);
