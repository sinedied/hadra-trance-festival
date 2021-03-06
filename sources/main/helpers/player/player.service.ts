import app from 'main.module';
import {LoggerService, ILogger} from 'helpers/logger/logger';

export class PlayerService {

  private context: any = null;
  private logger: ILogger;
  private dismissed: boolean = false;

  constructor($rootScope: ng.IRootScopeService,
              $window: ng.IWindowService,
              logger: LoggerService) {

    this.logger = logger.getLogger('playerService');

    let musicControls = $window['MusicControls'];

    $rootScope.$watch(() => !this.context ? null : [
      this.context.track.src,
      this.context.player.playing
    ], () => {
      if (this.context && this.context.player) {
        let track = this.context.track;
        let cover = track.artwork_url ? track.artwork_url.replace('large.jpg', 't500x500.jpg') : null;

        if (musicControls) {
          if (this.dismissed) {
            this.dismissed = false;
            return;
          }

          musicControls.create({
            track: track.title,
            artist: track.user.username,
            cover: cover,
            isPlaying: !!this.context.player.playing,
            dismissable: true,
            notificationIcon: 'ic_notification_hadra'
          });
          musicControls.subscribe(this.eventHandler.bind(this));
          musicControls.listen();
        }

        this.logger.log('Updated player infos');
      }
    }, true);
  }

  updateContext(context: any) {
    this.logger.log('Updated player context: ' + context.track.title);
    this.context = context;
  }

  getContext(): any {
    return this.context;
  }

  eventHandler(action: any) {
    action = JSON.parse(action);
    action = action.message ? action.message : action;
    this.logger.log('New player control event: ' + action);

    if (!this.context) {
      this.logger.log('No context!');
      return;
    }

    switch (action) {
      case 'music-controls-next':
        this.context.next();
        break;
      case 'music-controls-previous':
        this.context.previous();
        break;
      case 'music-controls-pause':
        this.context.pause();
        break;
      case 'music-controls-play':
        this.context.play();
        break;
      case 'music-controls-destroy':
        this.dismissed = true;
        this.context.pause();
        break;
      // Headset events (Android only)
      case 'music-controls-headset-unplugged':
        this.context.pause();
        break;
      // (iOS only)
      case 'music-controls-toggle-play-pause':
        if (!!this.context.player.playing) {
          this.context.pause();
        } else {
          this.context.play();
        }
        break;
      default:
        break;
    }
  }

}

app.service('playerService', PlayerService);
