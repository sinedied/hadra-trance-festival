import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {FestivalService} from 'web-services/festival/festival.service';
import {FavoritesService} from 'helpers/favorites/favorites.service';

/**
 * Notification service: manages local notifications on the device.
 */
export class NotificationService {

  private logger: ILogger;

  constructor($rootScope: ng.IRootScopeService,
              private $cordovaLocalNotification: any,
              logger: LoggerService,
              private festivalService: FestivalService,
              private favoritesService: FavoritesService) {

    this.logger = logger.getLogger('notificationService');

    $rootScope.$on('$cordovaLocalNotification:trigger', this.onTrigger.bind(this));
    $rootScope.$on('$cordovaLocalNotification:click', this.onClick.bind(this));
  }

  updateNotifications() {
    // TODO
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
