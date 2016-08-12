import app from 'main.module';
import {LoggerService, ILogger} from 'helpers/logger/logger';

// TODO: wrapper
declare var MusicControls: any;

export class PlayerService {

  private context: ng.IScope = null;
  private logger: ILogger;

  constructor($rootScope: ng.IRootScopeService,
              logger: LoggerService) {

    this.logger = logger.getLogger('playerService');

    $rootScope.$watch(() => !this.context ? null : [
      this.context['track'].src,
      this.context['player'].playing
    ], () => {
      if (window.MusicControls && this.context['player']) {
        let track = this.context['track'];

        MusicControls.destroy();
        MusicControls.create({
          track: track.title,
//        artist: 'Muse',
          cover: track.artwork_url,
          isPlaying: this.context['player'].playing
          dismissable: true,

          // hide previous/next/close buttons:
          // hasPrev   : false,      // show previous button, optional, default: true
          // hasNext   : false,      // show next button, optional, default: true
          // hasClose  : true,       // show close button, optional, default: false

          // Android only, optional
          // text displayed in the status bar when the notification (and the ticker) are updated
          // ticker    : 'Now playing "Time is Running Out"'
        });

        this.logger.log('Updated player infos');
      }
    }, true);
  }

  updateContext(scope: ng.IScope) {
    this.logger.log('Updated player context: ' + scope['track'].title);
    this.context = scope;
  }

  getContext(): ng.IScope {
    return this.context;
  }

}

app.service('playerService', PlayerService);
