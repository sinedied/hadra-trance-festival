import app from 'main.module';

export class ThumbnailDirective implements ng.IDirective {
  restrict = 'E';
  scope = true;
  template = <string>require('./thumbnail.html');
  controller = 'thumbnailController';
  controllerAs = 'vm';
  bindToController = {
    src: '@'
  };
}

app.directive('thumbnail', () => new ThumbnailDirective());

