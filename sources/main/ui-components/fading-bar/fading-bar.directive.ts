/*
 Based on https://github.com/tinga-dev/ti-ionic-fading-header

 The MIT License (MIT)

 Copyright (c) 2015 tinga-dev

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import app from 'main.module';
import {FadingBarService} from 'fading-bar.service';

const SCROLL_THRESHOLD: number = 20;
const BAR_HEIGHT: number = 20;

function fadingBarDirective(fadingBarService: FadingBarService,
                            $rootScope: ng.IRootScopeService): ng.IDirective {
  return {
    restrict: 'A',
    link: ($scope: ng.IScope, $element: any, $attr: any) => {
      let targetColor = $attr.fadeToRgb.split(',');
      let imageHeight = parseInt($attr.fadingBar, 10);
      let navbars = fadingBarService.getNavBars();
      let opacity = 0;

      $element.css({top: 0});
      fadingBarService.makeNavBarTransparent();

      function onScroll(event: any) {
        let detail = event.detail || event.target;
        let scrollTop = detail.scrollTop;
        if (scrollTop <= imageHeight - BAR_HEIGHT) {
          handleNavBarFade(scrollTop);
        } else {
          (<any>ionic).requestAnimationFrame(() => {
            fadingBarService.resetNavBar();
          });
        }
      }

      function handleNavBarFade(scrollTop: number) {
        if (scrollTop <= SCROLL_THRESHOLD) {
          opacity = 0;
        } else if (scrollTop > SCROLL_THRESHOLD && scrollTop <= imageHeight - BAR_HEIGHT) {
          opacity = (scrollTop - SCROLL_THRESHOLD) / (imageHeight - BAR_HEIGHT - SCROLL_THRESHOLD);
        } else {
          opacity = 1;
        }
        setOpacityToNavBar();
      }

      function setOpacityToNavBar() {
        (<any>ionic).requestAnimationFrame(() => {
          for (var i = 0; i < navbars.length; ++i) {
            var header = angular.element(navbars[i]);
            header.css({
              borderColor: 'rgba(' + targetColor[0] + ', ' + targetColor[1] + ', ' + targetColor[2] + ', ' + opacity + ')',
              backgroundImage: 'none',
              backgroundColor: 'rgba(' + targetColor[0] + ', ' + targetColor[1] + ', ' + targetColor[2] + ', ' + opacity + ')'
            });
          }
        });
      }

      $element.bind('scroll', onScroll);

      $rootScope.$on('$stateChangeStart', (event: any, toState: any) => {
        if (toState.name !== $attr.stateName) {
          fadingBarService.resetNavBar();
        }
      });

      $rootScope.$on('$stateChangeSuccess', (event: any, toState: any) => {
        if (toState.name === $attr.stateName) {
          setOpacityToNavBar();
        }
      });

    }
  };
}

app.directive('fadingBar', fadingBarDirective);
