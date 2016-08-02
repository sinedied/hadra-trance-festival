import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {FestivalService} from 'web-services/festival/festival.service';
import {Set, Festival} from 'web-services/festival/festival.model';
import {FavoritesService} from 'helpers/favorites/favorites.service';

const NOTIFIY_BEFORE_MIN = 10;  // 10 minutes

/**
 * Notification service: manages local notifications on the device.
 */
export class NotificationService {

  private logger: ILogger;

  constructor($rootScope: ng.IRootScopeService,
              private $cordovaLocalNotification: any,
              private gettextCatalog: angular.gettext.gettextCatalog,
              private moment: moment.MomentStatic,
              logger: LoggerService,
              private festivalService: FestivalService,
              private favoritesService: FavoritesService) {

    this.logger = logger.getLogger('notificationService');

    $rootScope.$on('$cordovaLocalNotification:trigger', this.onTrigger.bind(this));
    $rootScope.$on('$cordovaLocalNotification:click', this.onClick.bind(this));
  }

  updateNotifications() {
    // TODO: add set ID???
    this.logger.log('Updating notifications...');

    let festival: Festival = this.festivalService.festival;
    let favorites = this.favoritesService.favorites;

    this.$cordovaLocalNotification
      .getScheduledIds()
      .then((notifications: any[]) => {
        console.log(notifications);

        // Clean up already scheduled notifications
        _.each(notifications, (notification: any) => {
          let artistId = notification.data.artistId;

          // Check if artist has been deleted from favorites, remove notifications
          let favoriteRemoved = !favorites[artistId];

          // Check if set still exist
          let setRemoved = !_.find(festival.artistById[artistId].sets, { start: notification.data.start});

          if (favoriteRemoved || setRemoved) {
            this.$cordovaLocalNotification.clear(notification.id);
          }
        });

        // Add new notifications
        let now = this.moment().subtract(NOTIFIY_BEFORE_MIN, 'minutes');

        _.each(favorites, (value: any, id: string) => {
          this.logger.log('setting up notification for artist' + id);

          _.each(festival.artistById[id].sets, (set: Set) => {

            // TODO: replace match by set ID!!!!!
            let notificationExist = _.find(notifications, { data: set });
            console.log('exist: ' + notificationExist + ' || ' + set.start);

            let inFuture = this.moment(set.start).isAfter(now);
            console.log('inFuture: ' + inFuture + ' || ' + set.start);

            if (!notificationExist && inFuture) {
              // TODO: add unique ID, ID needs to be a string convertible to an integer
              this.$cordovaLocalNotification.add({
                autoCancel: true,
                title: this.gettextCatalog.getString('{{name}} {{type}} set', {
                  name: set.artist.name,
                  type: set.type
                }),
                message: this.gettextCatalog.getString('starts in 10 minutes on {{scene}} floor!', {scene: set.scene.name}),
                data: Set.getSerializableCopy(set)
                // at: this.moment(set.start).substract(NOTIFIY_BEFORE_MIN, 'minutes').toDate(),
                // sound: "file://sounds/message.mp3",
                // icon: "http://my.domain.de/avatar/user#id=123"
              });

            }
          });
        });

      });
  }

  private onTrigger(event: any, notification: any, state: any) {
    console.log('notification triggered');
    console.log(event);
    console.log(notification);
    console.log(state);
  }

  private onClick(event: any, notification: any, state: any) {
    console.log('notification clicked');
    console.log(event);
    console.log(notification);
    console.log(state);
//    this.$cordovaLocalNotification.cancel(notification.id);
  }

}

app.service('notificationService', NotificationService);
