import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {ToastService} from 'helpers/toast/toast.service';
import {FavoritesService} from 'helpers/favorites/favorites.service';
import {FestivalService} from 'web-services/festival/festival.service';
import {Artist} from 'web-services/festival/festival.model';
import {PlayerService} from 'helpers/player/player.service';

export class ArtistController {

  favorites: Map<string, boolean>;
  artist: Artist;
  noBio: string;

  private logger: ILogger;

  constructor($scope: ng.IScope,
              $stateParams: angular.ui.IStateParamsService,
              private $cordovaInAppBrowser: any,
              private moment: moment.MomentStatic,
              private gettextCatalog: angular.gettext.gettextCatalog,
              logger: LoggerService,
              private festivalService: FestivalService,
              private playerService: PlayerService,
              private favoritesService: FavoritesService,
              private toastService: ToastService) {

    this.logger = logger.getLogger('artist');
    this.logger.log('init');

    this.noBio = gettextCatalog.getString('No bio');
    this.favorites = this.favoritesService.favorites;

    // Init each time, because of view cache
    $scope.$on('$ionicView.beforeEnter', () => {
      let artistId = $stateParams['artistId'];
      this.logger.log('artistId', artistId);

      this.artist = this.festivalService.festival.artistById[artistId];
    });
  }

  switchFavorite() {
    this.favoritesService.toggle(this.artist.id);

    if (this.favorites[this.artist.id]) {
      this.toastService.show(this.gettextCatalog.getString('Added to favorites!<br>You will be notified before its set starts.'));
    }
  }

  formatDate(date: Date): string {
    return date ? this.festivalService.festival.getSetDate(date).format('HH:mm') : '';
  }

  getDay(date: Date): string {
    return date ? this.festivalService.festival.getSetDate(date).format('ddd') : '';
  }

  open(url: string) {
    this.$cordovaInAppBrowser.open(url, '_system');
  }

  updatePlayerContext(scope: ng.IScope) {
    this.playerService.updateContext(scope);
  }

}

app.controller('artistController', ArtistController);
