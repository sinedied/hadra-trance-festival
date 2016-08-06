import app from 'main.module';
import {IApplicationConfig} from 'main.constants';
import {ILogger, LoggerService} from 'helpers/logger/logger';

export class AboutController {

  version: string;
  license: string;

  private modal: ionic.modal.IonicModalController;
  private logger: ILogger;

  constructor(private $scope: ng.IScope,
              logger: LoggerService,
              private $ionicModal: ionic.modal.IonicModalService,
              private $cordovaInAppBrowser: any,
              config: IApplicationConfig) {

    this.logger = logger.getLogger('about');
    this.logger.log('init');

    this.version = config.version;
    this.license = <string>require('raw!LICENSE');

    this.modal = $ionicModal.fromTemplate(<string>require('license/license.modal.html'), { scope: this.$scope });

    $scope.$on('$destroy', () => {
      this.modal.remove();
    });
  }

  open(url: string) {
    this.$cordovaInAppBrowser.open(url, '_system');
  }

  showLicense() {
    this.modal.show();
  }

  closeLicense() {
    this.modal.hide();
  }

}

app.controller('aboutController', AboutController);
