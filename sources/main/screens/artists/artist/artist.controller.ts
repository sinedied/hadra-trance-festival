import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {ToastService} from 'helpers/toast/toast.service';
import gettextFunction = angular.gettext.gettextFunction;

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

  constructor(private gettext: gettextFunction,
              logger: LoggerService,
              private toastService: ToastService) {

    this.logger = logger.getLogger('artist');
    this.logger.log('init');
  }

  switchFavorite() {
    this.isFavorite = !this.isFavorite;

    if (this.isFavorite) {
      this.toastService.show(this.gettext('Added to favorites!<br>You will be notified when its set starts.'));
    }
  }

}

app.controller('artistController', ArtistController);
