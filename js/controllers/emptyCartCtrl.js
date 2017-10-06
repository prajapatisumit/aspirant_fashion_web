angular.module('aspirantfashion')
.controller('emptyCartCtrl', function($scope,$state) {
    $scope.goHomepage= function () {
      $state.go('home');
    };
});
