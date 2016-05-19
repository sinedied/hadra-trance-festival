'use strict';

/**
 * UUID service: provides methods to generate universally unique IDs.
 */
angular.module('uuidService', []).factory('uuidService', function () {

  /*
   * Service public interface
   */

  var service = {};

  /**
   * Generates an UUID.
   * The generated UUID is compliant with RFC4122 version 4.
   * @return {string} An UUID.
   */
  service.getUUID = function() {
    /* jshint bitwise: false */
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    /* jshint bitwise: true */
  };

  return service;
});