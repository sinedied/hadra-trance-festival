import app from 'main.module';

export class ImageGalleryDirective implements ng.IDirective {
  restrict = 'EA';
  scope = true;
  template = <string>require('./image-gallery.html');
  controller = 'imageGalleryController';
  controllerAs = 'vm';
  bindToController = {
    images: '<'
  };
}

app.directive('imageGallery', () => new ImageGalleryDirective());

