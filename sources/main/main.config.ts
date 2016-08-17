import app from 'main.module';
import {IApplicationConfig} from 'main.constants';
import {ILogger} from 'helpers/logger/logger';

/**
 * Configures the application (before running).
 */
function mainConfig($provide: ng.auto.IProvideService,
                    $analyticsProvider: angulartics.IAnalyticsServiceProvider,
                    $compileProvider: ng.ICompileProvider,
                    plangularConfigProvider: any,
                    markedProvider: any,
                    config: IApplicationConfig) {

  let env = config.environment;

  // Extend the $exceptionHandler service to output logs.
  $provide.decorator('$exceptionHandler', ($delegate: any, $injector: any) => {
    return (exception: any, cause: any) => {
      $delegate(exception, cause);

      let logger: ILogger = $injector.get('logger').getLogger('exceptionHandler');
      let $analytics: angulartics.IAnalyticsService = $injector.get('$analytics');
      let message: string = exception + (cause ? ' (' + cause + ')' : '');

      logger.error(message);
      $analytics.eventTrack('Exception', { category: 'error', value: message });
    };
  });

  // Disable debug logs in production version
  $provide.decorator('$log', ($delegate: any) => {
    if (!env.debug) {
      $delegate.log = angular.noop;
      $delegate.debug = angular.noop;
    }
    return $delegate;
  });

  // Disable angular debug info in production version
  $compileProvider.debugInfoEnabled(env.debug);

  $analyticsProvider.developerMode(env.debug);
  $analyticsProvider.firstPageview(true);

  // Set Soundcloud client ID
  plangularConfigProvider.clientId = config.soundCloudClientId;

  // Customize markdown compilation
  markedProvider.setRenderer({
    link: (href, title, text) => {
      let isExternal = href.indexOf('http') === 0;
      return '<a ' + (isExternal ? 'ng-click="vm.open(\'' + href + '\')"' : 'href="' + href + '"') +
        (title ? ' title="' + title + '"' : '') + '>' + text + '</a>';
    }
  });

}

app.config(mainConfig);

