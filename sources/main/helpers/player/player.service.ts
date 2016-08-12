import app from 'main.module';
import {LoggerService, ILogger} from 'helpers/logger/logger';

export class PlayerService {

  private context: ng.IScope = null;
  private logger: ILogger;

  constructor(logger: LoggerService) {
    this.logger = logger.getLogger('playerService');
  }

  updateContext(scope: ng.IScope) {
    this.logger.log('Updated player context: ' + scope['track'].title);
    this.context = scope;
  }

  getContext(): ng.IScope {
    return this.context;
  }

}

app.service('playerService', PlayerService);
