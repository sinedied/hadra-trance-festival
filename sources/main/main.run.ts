import app from 'main.module';
import {IApplicationConfig} from 'main.constants';
import {RestService} from 'helpers/rest/rest.service';
import {ILogger, LoggerService} from 'helpers/logger/logger';

/**
 * Entry point of the application.
 * Initializes application and root controller.
 */
function main($window: ng.IWindowService,
              $locale: ng.ILocaleService,
              $rootScope: any,
              $state: angular.ui.IStateService,
              $timeout: ng.ITimeoutService,
              $cordovaKeyboard: any,
              $cordovaStatusbar: any,
              $ionicPlatform: ionic.platform.IonicPlatformService,
              gettextCatalog: angular.gettext.gettextCatalog,
              _: _.LoDashStatic,
              config: IApplicationConfig,
              logger: LoggerService,
              restService: RestService) {

  /*
   * Root view model
   */

  let vm = $rootScope;

  vm.pageTitle = '';
  vm.viewTitle = '';

  /**
   * Utility method to set the language in the tools requiring it.
   * The current language is saved to the local storage.
   * If no parameter is specified, the language is loaded from local storage (if possible).
   * @param {string=} language The IETF language tag.
   */
  vm.setLanguage = function(language?: string) {
    language = language || $window.localStorage.getItem('language');
    let isSupportedLanguage = _.includes(config.supportedLanguages, language);

    // If no exact match is found, search without the region
    if (!isSupportedLanguage && language) {
      let languagePart = language.split('-')[0];
      language = _.find(config.supportedLanguages,
        (supportedLanguage: string) => _.startsWith(supportedLanguage, languagePart));
      isSupportedLanguage = !!language;
    }

    // Fallback if language is not supported
    if (!isSupportedLanguage) {
      language = 'en-US';
    }

    // Configure translation with gettext
    gettextCatalog.setCurrentLanguage(language);
    $locale.id = language;
    $window.localStorage.setItem('language', language);
  };

  /**
   * Updates title on view change.
   */
  vm.$on('$stateChangeSuccess', (event: any, toState: angular.ui.IState) => {
    updateTitle(toState.data ? toState.data.title : null);
  });

  /**
   * Updates title on language change.
   */
  vm.$on('gettextLanguageChanged', () => {
    updateTitle($state.current.data ? $state.current.data.title : null);
  });

  init();

  /*
   * Internal
   */

  /**
   * Initializes the root controller.
   */
  function init() {
    let _logger: ILogger = logger.getLogger('main');
    // Enable debug mode for translations
    gettextCatalog.debug = config.environment.debug;
    gettextCatalog.debugPrefix = 'T_';

    vm.setLanguage();

    // Set REST server configuration
    restService.setServer(config.environment.server);

    // Cordova platform and plugins init
    $ionicPlatform.ready(() => {

      // Hide splash screen
      let splashScreen = $window.navigator.splashscreen;
      if (splashScreen) {
        $timeout(() => {
          splashScreen.hide();
        }, 3000);
      }

      // Detect and set default language
      let globalization = $window.navigator.globalization;
      if (globalization) {
        // Use cordova plugin to retrieve device's locale
        globalization.getPreferredLanguage((language) => {
          _logger.log('Setting device locale "' + language.value + '" as default language');
          vm.$apply(() => {
            vm.setLanguage(language.value);
          });
        }, null);
      }


      if ($window.cordova) {

        if ($window.cordova.plugins.Keyboard) {
          $cordovaKeyboard.disableScroll(true);
        }

        // Set status bar color on Android ($royal -10% luminance)
        if (ionic.Platform.isAndroid()) {
          $cordovaStatusbar.styleHex('#360222');
        }

        window.open = (<any>$window.cordova).InAppBrowser.open;
      }

    });
  }

  /**
   * Updates the title.
   * @param {?string=} stateTitle Title of current state, to be translated.
   */
  function updateTitle(stateTitle?: string) {
    vm.pageTitle = gettextCatalog.getString('APP_NAME');

    if (stateTitle) {
      vm.viewTitle = gettextCatalog.getString(stateTitle);
      vm.pageTitle += ' | ' + vm.viewTitle;
    }
  }

}

app.run(main);
