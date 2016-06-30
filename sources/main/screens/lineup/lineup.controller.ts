import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {ToastService} from 'helpers/toast/toast.service';
import gettextFunction = angular.gettext.gettextFunction;

export class LineupController {
  floors = [];
  selectedFloor = 0;

  private logger: ILogger;

  constructor(private $ionicListDelegate: ionic.list.IonicListDelegate,
              private moment: moment.MomentStatic,
              logger: LoggerService,
              private gettext: gettextFunction,
              private toastService: ToastService) {

    this.logger = logger.getLogger('lineup');
    this.logger.log('init');

    let lineup = [];
    for (let i = 0; i < 50; ++i) {
      lineup[i] = {
        from: new Date(),
        to: new Date(),
        type: 'DJ',
        artist: {
          name: 'Shotu vs Driss',
          isFavorite: false
        }
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

  switchFavorite(artist: any) {
    artist.isFavorite = !artist.isFavorite;

    if (artist.isFavorite) {
      this.toastService.show(this.gettext('Added to favorites!<br>You will be notified when this set starts.'));
    }

    this.$ionicListDelegate.closeOptionButtons();
  }

}

app.controller('lineupController', LineupController);
