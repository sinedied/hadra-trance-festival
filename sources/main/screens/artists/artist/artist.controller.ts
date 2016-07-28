import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {ToastService} from 'helpers/toast/toast.service';
import {FavoritesService} from 'helpers/favorites/favorites.service';

export class ArtistController {

  favorites: Map<string, boolean>;
  artist = {
    id: '0',
    name: 'Shotu vs Driss',
    label: 'Hadra Records',
    country: 'fr',
    photo: 'images/home/party2.jpg',
    background: 'images/home/party1.jpg',
    bio: ''
  };

  private logger: ILogger;

  constructor(private gettextCatalog: angular.gettext.gettextCatalog,
              logger: LoggerService,
              private favoritesService: FavoritesService,
              private toastService: ToastService) {

    this.logger = logger.getLogger('artist');
    this.logger.log('init');

    this.favorites = this.favoritesService.favorites;
  }

  switchFavorite() {
    this.favoritesService.toggle(this.artist.id);

    if (this.favorites[this.artist.id]) {
      this.toastService.show(this.gettextCatalog.getString('Added to favorites!<br>You will be notified when its set starts.'));
    }
  }

}

app.controller('artistController', ArtistController);
