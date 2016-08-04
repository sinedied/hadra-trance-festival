import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {ScrollService} from 'helpers/scroll/scroll.service';
import {FestivalService} from 'web-services/festival/festival.service';
import {Festival, Set, SetType} from 'web-services/festival/festival.model';

export class HomeController {

  animate = false;
  currentScene = 0;
  nowPlaying = {
    artist: <any>{},
    scene: null,
    slot: null
  };

  private festival: Festival;
  private logger: ILogger;
  private timePromise = null;

  constructor(private $cordovaInAppBrowser: any,
              private $state: angular.ui.IStateService,
              private moment: moment.MomentStatic,
              $scope: ng.IScope,
              private $interval: ng.IIntervalService,
              private gettextCatalog: angular.gettext.gettextCatalog,
              logger: LoggerService,
              festivalService: FestivalService,
              scrollService: ScrollService) {

    this.logger = logger.getLogger('home');
    this.logger.log('init');

    this.festival = festivalService.festival;
    this.updateNowPlayingInfos();

    // Trigger pound animation
    let poundPromise = $interval(() => {
      this.animate = !this.animate;
      if (this.animate) {
        this.updateNowPlayingInfos();
      }
    }, 2500);

    $scope.$on('destroy', () => {
      $interval.cancel(poundPromise);
    });

    scrollService.fixXScrollWithHandle('artists-scroll');
    scrollService.fixXScrollWithHandle('photos-scroll');
  }

  showArtist(artistId: string) {
    if (artistId != null) {
      this.$state.go('app.artist', {artistId: artistId});
    }
  }

  open(url: string) {
    this.$cordovaInAppBrowser.open(url, '_system');
  }

  private updateNowPlayingInfos() {
    let playing = this.festival.nowPlaying();
    let currentSet = playing[this.currentScene];

    // Check if festival started
    let startInfo = this.festival.startInfo();

    if (!startInfo.hasStarted) {
      this.nowPlaying.scene = this.gettextCatalog.getString('Festival starts in');

      if (!this.timePromise) {
        this.timePromise = this.$interval(() => {
          // Display time to festival first set
          let diff = moment.duration(startInfo.start.diff(moment()));
          let time = this.gettextCatalog.getString('{{days}}d {{hours}}h {{minutes}}m {{seconds}}s', {
            days: Math.floor(diff.asDays()),
            hours: diff.hours(),
            minutes: diff.minutes(),
            seconds: diff.seconds()
          });
          this.nowPlaying.artist = { name: time };
        }, 500);
      }
      return;
    }

    if (this.timePromise) {
      this.$interval.cancel(this.timePromise);
      this.timePromise = null;
    }

    // Update now playing infos
    this.nowPlaying.scene = this.festival.lineup[this.currentScene].name;

    if (currentSet && currentSet.type !== SetType.BREAK) {
      this.nowPlaying.artist = currentSet.artist;
      this.nowPlaying.slot = this.getFormattedSlot(currentSet);
    } else {
      // Break
      this.nowPlaying.artist = { name: this.gettextCatalog.getString('Break') };
      this.nowPlaying.slot = this.gettextCatalog.getString('Enjoy some silence...');
    }

    this.currentScene = (this.currentScene + 1) % this.festival.lineup.length;
  }

  private getFormattedSlot(set: Set): string {
    return this.moment(set.start).format('HH:mm') + ' - ' + this.moment(set.end).format('HH:mm');
  }

}

app.controller('homeController', HomeController);
