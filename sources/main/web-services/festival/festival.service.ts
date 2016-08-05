import app from 'main.module';
import {Festival} from 'festival.model';
import {IApplicationConfig} from 'main.constants';
import {LoggerService, ILogger} from 'helpers/logger/logger';

// const FESTIVAL_KEY = 'festivalData';

export class FestivalService {

  festival = null;

  private logger: ILogger;

  constructor(private $http: ng.IHttpService,
              private config: IApplicationConfig,
              logger: LoggerService) {

    this.logger = logger.getLogger('festivalService');
  }

  loadFestival(): Festival {
    // TODO: save/load from localStorage + update from network and reload + error management
    let f = new Festival();
    angular.extend(f, JSON.parse(<string>require('static/data.json')));
    f.processData();
    this.festival = f;

    // Check for newer version to download
    this.checkUpdate();

    return this.festival;
  }

  checkUpdate() {
    this.$http
      .get(this.config.environment.updateUrl)
      .then((response: any) => {
        let update = angular.fromJson(response.data);

        if (update.version > this.festival.version) {
          this.logger.log('Newer data version available!');
          this.startUpdate(update.url);
        } else {
          this.logger.log('No newer data version available');
        }
      });
  }

  private startUpdate(url: string) {

  }

}

app.service('festivalService', FestivalService);
