'use strict';

/**
 * String service: provides methods to format strings.
 */
angular.module('stringService', ['gettext'])

  .factory('stringService', function(gettextCatalog) {

    /*
     * Service public interface
     */

    var service = {};

    /**
     * Formats the specified string.
     * If a translation key is found (string starting with 'T_'), it will be translated before formatting.
     * Same for format arguments, if a translation key is found it will be translated before injection.
     * @param {!string} string The string to format.
     * @param {...|Array} args Arguments to format the string with, can either a variable number of arguments or an array containing the arguments.
     * @return {string} The formatted string.
     */
    service.format = function(string) {
      var stringToFormat = string;

      // Translate string if needed
      if (stringToFormat.indexOf('T_') === 0) {
        stringToFormat = gettextCatalog.getString(stringToFormat);
      }

      var args = Array.prototype.slice.call(arguments, 1);

      // If there is a single array as format argument, expand it
      if (Array.isArray(args[0]) && args.length === 1) {
        Array.prototype.push.apply(args, args[0]);
        args.shift();
      }

      return stringToFormat.replace(/{(\d+)}/g, function(match, index) {
        var replacementString = args[index];
        if (angular.isString(replacementString) && replacementString.indexOf('T_') === 0) {
          replacementString = gettextCatalog.getString(replacementString);
        }
        return replacementString !== undefined ? replacementString : match;
      });

    };

    /**
     * Checks if a string or array of strings contains the specified search string.
     * The comparison is not case sensitive.
     * @param {string|Array.<string>} stringOrArray A string or array of strings to check.
     * @param {?string} search The string to search for. If null or empty, matches everything.
     * @return {boolean} True if the specified search string matches.
     */
    service.contains = function(stringOrArray, search) {
      search = search ? search.toLowerCase() : null;

      if (typeof stringOrArray === 'string' || !stringOrArray) {
        stringOrArray = [stringOrArray];
      }

      for (var i = 0, len = stringOrArray.length; i < len; ++i) {
        if (typeof stringOrArray[i] === 'string' && (!search || stringOrArray[i].toLocaleLowerCase().indexOf(search) > -1)) {
          return true;
        }
      }

      return false;
    };

    return service;
  });
