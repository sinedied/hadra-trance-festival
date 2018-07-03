import app from 'main.module';
import {IServerConfig} from 'helpers/rest/rest.service';

export interface IApplicationConfig {
  version: string;
  environment: IApplicationEnvironment;
  supportedLanguages: Array<string>;
  googleAnalyticsId: string;
  soundCloudClientId: string;
  appStoreUrl: string;
  playStoreUrl: string;
  notificationColor: string;
  androidStatusBarColor: string;
}

export interface IApplicationEnvironment {
  debug: boolean;
  updateUrl: string;
  server: IServerConfig;
}

// Do not remove the comments below, or change the values. It's the markers used by gulp build task to change the
// value of the config constant when building the application, while removing the code below for all environments.
// replace:environment
let environment = {
  local: {
    debug: true,
    updateUrl: 'https://dl.dropboxusercontent.com/s/tvo4qx664kc2fep/update.json?dl=1',
    server: {
      url: '',
      route: 'api'
    }
  },
  dev: {
    debug: true,
    updateUrl: 'https://dl.dropboxusercontent.com/s/tvo4qx664kc2fep/update.json?dl=1',
    server: {
      url: '',
      route: 'api'
    },
  },
  prod: {
    debug: false,
    updateUrl: 'https://dl.dropboxusercontent.com/s/tvo4qx664kc2fep/update.json?dl=1',
    server: {
      url: '',
      route: 'api'
    }
  }
};
// endreplace

/**
 * Defines app-level configuration.
 */
let config: IApplicationConfig = {

  // Do not remove the comments below, or change the values. It's the markers used by gulp build task to inject app
  // version from package.json and environment values.
  // replace:constant
  version: 'dev',
  environment: environment.local,
  // endreplace

  // Supported languages
  supportedLanguages: [
    // 'en_US',
    'fr_FR'
  ],

  // Notification color
  notificationColor: '009EED',

  // $royal -10% luminance
  androidStatusBarColor: '#3A387F',

  appStoreUrl: '1273532150',
  playStoreUrl: 'market://details?id=org.nxcode.htf',

  googleAnalyticsId: 'UA-81709759-1',                     // for dev only, to be replaced
  soundCloudClientId: 'c893b01b1f81d8cecc69fa8594f68d41'  // for dev only, to be replaced

};

app.constant('config', config);
