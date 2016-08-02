import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {FestivalService} from 'web-services/festival/festival.service';
import {Set} from 'web-services/festival/festival.model';
import {FavoritesService} from 'helpers/favorites/favorites.service';

/**
 * Notification service: manages local notifications on the device.
 */
export class NotificationService {

  private logger: ILogger;

  constructor($rootScope: ng.IRootScopeService,
              private $cordovaLocalNotification: any,
              private gettextCatalog: angular.gettext.gettextCatalog,
              logger: LoggerService,
              private festivalService: FestivalService,
              private favoritesService: FavoritesService) {

    this.logger = logger.getLogger('notificationService');

    $rootScope.$on('$cordovaLocalNotification:trigger', this.onTrigger.bind(this));
    $rootScope.$on('$cordovaLocalNotification:click', this.onClick.bind(this));
  }

  updateNotifications() {
    let festival = this.festivalService.festival;

    // TODO: list existing notifications artists to remove

    _.each(this.favoritesService.favorites, (value: any, id: string) => {
      this.logger.log('setting up notification for artist' + id);

      _.each(festival.artistById[id].sets, (set: Set) => {

        // TODO: check if date is > now
        // TODO: check if exists, else update
        this.$cordovaLocalNotification.schedule({
          id: set.artist.id + '_' + set.start,
          title: this.gettextCatalog.getString('{name} {type} set', {
            name: set.artist.name,
            type: set.type
          }),
          message: 'starts in 10 minutes!'
          // at: new Date(),
          // sound: "file://sounds/message.mp3",
          // icon: "http://my.domain.de/avatar/user#id=123"
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
    this.$cordovaLocalNotification.clear(notification.id);
  }

}

app.service('notificationService', NotificationService);
