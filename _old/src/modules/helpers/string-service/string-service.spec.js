'use strict';

/**
 * Tests for string service.
 */
describe('stringService', function() {
  var gettextCatalog, stringService;

  beforeEach(function() {
    module('stringService');

    inject(function(_gettextCatalog_, _stringService_) {
      gettextCatalog = _gettextCatalog_;
      stringService = _stringService_;
    });
  });

  describe('format', function() {

    it('should not format string if it is no needed and return string param', function () {
      // Arrange
      var string = 'no need to format';

      // Act
      var result = stringService.format(string);

      // Assert
      expect(result).toEqual(string);
    });

    it('should format string with specified parameters', function () {
      // Arrange
      var string = 'this {0} should be formatted with {1} replacements as a new {0}';

      // Act
      var result = stringService.format(string, 'string', 3);

      // Assert
      expect(result).toEqual('this string should be formatted with 3 replacements as a new string');
    });

    it('should format string with specified parameters passed as an array', function () {
      // Arrange
      var string = 'this {0} should be formatted with {1} replacements as a new {0}';

      // Act
      var result = stringService.format(string, [ 'string', 3 ]);

      // Assert
      expect(result).toEqual('this string should be formatted with 3 replacements as a new string');
    });

    it('should format string with specified parameters and perform needed translations', function () {
      // Arrange
      spyOn(gettextCatalog, 'getString').andCallFake(function() {
        return 'string';
      });
      var string = 'this {0} should be formatted with {1} replacements as a new {0}';

      // Act
      var result = stringService.format(string, 'T_STRING', 3);

      // Assert
      expect(result).toEqual('this string should be formatted with 3 replacements as a new string');
    });

    it('should format and translate string with specified parameters', function () {
      // Arrange
      spyOn(gettextCatalog, 'getString').andCallFake(function() {
        return 'this {0} should be formatted with {1} replacements as a new {0}';
      });
      var string = 'T_STRING';

      // Act
      var result = stringService.format(string, 'string', 3);

      // Assert
      expect(result).toEqual('this string should be formatted with 3 replacements as a new string');
    });

    it('should format string with specified parameters and leave translation keys as-is if no translations are found', function () {
      // Arrange
      var string = 'this string should not be formatted with {0} replacements as a new string';

      // Act
      var result = stringService.format(string);

      // Assert
      expect(result).toEqual('this string should not be formatted with {0} replacements as a new string');
    });

  });

  describe('contains', function() {

    it('should return false if the input is null', function() {
      // Act
      var result = stringService.contains(null, null);

      // Assert
      expect(result).toEqual(false);
    });

    it('should return true if the input is defined and search is null', function() {
      // Act
      var result = stringService.contains('', null);

      // Assert
      expect(result).toEqual(true);
    });

    it('should return true if the input is defined and search is empty', function() {
      // Act
      var result = stringService.contains('', '');

      // Assert
      expect(result).toEqual(true);
    });

    it('should return false if the input is defined and search is not found', function() {
      // Act
      var result = stringService.contains('toto', 'tata');

      // Assert
      expect(result).toEqual(false);
    });

    it('should return true if the input is defined and search is found', function() {
      // Act
      var result = stringService.contains('toto', 'o');

      // Assert
      expect(result).toEqual(true);
    });

    it('should return false if the input is an array and search is not found', function() {
      // Act
      var result = stringService.contains(['toto', null, 'tata'], 'e');

      // Assert
      expect(result).toEqual(false);
    });

    it('should return true if the input is an array and search is found', function() {
      // Act
      var result = stringService.contains(['toto', null, 'tate'], 'e');

      // Assert
      expect(result).toEqual(true);
    });

    it('should return true if the input is an array and search is null', function() {
      // Act
      var result = stringService.contains(['toto', null, 'tate'], null);

      // Assert
      expect(result).toEqual(true);
    });

    it('should return true if the input is an array and search is empty', function() {
      // Act
      var result = stringService.contains(['toto', null, 'tate'], '');

      // Assert
      expect(result).toEqual(true);
    });

  });

});
