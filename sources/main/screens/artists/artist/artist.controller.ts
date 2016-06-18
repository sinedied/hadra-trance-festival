import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

export class ArtistController {

  isFavorite = false;
  artist = {
    name: 'Shotu vs Driss',
    label: 'Hadra Records',
    country: 'fr',
    photo: 'images/home/party2.jpg',
    background: 'images/home/party1.jpg',
    bio: ''
  };

  private logger: ILogger;

  constructor(logger: LoggerService) {
    this.logger = logger.getLogger('artist');
    this.logger.log('init');
  }

  switchFavorite() {
    this.isFavorite = !this.isFavorite;
  }

}

app.controller('artistController', ArtistController);
