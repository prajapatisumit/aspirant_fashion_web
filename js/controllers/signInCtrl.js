angular.module('aspirantfashion')
.controller('signInCtrl', function($scope,$state, $rootScope,$firebaseArray,$log, $firebaseObject,$uibModal) {
  $scope.login = function (user) {
      console.log("user : " + angular.toJson(user , ' '));
    firebase.auth().signInWithEmailAndPassword(user.email,user.password).then(function (response) {
      console.log('login sucessfully..');
      // console.log("response : " + angular.toJson(response , ' '));
    }),
    function(error) {
      console.log('login unsucessfull please try again later...');
      //  console.log("error : " + angular.toJson(error , ' '));
      //  console.log(error.message);
    };
  };
  $scope.goSignup= function () {
    console.log('its working');
    $state.go('signup');
  };
  $scope.openSignupModal= function () {
    var modalInstance = $uibModal.open({
        templateUrl: 'templates/signIn.html',
    });
      modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
  $scope.close = function () {
    console.log('yes close is calling...');
      // $uibModalInstance.dismiss('cancel');
    };
});
