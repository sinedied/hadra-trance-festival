'use strict';

/**
 * Tests for settings service.
 */
describe('settingsService', function() {
  var settingsService;

  beforeEach(function() {
    module('settingsService');

    inject(function(_settingsService_) {
      settingsService = _settingsService_;
    });

    settingsService.set('language');
    settingsService.set('location');
  });

  it('should have a set method', function() {
    expect(typeof (settingsService.set)).toBe('function');
  });

  it('should have a get method', function() {
    expect(typeof (settingsService.get)).toBe('function');
  });

  describe('set', function() {

    it('should set the specified setting', function () {
      // Act
      settingsService.set('language', 'fr-FR');

      // Assert
      expect(settingsService.get('language')).toBe('fr-FR');
    });

    it('should replace existing setting', function () {
      // Act
      settingsService.set('language', 'fr-FR');
      settingsService.set('language', 'en-US');

      // Assert
      expect(settingsService.get('language')).toBe('en-US');
    });

    it('should not interfere with existing setting', function () {
      // Act
      settingsService.set('language', 'fr-FR');
      settingsService.set('location', 'europe');

      // Assert
      expect(settingsService.get('language')).toBe('fr-FR');
      expect(settingsService.get('location')).toBe('europe');
    });

    it('should delete existing setting', function () {
      // Act
      settingsService.set('language', 'fr-FR');
      settingsService.set('language');

      // Assert
      expect(settingsService.get('language')).toBe(undefined);
    });

  });

  describe('get', function() {

    it('should return null if the setting was never set', function() {
      expect(settingsService.get('toto')).toBe(undefined);
    });

  });

});