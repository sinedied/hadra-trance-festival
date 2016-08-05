import app from 'main.module';
import {Festival} from 'festival.model';
import {IApplicationConfig} from 'main.constants';
import {LoggerService, ILogger} from 'helpers/logger/logger';

const FESTIVAL_KEY = 'festivalData';

export class FestivalService {

  static FESTIVAL_UPDATED_EVENT = 'festival:updated';

  festival = null;

  private logger: ILogger;

  constructor(private $rootScope: ng.IRootScopeService,
              private $window: ng.IWindowService,
              private $http: ng.IHttpService,
              private config: IApplicationConfig,
              logger: LoggerService) {

    this.logger = logger.getLogger('festivalService');
  }

  loadFestival(): Festival {
    let updatedData = angular.fromJson(this.$window.localStorage.getItem(FESTIVAL_KEY));

    let f = new Festival();
    angular.extend(f, updatedData || angular.fromJson(<string>require('static/data.json')));
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
          this.startUpdate(update.version, update.url);
        } else {
          this.logger.log('No newer data version available');
        }
      });
  }

  private startUpdate(version: number, url: string) {
    this.logger.log('Starting data update...');
    this.$http
      .get(url)
      .then((response: any) => {
        if (response.data && response.data.artists) {
          this.logger.log('Updated data downloaded');
          let data = angular.fromJson(response.data);
          data.version = version;

          this.$window.localStorage.setItem(FESTIVAL_KEY, angular.toJson(data));
          this.logger.log('Updated data saved');

          // Reload data
          let f = new Festival();
          angular.extend(f, data);
          f.processData();
          this.festival = f;
          this.$rootScope['festival'] = this.festival;
          this.$rootScope.$emit(FestivalService.FESTIVAL_UPDATED_EVENT);
          this.logger.log('Festival data reloaded');
        } else {
          this.logger.log('Bad update data!');
        }
      });
  }

}

app.service('festivalService', FestivalService);
