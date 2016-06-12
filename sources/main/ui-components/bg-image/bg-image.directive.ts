import app from 'main.module';

/**
 * Sets the background image of the element using css.
 *
 * Example: <div bg-image="toto.jpg">...</div>
 *
 * By default the image size mode is set to 'cover', but you can change it to 'contain' using the css class
 * 'bg-image-contain'.
 *
 * Example: <div class="bg-image-contain" bg-image="toto.jpg">...</div>
 */
export class BgImageDirective implements ng.IDirective {
  restrict = 'A';
  link($scope: ng.IScope, $element: ng.IAugmentedJQuery, $attr: ng.IAttributes) {
    $element.addClass('bg-image');
    $scope.$watch($attr['bgImage'], (value: string) => {
      $element.css({backgroundImage: 'url(' + value + ')'});
    });
  }
}

app.directive('bgImage', () => new BgImageDirective());

