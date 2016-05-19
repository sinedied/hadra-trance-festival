'use strict';

/**
 * Context service : provides URL context injection based on globally or locally specified context.
 */
angular.module('contextService', ['logger'])

  .factory('contextService', function(logger) {

    logger = logger.getLogger('contextService');

    /*
     * Service public interface
     */

    var service = {
      /**
       * The shared context.
       * @type {Object}
       */
      context: null
    };

    /**
     * Injects the specified context into the given REST API.
     * @param {!string} restApi The REST API to fill will context values.
     * @param {?Object=} context The context to use. If not specified, the shared context will be used.
     * @return {string} The ready-to-use REST API to call.
     */
    service.injectContext = function(restApi, context) {
      context = context || service.context;

      logger.log('Injecting context in: ' + restApi);

      if (!context) {
        throw 'injectContext: context or service.context must be defined';
      }

      // Search for context properties to inject
      var properties = restApi.match(/(:\w+)/g);

      angular.forEach(properties, function(property) {
        var contextVar = property.substring(1);
        var contextValue = context[contextVar];

        if (contextValue !== undefined) {
          restApi = restApi.replace(property, contextValue);
          logger.log('Injected ' + contextValue + ' for ' + property);
        } else {
          throw 'injectContext: context.' + contextVar + ' expected but undefined';
        }
      });

      logger.log('Resulting REST API: ' + restApi);

      return restApi;
    };

    return service;
  });