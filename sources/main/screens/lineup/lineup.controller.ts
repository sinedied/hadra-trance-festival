import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {ToastService} from 'helpers/toast/toast.service';
import {FavoritesService} from 'helpers/favorites/favorites.service';
import {FestivalService} from 'web-services/festival/festival.service';
import {Set, SetType} from 'web-services/festival/festival.model';

export class LineupController {

  favorites: Map<string, boolean>;
  selectedScene = 0;
  hasStarted = false;
  playing = [];
  breakTime: string;

  private festival;
  private logger: ILogger;

  constructor(private $location: ng.ILocationService,
              private $state: angular.ui.IStateService,
              private $ionicListDelegate: ionic.list.IonicListDelegate,
              private $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate,
              $scope: ng.IScope,
              private $interval: ng.IIntervalService,
              private moment: moment.MomentStatic,
              logger: LoggerService,
              private gettextCatalog: angular.gettext.gettextCatalog,
              private favoritesService: FavoritesService,
              private festivalService: FestivalService,
              private toastService: ToastService) {

    this.logger = logger.getLogger('lineup');
    this.logger.log('init');

    this.breakTime = this.gettextCatalog.getString('Break');
    this.favorites = this.favoritesService.favorites;

    // Update now playing infos
    let updatePromise = null;

    $scope.$on('$ionicView.beforeEnter', () => {
      this.festival = this.festivalService.festival;
      this.updatePlaying();
      updatePromise = $interval(this.updatePlaying.bind(this), 5000);
    });

    $scope.$on('$ionicView.afterLeave', () => {
      $interval.cancel(updatePromise);
    });

    $scope.$on('destroy', () => {
      $interval.cancel(updatePromise);
    });
  }

  selectFloor(index: number) {
    this.$ionicScrollDelegate.$getByHandle('lineupScroll').scrollTop();
    this.selectedScene = index;
  }

  formatDate(date: Date): string {
    return this.festivalService.festival.getSetDate(date).format('HH:mm');
  }

  getWeekday(weekday: number): string {
    // Need to cast to any as typing is outdated
    return (<any>this.moment).weekdays(true, weekday);
  }

  switchFavorite(artist: any) {
    this.favoritesService.toggle(artist.id);

    if (this.favorites[artist.id]) {
      this.toastService.show(this.gettextCatalog.getString('Added to favorites!<br>You will be notified before this set starts.'));
    }

    this.$ionicListDelegate.closeOptionButtons();
  }

  showArtist(set: Set) {
    if (set.type !== SetType.BREAK && set.artistId != null) {
      this.$ionicListDelegate.closeOptionButtons();
      this.$state.go('app.artist', {artistId: set.artistId});
    }
  }

  showPlaying() {
    let currentSet = this.playing[this.selectedScene];
    if (currentSet) {
      this.$location.hash(currentSet.id);
      this.$ionicScrollDelegate.$getByHandle('lineupScroll').anchorScroll(true);
    }
  }

  private updatePlaying() {
    this.hasStarted = this.festival.startInfo().hasStarted;
    this.playing = this.festival.nowPlaying();
  }

}

app.controller('lineupController', LineupController);
