import app from 'main.module';

export class ThumbnailController {

  isExpanded: boolean = false;
  modal: ionic.modal.IonicModalController;

  constructor(private $scope: ng.IScope,
              private $ionicModal: ionic.modal.IonicModalService) {

    this.modal = this.$ionicModal.fromTemplate(`
      <ion-modal-view>
        <div class="thumbnail photo expanded" ng-click="vm.reduce()" ng-style="{ \'background-image\': \'url(\' + vm.src + \')\' }"></div>
       </ion-modal-view>`, {
      scope: this.$scope,
      animation: 'scale-in'
    });
    console.log($ionicModal);
  }

  expand() {
//    this.isExpanded = !this.isExpanded;
    this.modal.show();
  }

  reduce() {
    this.modal.hide();
//    this.modal.remove();
  }
}

app.controller('thumbnailController', ThumbnailController);

