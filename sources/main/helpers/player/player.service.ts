import app from 'main.module';
import {LoggerService, ILogger} from 'helpers/logger/logger';

export class PlayerService {

  private context: any = null;
  private logger: ILogger;
  private handlerInit: boolean = false;

  constructor($rootScope: ng.IRootScopeService,
              $window: ng.IWindowService,
              logger: LoggerService) {

    this.logger = logger.getLogger('playerService');

    let musicControls = $window['MusicControls'];
    let remoteControls = $window['remoteControls'];

    $rootScope.$watch(() => !this.context ? null : [
      this.context.track.src,
      this.context.player.playing
    ], () => {
      if (this.context && this.context.player) {
        let track = this.context.track;
        let cover = track.artwork_url ? track.artwork_url.replace('large.jpg', 't500x500.jpg') : null;

        if (ionic.Platform.isAndroid() && musicControls) {
          musicControls.destroy();
          musicControls.create({
            track: track.title,
            artist: track.user.username,
            cover: cover,
            isPlaying: this.context.player.playing,
            dismissable: true,

            // hide previous/next/close buttons:
            // hasPrev   : false,      // show previous button, optional, default: true
            // hasNext   : false,      // show next button, optional, default: true
            // hasClose  : true,       // show close button, optional, default: false

            // Android only, optional
            // text displayed in the status bar when the notification (and the ticker) are updated
            ticker: this.context.player.playing ? 'Lecture de ' + track.title : null
          });
          musicControls.subscribe(this.eventHandler.bind(this));
        }

        if (ionic.Platform.isIOS() && remoteControls) {
          remoteControls.updateMetas(() => {}, () => {}, [
            track.user.username,
            track.title,
            '', // album
            cover || '',
            0, // duration
            0, // elapsed
            !!this.context.player.playing
          ]);

          if (!this.handlerInit) {
            this.handlerInit = true;
            $window.document.addEventListener('remote-event', this.iosEventHandler.bind(this));
          }
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

  iosEventHandler(event: any) {
    if (!this.context) {
      return;
    }

    let action = event.remoteEvent.subtype;
    this.logger.log('New player control event: ' + action);

    switch (action) {
      case 'play':
        this.context.play();
        break;
      case 'pause':
        this.context.pause();
        break;
      case 'nextTrack':
        this.context.next();
        break;
      case 'prevTrack':
        this.context.previous();
        break;
      default:
        break;
    }
  }

  eventHandler(action: string) {
    this.logger.log('New player control event: ' + action);

    if (!this.context) {
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
        this.context.pause();
        break;
      // Headset events (Android only)
      case 'music-controls-headset-unplugged':
        this.context.pause();
        break;
      default:
        break;
    }
  }

}

app.service('playerService', PlayerService);
