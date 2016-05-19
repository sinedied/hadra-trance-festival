import app from 'main.module';

export class GalleryDirective implements ng.IDirective {
  restrict = 'E';
  scope = true;
  template = <string>require('./gallery.html');
  controller = 'galleryController';
  controllerAs = 'vm';
  bindToController = {
    images: '<'
  };
}

app.directive('gallery', () => new GalleryDirective());

