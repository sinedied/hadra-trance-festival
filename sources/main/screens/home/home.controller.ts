import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {ScrollService} from 'helpers/scroll/scroll.service';
import {FestivalService} from 'web-services/festival/festival.service';
import {Festival, Set, SetType} from 'web-services/festival/festival.model';

export class HomeController {

  animate = false;
  currentScene = 0;
  nowPlaying = {
    artistId: null,
    name: null,
    scene: null,
    slot: null
  };

  private festival: Festival;
  private logger: ILogger;
  private timePromise = null;
  private poundPromise = null;

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

    scrollService.fixXScrollWithHandle('artists-scroll');
    scrollService.fixXScrollWithHandle('photos-scroll');

    // Trigger pound animation
    $scope.$on('$ionicView.beforeEnter', () => {
      this.festival = festivalService.festival;
      this.updateNowPlayingInfos();
      this.resetAnimation();
    });

    $scope.$on('$ionicView.afterLeave', () => {
      $interval.cancel(this.poundPromise);

      if (this.timePromise) {
        this.$interval.cancel(this.timePromise);
        this.timePromise = null;
      }
    });

    $scope.$on('destroy', () => {
      $interval.cancel(this.poundPromise);

      if (this.timePromise) {
        this.$interval.cancel(this.timePromise);
        this.timePromise = null;
      }
    });
  }

  showArtist(artistId: string) {
    if (artistId != null) {
      this.$state.go('app.artist', {artistId: artistId});
    }
  }

  open(url: string) {
    this.$cordovaInAppBrowser.open(url, '_system');
  }

  nextScene(event: any) {
    event.preventDefault();
    this.updateNowPlayingInfos();
    this.resetAnimation();
  }

  private resetAnimation() {
    if (this.poundPromise) {
      this.$interval.cancel(this.poundPromise);
    }
    this.poundPromise = this.$interval(() => {
      this.animate = !this.animate;
      if (this.animate) {
        this.updateNowPlayingInfos();
      }
    }, 2500);
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
          let diff = moment.duration(startInfo.start.diff(this.moment()));
          let time = this.gettextCatalog.getString('{{days}}d {{hours}}h {{minutes}}m {{seconds}}s', {
            days: Math.floor(diff.asDays()),
            hours: diff.hours(),
            minutes: diff.minutes(),
            seconds: diff.seconds()
          });
          this.nowPlaying.name = time;
          this.nowPlaying.slot = null;
          this.nowPlaying.artistId = null;
        }, 500);
      }
      return;
    }

    if (this.timePromise) {
      this.$interval.cancel(this.timePromise);
      this.timePromise = null;
    }

    // Update now playing infos
    let currentLineup = this.festival.lineup[this.currentScene];
    this.nowPlaying.scene = currentLineup.name;

    if (currentSet && currentSet.type !== SetType.BREAK) {
      this.nowPlaying.name = currentSet.artist.name;
      this.nowPlaying.artistId = currentSet.artist.id;

      // Check for versus sets
      let setIndex = _.indexOf(currentLineup.sets, currentSet);
      let nextSet = setIndex !== -1 ? currentLineup.sets[setIndex + 1] : null;

      if (nextSet && nextSet.versus) {
        this.nowPlaying.name += ' ' + this.gettextCatalog.getString('vs') + ' ' + nextSet.artist.name;
      }

      this.nowPlaying.slot = this.getFormattedSlot(currentSet);
    } else {
      // Break
      this.nowPlaying.name = this.gettextCatalog.getString('Break');
      this.nowPlaying.artistId = null;
      this.nowPlaying.slot = this.gettextCatalog.getString('Enjoy some silence...');
    }

    this.currentScene = (this.currentScene + 1) % this.festival.lineup.length;
  }

  private getFormattedSlot(set: Set): string {
    return this.festival.getSetDate(set.start).format('HH:mm') + ' - ' +
      this.festival.getSetDate(set.end).format('HH:mm');
  }

}

app.controller('homeController', HomeController);
