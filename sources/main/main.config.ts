import app from 'main.module';
import {IApplicationConfig} from 'main.constants';
import {ILogger} from 'helpers/logger/logger';

/**
 * Configures the application (before running).
 */
function mainConfig($provide: ng.auto.IProvideService,
                    $analyticsProvider: angulartics.IAnalyticsServiceProvider,
                    $compileProvider: ng.ICompileProvider,
                    config: IApplicationConfig) {

  let env = config.environment;

  // Extend the $exceptionHandler service to output logs.
  $provide.decorator('$exceptionHandler', ($delegate: any, $injector: any) => {
    return (exception: any, cause: any) => {
      $delegate(exception, cause);

      let logger: ILogger = $injector.get('logger').getLogger('exceptionHandler');
      logger.error(exception + (cause ? ' (' + cause + ')' : ''));
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

  // Setup analytics
  if (!env.debug && (<any>window).ga) {
    // TODO: add device UUID for mobile
    // Warning, breaks unit test if included in debug!
    (<any>window).ga('create', env.googleAnalyticsId, 'none');
  }
  $analyticsProvider.developerMode(env.debug);
  $analyticsProvider.firstPageview(true);

}

app.config(mainConfig);

