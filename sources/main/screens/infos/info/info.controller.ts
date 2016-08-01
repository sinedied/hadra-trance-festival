import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {FestivalService} from 'web-services/festival/festival.service';
import {InfoPage} from 'web-services/festival/festival.model';

export class InfoController {

  info: InfoPage;

  private logger: ILogger;

  constructor($scope: ng.IScope,
              $stateParams: angular.ui.IStateParamsService,
              festivalService: FestivalService,
              logger: LoggerService) {

    this.logger = logger.getLogger('infoController');
    this.logger.log('init');

    // Init each time, because of view cache
    $scope.$on('$ionicView.beforeEnter', () => {
      let infoId = $stateParams['infoId'];
      this.logger.log('infoId', infoId);

      this.info = festivalService.festival.infos[infoId];
    });
  }

}

app.controller('infoController', InfoController);
