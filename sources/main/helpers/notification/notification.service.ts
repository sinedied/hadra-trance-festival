import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {FestivalService} from 'web-services/festival/festival.service';
import {Set, Festival} from 'web-services/festival/festival.model';
import {FavoritesService} from 'helpers/favorites/favorites.service';
import {ToastService} from 'toast/toast.service';

const NOTIFY_BEFORE_MIN = 10;  // 10 minutes
const NOTIFICATION_KEY = 'notificationId';

/**
 * Notification service: manages local notifications on the device.
 */
export class NotificationService {

  private id: number;
  private logger: ILogger;

  constructor(private $window: ng.IWindowService,
              private $q: ng.IQService,
              private $rootScope: ng.IRootScopeService,
              private $cordovaLocalNotification: any,
              private gettextCatalog: angular.gettext.gettextCatalog,
              private moment: moment.MomentStatic,
              logger: LoggerService,
              private toastService: ToastService,
              private festivalService: FestivalService,
              private favoritesService: FavoritesService) {

    this.logger = logger.getLogger('notificationService');
    this.id = parseInt($window.localStorage.getItem(NOTIFICATION_KEY) || '0', 10);

    this.$rootScope.$on(FavoritesService.FAVORITES_UPDATED_EVENT, this.updateNotifications.bind(this));
    this.$rootScope.$on(FestivalService.FESTIVAL_UPDATED_EVENT, this.updateNotifications.bind(this));
    this.$rootScope.$on('$cordovaLocalNotification:trigger', this.onTrigger.bind(this));
  }

  updateNotifications() {
    if (!window.cordova) {
      // Mock for browser debugging
      this.$cordovaLocalNotification = {
        getAll: () => this.$q.when([]),
        schedule: angular.noop
      };
    }

    this.logger.log('Updating notifications...');

    let festival: Festival = this.festivalService.festival;
    let favorites = this.favoritesService.favorites;

    this.$cordovaLocalNotification
      .getAll()
      .then((notifications: any[]) => {
        this.logger.log('Queued notifications: ' + notifications.length);

        // Clean up already scheduled notifications
        _.each(notifications, (notification: any) => {
          let set = JSON.parse(notification.data);
          let artistId = set.artistId;

          // Check if artist has been deleted from favorites, remove notifications
          let favoriteRemoved = !favorites[artistId];

          // Check if set still exist
          let artist = festival.artistById[artistId];
          let setRemoved = !artist || !_.find(artist.sets, {id: set.id});

          if (favoriteRemoved || setRemoved) {
            this.$cordovaLocalNotification.cancel(notification.id);
            this.logger.log('Removed notification ' + notification.id);
          }
        });

        // Add new notifications
        let now = this.moment();

        _.each(favorites, (value: any, id: string) => {
          let artist = festival.artistById[id];

          if (!artist) {
            this.logger.warning('No artist found with id: ' + id);
            return;
          }

          _.each(artist.sets, (set: Set) => {
            let notificationExist = _.find(notifications, notification => JSON.parse(notification.data).id === set.id);
            this.logger.log('exist: ' + notificationExist + ' || ' + set.id);

            // Use "real" set date to use setup notification based on device local date
            let setNotificationDate = this.moment(set.start).subtract(NOTIFY_BEFORE_MIN, 'minutes');
            let inFuture = setNotificationDate.isAfter(now);
            this.logger.log('inFuture: ' + inFuture + ' || ' + set.start);

            if (set.start && !notificationExist && inFuture) {
              this.logger.log(`Adding notification for artist: ${id}, set: ${set.start}`);

              this.$cordovaLocalNotification.schedule({
                id: '' + this.getId(),  // ID needs to be a string convertible to an integer
                smallicon: 'res://drawable/ic_notification_hadra',
                icon: 'res://drawable/ic_notification_hadra',
                color: '9C146A',
                led: '9C146A',
                text: this.gettextCatalog.getString('{{name}} {{type}} set starts in 10 minutes on {{scene}} floor!', {
                  name: set.artist.name,
                  type: set.type,
                  scene: set.scene.name
                }),
                data: Set.getSerializableCopyWithId(set),
                at: setNotificationDate.toDate(),
              });

            }
          });
        });

      });
  }

  private getId() {
    let id = this.id++;
    this.$window.localStorage.setItem(NOTIFICATION_KEY, '' + this.id);
    return id;
  }

  private onTrigger(event: any, notification: any) {
    this.logger.log('notification triggered');

    if (this.$rootScope['foreground']) {
      this.toastService.show(notification.text);
    }
  }

}

app.service('notificationService', NotificationService);
