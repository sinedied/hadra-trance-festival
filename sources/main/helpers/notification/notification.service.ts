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
    this.$rootScope.$on('$cordovaLocalNotification:trigger', this.onTrigger.bind(this));
  }

  updateNotifications() {
    if (!window.cordova) {
      return;
    }

    this.logger.log('Updating notifications...');

    let festival: Festival = this.festivalService.festival;
    let favorites = this.favoritesService.favorites;

    this.$cordovaLocalNotification
      .getAll()
      .then((notifications: any[]) => {
        console.log(notifications);

        // Clean up already scheduled notifications
        _.each(notifications, (notification: any) => {
          let set = JSON.parse(notification.data);
          let artistId = set.artistId;

          // Check if artist has been deleted from favorites, remove notifications
          let favoriteRemoved = !favorites[artistId];

          // Check if set still exist
          let setRemoved = !_.find(festival.artistById[artistId].sets, {id: set.id});

          if (favoriteRemoved || setRemoved) {
            this.$cordovaLocalNotification.cancel(notification.id);
            this.logger.log('Removed notification ' + notification.id);
          }
        });

        // Add new notifications
        let now = this.moment().subtract(NOTIFY_BEFORE_MIN, 'minutes');

        _.each(favorites, (value: any, id: string) => {
          this.logger.log('Setting up notification for artist' + id);

          _.each(festival.artistById[id].sets, (set: Set) => {
            let notificationExist = _.find(notifications, notification => JSON.parse(notification.data).id === set.id);
            console.log('exist: ' + notificationExist + ' || ' + set.id);

            let inFuture = this.moment(set.start).isAfter(now);
            console.log('inFuture: ' + inFuture + ' || ' + set.start);

            // TODO: custom plugin to enable big notifications
            if (!notificationExist && inFuture) {
              this.$cordovaLocalNotification.schedule({
                id: '' + this.getId(),  // ID needs to be a string convertible to an integer
                // TODO: android icons
                // TODO: test sound
                text: this.gettextCatalog.getString('{{name}} {{type}} set starts in 10 minutes on {{scene}} floor!', {
                  name: set.artist.name,
                  type: set.type,
                  scene: set.scene.name
                }),
                data: Set.getSerializableCopyWithId(set),
                at: this.moment().add(set.artistId, 'minutes').toDate()
                // at: this.moment(set.start).substract(NOTIFY_BEFORE_MIN, 'minutes').toDate(),
                // icon: "http://my.domain.de/avatar/user#id=123"
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
