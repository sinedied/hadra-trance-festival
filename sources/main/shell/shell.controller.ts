import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

/**
 * Displays the SPA shell.
 * The shell contains the shared parts of the application: header, footer, navigation...
 */
export class ShellController {

  private logger: ILogger;

  constructor(private $state: ng.ui.IStateService,
              logger: LoggerService) {

    this.logger = logger.getLogger('shell');
    this.logger.log('init');
  }

  /**
   * Checks if the specified name is contained in the current navigation state.
   * @param {string} name The state name to check.
   * @return {boolean} True if the specified name is contained in the current navigation state.
   */
  stateContains(name: string): boolean {
    return _.startsWith(this.$state.current.name, name);
  }

}

app.controller('shellController', ShellController);
