import app from 'main.module';

export class ImageGalleryController {

  activeImage: number;
  modal: ionic.modal.IonicModalController;

  constructor(private $scope: ng.IScope,
              private $ionicSlideBoxDelegate: ionic.slideBox.IonicSlideBoxDelegate,
              private $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate,
              private $ionicModal: ionic.modal.IonicModalService) {

    this.modal = this.$ionicModal.fromTemplate(<string>require('./image-viewer/image-viewer.modal.html'), {
      scope: this.$scope
    });

    $scope.$on('$destroy', () => {
      this.modal.remove();
    });
  }

  showViewer(index: number) {
    this.activeImage = index;
    this.modal.show();
  }

  closeViewer() {
    this.modal.hide();
  }

  updateSlideStatus(index: number) {
    let zoomFactor = (<any>this.$ionicScrollDelegate.$getByHandle('scrollHandle' + index).getScrollPosition()).zoom;
    this.$ionicSlideBoxDelegate.enableSlide(zoomFactor === 1);
  }

}

app.controller('imageGalleryController', ImageGalleryController);

