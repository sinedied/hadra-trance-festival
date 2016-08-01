import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {ToastService} from 'helpers/toast/toast.service';
import {FavoritesService} from 'helpers/favorites/favorites.service';
import {FestivalService} from 'web-services/festival/festival.service';
import {Artist} from 'web-services/festival/festival.model';

export class ArtistController {

  favorites: Map<string, boolean>;
  artist: Artist;

  private logger: ILogger;

  constructor($scope: ng.IScope,
              $stateParams: angular.ui.IStateParamsService,
              private $cordovaInAppBrowser: any,
              private moment: moment.MomentStatic,
              private gettextCatalog: angular.gettext.gettextCatalog,
              logger: LoggerService,
              festivalService: FestivalService,
              private favoritesService: FavoritesService,
              private toastService: ToastService) {

    this.logger = logger.getLogger('artist');
    this.logger.log('init');

    this.favorites = this.favoritesService.favorites;

    // Init each time, because of view cache
    $scope.$on('$ionicView.beforeEnter', () => {
      let artistId = $stateParams['artistId'];
      this.logger.log('artistId', artistId);

      this.artist = festivalService.festival.artistById[artistId];
    });
  }

  switchFavorite() {
    this.favoritesService.toggle(this.artist.id);

    if (this.favorites[this.artist.id]) {
      this.toastService.show(this.gettextCatalog.getString('Added to favorites!<br>You will be notified when its set starts.'));
    }
  }

  formatDate(date: Date) {
    return this.moment(date).format('hh:mm');
  }

  open(url: string) {
    this.$cordovaInAppBrowser.open(url, '_system');
  }

}

app.controller('artistController', ArtistController);
