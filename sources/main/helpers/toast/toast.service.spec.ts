import { ToastService } from 'toast.service';

const TOAST_CLASS = '.ui-toast';

describe('toastService', () => {

  let toastService, $timeout, $rootScope;

  beforeEach(() => {
    angular.mock.module('app');

    // Create mock for $timeout
    angular.mock.module(($provide: any) => {
      $provide.decorator('$timeout', ($delegate: any) => {
        // Needed to spy on $timeout as it a function and not an object
        return jasmine.createSpy('timeout', $delegate).and.callThrough();
      });
    });

    inject((_$rootScope_: ng.IRootScopeService,
            _$timeout_: ng.ITimeoutService,
            _toastService_: ToastService) => {

      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
      toastService = _toastService_;
    });
  });

  it('should have an show method', () => {
    expect(typeof (toastService.show)).toBe('function');
  });

  it('should have an hide method', () => {
    expect(typeof (toastService.hide)).toBe('function');
  });

  describe('show', () => {

    it('should display a toast with specified message and default duration', () => {
      // Act
      toastService.show('toto');

      // Assert
      let toastElement = $(TOAST_CLASS);
      $rootScope.$apply();

      expect($timeout).toHaveBeenCalled();
      expect($timeout.calls.mostRecent().args[1]).toBe(5000);
      expect(toastElement).toExist();
      expect(toastElement).toBeVisible();
      expect(toastElement).toContainText('toto');

      // Force end of $timeout
      $timeout.flush();

      expect(toastElement).toBeHidden();
    });

    it('should display a toast with specified duration', () => {
      // Act
      toastService.show('toto', null, 1234);

      // Assert
      let toastElement = $(TOAST_CLASS);
      $rootScope.$apply();

      expect($timeout).toHaveBeenCalled();
      expect($timeout.calls.mostRecent().args[1]).toBe(1234);
      expect(toastElement).toExist();
      expect(toastElement).toBeVisible();
      expect(toastElement).toContainText('toto');

      // Force end of $timeout
      $timeout.flush();

      expect(toastElement).toBeHidden();
    });

    it('should display a toast with specified message with custom theme', () => {
      // Act
      toastService.show('toto', 'tata');

      // Assert
      let toastElement = $(TOAST_CLASS);
      $rootScope.$apply();

      expect(toastElement).toBeVisible();
      expect(toastElement).toHaveClass('tata');
      expect(toastElement).toContainText('toto');

      // Force end of $timeout
      $timeout.flush();

      expect(toastElement).toBeHidden();
    });

  });

  describe('hide', () => {

    it('should hide the currently displayed toast', () => {
      // Prepare
      toastService.show('toto');

      let toastElement = $(TOAST_CLASS);
      $rootScope.$apply();

      expect(toastElement).toBeVisible();

      // Act
      toastService.hide();
      $rootScope.$apply();

      // Assert
      expect(toastElement).toBeHidden();
    });

  });

});
