function footer() {

  return {
    templateUrl: 'js/directives/footer/footer.html',
    restrict: 'EA',
    replace: true,
    scope: {},
    controller: function($scope) {

    }
  };
}
angular.module('aspirantfashion').directive('footer', footer);
