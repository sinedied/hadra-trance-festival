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
    updateUrl: 'https://dl.dropboxusercontent.com/u/1119242/updates/htf2016/update.json?dl=1',
    server: {
      url: '',
      route: 'api'
    }
  },
  dev: {
    debug: true,
    updateUrl: 'https://dl.dropboxusercontent.com/u/1119242/updates/htf2016/update.json?dl=1',
    server: {
      url: '',
      route: 'api'
    },
  },
  prod: {
    debug: false,
    updateUrl: 'https://dl.dropboxusercontent.com/u/1119242/updates/htf2016/update.json?dl=1',
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
  notificationColor: '007f8c',

  // TODO: update URLs
  appStoreUrl: '1143449911',
  playStoreUrl: 'market://details?id=org.nxcode.htf2016',

  googleAnalyticsId: 'UA-81709759-1',                     // for dev only, to be replaced
  soundCloudClientId: 'c893b01b1f81d8cecc69fa8594f68d41'  // for dev only, to be replaced

};

app.constant('config', config);
