import app from 'main.module';

/**
 * Toast service: provides methods to display temporary toast messages.
 */
export class ToastService {

  config = {
    duration: 5000
  };
  vm = {
    theme: '',
    message: '',
    show: false,
    hide: this.hide.bind(this)
  };
  promise: ng.IPromise<any>;

  constructor($compile: ng.ICompileService,
              $document: ng.IDocumentService,
              $rootScope: ng.IRootScopeService,
              private $timeout: ng.ITimeoutService) {

    let $scope = $rootScope.$new();
    $scope['vm'] = this.vm;

    let toastElement = $compile(<string>require('toast.html'))($scope);
    $document.find('body').append(toastElement);
  }

  show(message: string, theme?: string, duration?: number) {
    this.vm.message = message;
    this.vm.theme = theme;
    this.vm.show = true;

    // Cancel previous timeout if needed
    if (this.promise) {
      this.$timeout.cancel(this.promise);
    }

    this.promise = this.$timeout(() => {
      this.vm.show = false;
      this.promise = null;
    }, duration || this.config.duration);
  }

  hide() {
    // Cancel previous timeout if needed
    if (this.promise) {
      this.$timeout.cancel(this.promise);
      this.promise = null;
    }

    this.vm.show = false;
  }

}

app.service('toastService', ToastService);
