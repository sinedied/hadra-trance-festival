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

export class FadingBarService {
  navbars: any;
  titles: any;

  constructor($document: any) {
    this.navbars = $document[0].body.querySelectorAll('.nav-bar-block ion-header-bar');
    this.titles = $document[0].body.querySelectorAll('.nav-bar-block ion-header-bar .title');
  }

  makeNavBarTransparent() {
    for (let i = 0; i < this.navbars.length; ++i) {
      let header = angular.element(this.navbars[i]);
      header.css({
        borderColor: 'transparent',
        backgroundImage: 'none',
        backgroundColor: 'transparent'
      });
    }
    for (let i = 0; i < this.titles.length; ++i) {
      let title = angular.element(this.titles[i]);
      title.css({
        color: 'rgba(255,255,255,0)'
      });
    }
  }

  resetNavBar() {
    for (let i = 0; i < this.navbars.length; ++i) {
      let header = angular.element(this.navbars[i]);
      header.css({
        borderColor: '',
        backgroundImage: '',
        backgroundColor: ''
      });
    }
    for (let i = 0; i < this.titles.length; ++i) {
      let title = angular.element(this.titles[i]);
      title.css({
        color: ''
      });
    }
  }

}

app.service('fadingBarService', FadingBarService);
