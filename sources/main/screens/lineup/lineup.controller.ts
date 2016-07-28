import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {ToastService} from 'helpers/toast/toast.service';
import {FavoritesService} from 'helpers/favorites/favorites.service';

export class LineupController {

  favorites: Map<string, boolean>;
  floors = [];
  selectedFloor = 0;

  private logger: ILogger;

  constructor(private $ionicListDelegate: ionic.list.IonicListDelegate,
              private moment: moment.MomentStatic,
              logger: LoggerService,
              private gettextCatalog: angular.gettext.gettextCatalog,
              private favoritesService: FavoritesService,
              private toastService: ToastService) {

    this.logger = logger.getLogger('lineup');
    this.logger.log('init');

    this.favorites = this.favoritesService.favorites;

    let lineup = [];
    for (let i = 0; i < 50; ++i) {
      lineup[i] = {
        from: new Date(),
        to: new Date(),
        type: 'DJ',
        artist: {
          id: '0',
          name: 'Shotu vs Driss',
          isFavorite: false
        }
      };
    }

    this.floors = [
      {name: gettextCatalog.getString('Main'), lineup: lineup},
      {name: gettextCatalog.getString('Alternative'), lineup: lineup},
      {name: gettextCatalog.getString('Chillout'), lineup: lineup},
    ];

  }

  selectFloor(index: number) {
    this.selectedFloor = index;
  }

  formatDate(date: Date) {
    return this.moment(date).format('hh:mm');
  }

  switchFavorite(artist: any) {
    this.favoritesService.toggle(artist.id);

    if (this.favorites[artist.id]) {
      this.toastService.show(this.gettextCatalog.getString('Added to favorites!<br>You will be notified when this set starts.'));
    }

    this.$ionicListDelegate.closeOptionButtons();
  }

}

app.controller('lineupController', LineupController);
