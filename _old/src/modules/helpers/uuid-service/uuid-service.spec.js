'use strict';

/**
 * Tests for uuid service.
 */
describe('uuidService', function() {
  var uuidService;

  beforeEach(function() {
    module('uuidService');

    inject(function(_uuidService_) {
      uuidService = _uuidService_;
    });
  });

  it('should have a getUUID method', function() {
    expect(typeof (uuidService.getUUID)).toBe('function');
  });

  describe('getUUID', function() {

    it('should generate a UUID with 32 chars + 4 dashes ', function() {
      // Arrange

      // Act
      var id = uuidService.getUUID();

      // Assert
      expect(id.length).toEqual(36);
    });

    it('should generate different UUIDs with each call', function() {
      // Arrange

      // Act
      var id1 = uuidService.getUUID();
      var id2 = uuidService.getUUID();
      var id3 = uuidService.getUUID();

      // Assert
      expect(id1).not.toEqual(id2);
      expect(id2).not.toEqual(id3);
      expect(id1).not.toEqual(id3);
    });

  });

});
