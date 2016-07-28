import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {Artist} from 'web-services/festival/festival.model';
import {FavoritesService} from 'helpers/favorites/favorites.service';

export class ArtistsController {

  showFavorites = false;
  scrollView: ionic.scroll.IonicScrollDelegate;

  private logger: ILogger;

  constructor(private $state: angular.ui.IStateService,
              $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate,
              logger: LoggerService,
              private favoritesService: FavoritesService) {

    this.logger = logger.getLogger('artists');
    this.logger.log('init');

    this.scrollView = $ionicScrollDelegate.$getByHandle('artists-scroll');
  }

  showArtist(id: number) {
    this.$state.go('app.artist', {artistId: id});
  }

  showAll(show: boolean) {
    this.showFavorites = !show;
    this.scrollView.scrollTop(true);
  }

  favoritesFilter() {
    return (artist: Artist) => !this.showFavorites || this.favoritesService.favorites[artist.id];
  };

}

app.controller('artistsController', ArtistsController);
