import app from 'main.module';
import {LoggerService, ILogger} from 'helpers/logger/logger';

const FAVORITES_KEY = 'favorites';

export class FavoritesService {

  favorites: Map<string, boolean> = {};

  private logger: ILogger;

  constructor(private $window: ng.IWindowService,
              logger: LoggerService) {

    this.logger = logger.getLogger('favoritesService');
    this.load();
  }

  add(artistId: string) {
    this.favorites[artistId] = true;
    this.save();
  }

  remove(artistId: string) {
    delete this.favorites[artistId];
    this.save();
  }

  toggle(artistId: string) {
    if (this.favorites[artistId]) {
      this.remove(artistId);
    } else {
      this.add(artistId);
    }
  }

  private save() {
    this.$window.localStorage.setItem(FAVORITES_KEY, angular.toJson(this.favorites));
    this.logger.log('Favorites saved');
  }

  private load() {
    let favorites = angular.fromJson(this.$window.localStorage.getItem(FAVORITES_KEY));

    if (!favorites) {
      favorites = {};
      this.logger.log('No saved favorites!');
    } else {
      this.logger.log('Favorites loaded');
    }

    this.favorites = favorites;
  }

}

app.service('favoritesService', FavoritesService);