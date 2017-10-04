angular.module('aspirantfashion')
.controller('signInCtrl', function($scope,$state, $rootScope,$firebaseArray,$log, $firebaseObject,$uibModal,SessionService) {
  $scope.user = null;
  $scope.login = function (user) {
      console.log("user : " + angular.toJson(user , ' '));
    firebase.auth().signInWithEmailAndPassword(user.email,user.password).then(function (resp) {
      // var userObj = {
      //   "uid": response.uid,
      //   "displayName": response.displayName,
      //   "email": response.email,
      //   "photoURL": response.photoURL,
      //   "phoneNumber"
      // }
      // console.log('login sucessfully..');
      // debugger
      var user = resp;
      console.log("user.uid " + user.uid);
      var usersRef = firebase.database().ref('users/' + user.uid);
      // console.log("usersRef: " + usersRef);
      var userData = $firebaseArray(usersRef);
      userData.$loaded().then(function(response) {
              $scope.data = response;
              // console.log("$scope.data : " + angular.toJson($scope.data , ' '));
              if ($scope.data.length > 0) {
                  var userDataById = $firebaseObject(usersRef);
                  userDataById.$loaded().then(function(resp) {
                      $scope.userObj = resp;
                      var obj = {
                          uid: $scope.userObj.$id,
                          displayName: $scope.userObj.displayName,
                          email: $scope.userObj.email,
                          photoURL: $scope.userObj.photoURL,
                          isAdmin: $scope.userObj.isAdmin
                      }
                      SessionService.setUser(obj);
                      $scope.close();
                  });
                  // sharedUtils.hideLoading();
                  // $state.go('home', {});

              }

          })
          .catch(function(error) {
              console.log("Error at email login :", error);
          });

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
      $rootScope.modalInstance = $uibModal.open({
        templateUrl: 'templates/signIn.html',
    });
        $rootScope.modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
  $scope.close = function () {
    console.log('yes close is calling...');
    $rootScope.modalInstance.close();
      //  $scope.modalInstance.dismiss('cancel');
      //  modalInstance.close();
    };
});
