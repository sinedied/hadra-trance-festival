'use strict';

/**
 * Settings service: provides methods access user data from local storage.
 */
angular.module('settingsService', [])

  .factory('settingsService', function($window) {

    /*
     * Service public interface
     */

    var service = {};

    /**
     * Sets the value of the specified setting key.
     * @param {!string} key The setting key.
     * @param {?Object} value The setting value, use undefined to remove the setting.
     */
    service.set = function(key, value) {
      if (value !== undefined) {
        $window.localStorage[key] = angular.toJson(value);
      } else {
        $window.localStorage.removeItem(key);
      }
    };

    /**
     * Gets the setting with the specified key.
     * @param {!string} key The setting key.
     * @return {?Object} The setting value if defined, or undefined.
     */
    service.get = function(key) {
      return angular.fromJson($window.localStorage[key]);
    };

    return service;
  });