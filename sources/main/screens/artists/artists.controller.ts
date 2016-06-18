import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

export class ArtistsController {

  showFavorites = false;
  artists = [
    {
      name: 'Sine Die',
      photo: 'images/home/party1.jpg',
      type: 'Live / DJ'
    },
    {
      name: 'Shoto',
      photo: 'images/home/party2.jpg',
      type: 'Live / DJ'
    },
    {
      name: 'The Green Nuns of the Revolution',
      photo: 'images/home/party3.jpg',
      type: 'Live'
    },
    {
      name: 'Driss',
      photo: 'images/home/party4.jpg',
      type: 'Live'
    }
  ];

  private logger: ILogger;

  constructor(private $state: angular.ui.IStateService,
              logger: LoggerService) {
    this.logger = logger.getLogger('artists');
    this.logger.log('init');

    // Put 80 artists for testing
    let artists = [];
    for (let i = 0; i < 20; ++i) {
      artists = artists.concat(this.artists);
    }
    this.artists = artists;
  }

  showArtist(id: number) {
    this.$state.go('app.artist', {artistId: id});
  }

  showAll(show: boolean) {
    this.showFavorites = !show;
  }

}

app.controller('artistsController', ArtistsController);
