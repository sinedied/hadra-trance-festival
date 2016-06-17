import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

/**
 * Scroll service: provides helper methods to fix multiple scroll issues.
 */
export class ScrollService {

  private logger: ILogger;

  constructor(private $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate,
              private $timeout: ng.ITimeoutService,
              logger: LoggerService) {

    this.logger = logger.getLogger('scrollService');
  }

  fixXScrollWithHandle(handle: string) {
    this.$timeout(() => {
      let scrollView = this.$ionicScrollDelegate.$getByHandle(handle).getScrollView();
      let container = scrollView.__container;

      if (!container.__scrollFixed) {
        container.__scrollFixed = true;

        // Replace original touch handler to allow bubbling up
        let originalTouchStart = scrollView.touchStart;
        container.removeEventListener('touchstart', scrollView.touchStart);

        scrollView.touchStart = (e) => {
          // Fake this method to prevent ionic touch hander to stop bubbling up
          e.preventDefault = angular.noop;

          // For some reasons, this check is needed to avoid an error...
          if (originalTouchStart) {
            originalTouchStart.apply(scrollView, [e]);
          }
        };

        container.addEventListener('touchstart', scrollView.touchStart, false);
      }
    });
  }

}

app.service('scrollService', ScrollService);
