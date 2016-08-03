import app from 'main.module';
import {IApplicationConfig} from 'main.constants';
import {RestService} from 'helpers/rest/rest.service';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {FestivalService} from 'web-services/festival/festival.service';
import {NotificationService} from 'helpers/notification/notification.service';

/**
 * Entry point of the application.
 * Initializes application and root controller.
 */
function main($window: ng.IWindowService,
              $locale: ng.ILocaleService,
              $ionicLoading: ionic.loading.IonicLoadingService,
              $rootScope: any,
              $state: angular.ui.IStateService,
              $timeout: ng.ITimeoutService,
              $cordovaKeyboard: any,
              $cordovaStatusbar: any,
              $ionicPlatform: ionic.platform.IonicPlatformService,
              gettextCatalog: angular.gettext.gettextCatalog,
              _: _.LoDashStatic,
              config: IApplicationConfig,
              festivalService: FestivalService,
              notificationService: NotificationService,
              logger: LoggerService,
              restService: RestService) {

  let _logger: ILogger = logger.getLogger('main');

  /*
   * Root view model
   */

  let vm = $rootScope;

  vm.pageTitle = '';
  vm.viewTitle = '';
  vm.festival = null;
  vm.offline = false;
  vm.foreground = true;

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
      language = 'fr-FR';
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
    // Enable debug mode for translations
    gettextCatalog.debug = config.environment.debug;
    gettextCatalog.debugPrefix = 'T_';

    vm.setLanguage();

    // Set REST server configuration
    restService.setServer(config.environment.server);

    // Load festival data
    vm.festival = festivalService.loadFestival();

    // Cordova platform and plugins init
    $ionicPlatform.ready(() => {

      // Updaye notifications
      notificationService.updateNotifications();

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

        /*
         * App lifecycle hooks
         */

        // App goes to background
        $window.document.addEventListener('pause', () => {
          _logger.log('Application paused in background');
          vm.foreground = false;

          vm.$emit('applicationPause');
          vm.$apply();
        }, false);

        // App resume from background
        $window.document.addEventListener('resume', () => {
          _logger.log('Application resumed from background');
          $rootScope.foreground = true;

          vm.$emit('applicationResume');
          vm.$apply();
        }, false);

        // App online
        $window.document.addEventListener('online', () => {
          if ($rootScope.offline) {
            _logger.log('Application online');
            vm.offline = false;

            if (vm.foreground) {
              vm.$emit('applicationOnline');
            }

            vm.$apply();
          }
        }, false);

        // App offline
        $window.document.addEventListener('offline', () => {
          if (!vm.offline) {
            _logger.log('Application offline');
            vm.offline = true;

            if (vm.foreground) {
              vm.$emit('applicationOffline');
            }

            vm.$apply();
          }
        }, false);

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
