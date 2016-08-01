import app from 'main.module';
import {IServerConfig} from 'helpers/rest/rest.service';

export interface IApplicationConfig {
  version: string;
  environment: IApplicationEnvironment;
  supportedLanguages: Array<string>;
  soundCloudClientId: string;
}

export interface IApplicationEnvironment {
  debug: boolean;
  server: IServerConfig;
  googleAnalyticsId: string;
}

// Do not remove the comments below, or change the values. It's the markers used by gulp build task to change the
// value of the config constant when building the application, while removing the code below for all environments.
// replace:environment
let environment = {
  local: {
    debug: true,

    // REST backend configuration, used for all web services using restService
    server: {
      url: '',
      route: 'api'
    },
    googleAnalyticsId: 'UA-81709759-1',
  },
  dev: {
    debug: true,
    server: {
      url: 'http://api.icndb.com',
      route: ''
    },
    googleAnalyticsId: 'UA-81709759-1'
  },
  prod: {
    debug: false,
    server: {
      url: 'http://api.icndb.com',
      route: ''
    },
    googleAnalyticsId: 'UA-81709759-1'
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
    // 'en-US',
    'fr-FR'
  ],

  soundCloudClientId: 'c893b01b1f81d8cecc69fa8594f68d41'

};

app.constant('config', config);
