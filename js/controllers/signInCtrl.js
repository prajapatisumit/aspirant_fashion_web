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
    $scope.close();
  };
  $scope.openSignupModal= function () {
      $rootScope.modalInstance = $uibModal.open({
        templateUrl: 'templates/signIn.html',
    });
    //     $rootScope.modalInstance.result.then(function (selectedItem) {
    //   $ctrl.selected = selectedItem;
    // }, function () {
    //   $log.info('Modal dismissed at: ' + new Date());
    // });
  }
  $scope.close = function () {
    // console.log('yes close is calling...');
    $rootScope.modalInstance.close();
      //  $scope.modalInstance.dismiss('cancel');
      //  modalInstance.close();
    };
    ////for facebook login:
    var facebookProvider = new firebase.auth.FacebookAuthProvider();
    $scope.loginWithFacebook = function() {
        firebase.auth().signInWithPopup(facebookProvider).then(function(result) {
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
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
                                uid: $scope.userObj.uid,
                                displayName: $scope.userObj.displayName,
                                email: $scope.userObj.email,
                                photoURL: $scope.userObj.photoURL,
                                isAdmin: $scope.userObj.isAdmin

                            }
                            // $rootScope.userLog = obj;
                            SessionService.setUser(obj);
                            console.log("$rootScope.user when user alredy signin with facebook..: " + angular.toJson($rootScope.userLog, ' '));
                        });
                        // sharedUtils.hideLoading();
                        $state.go('home', {});
                        console.log("user already saved..");
                        $scope.close();
                    } else {
                        var userObj = {
                            uid: user.uid,
                            displayName: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL,
                            isAdmin: false

                        }
                        $rootScope.userLog = userObj;
                        SessionService.setUser(obj);
                        console.log("$rootScope.userLog when new facebook user login : " + angular.toJson($rootScope.userLog, ' '));
                        var ref = firebase.database().ref('users/' + user.uid);
                        ref.set(userObj).then(function(snapshot) {
                            console.log('user set successfully...');
                        });
                        $state.go('home');

                    }

                })
                .catch(function(error) {
                    console.log("Error at facebook login :", error);
                });
        }).catch(function(error) {

            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
    };

    var googleProvider = new firebase.auth.GoogleAuthProvider();
    $scope.loginWithGoogle = function() {
        firebase.auth().signInWithPopup(googleProvider).then(function(result) {
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            var usersRef = $firebaseArray(firebase.database().ref('users/' + user.uid));
            usersRef.$loaded().then(function(response) {
                    $scope.data = response;
                     console.log("$scope.data : " + angular.toJson($scope.data , ' '));
                    if ($scope.data.length > 0) {
                        var userDataById = $firebaseObject(usersRef);
                        userDataById.$loaded().then(function(resp) {
                            $scope.userObj = resp;
                            var obj = {
                                uid: $scope.userObj.uid,
                                displayName: $scope.userObj.displayName,
                                email: $scope.userObj.email,
                                photoURL: $scope.userObj.photoURL,
                                isAdmin: $scope.userObj.isAdmin
                            }
                            // $rootScope.userLog = obj;
                            SessionService.setUser(obj);
                              $scope.close();
                            // console.log("$rootScope.user when user alredy signin with facebook..: " + angular.toJson($rootScope.userLog, ' '));
                        });
                        // sharedUtils.hideLoading();
                        // $state.go('home', {});
                        // TODO: refresh current page
                        console.log("user already saved..");

                   } else {
                        var userObj = {
                            uid: user.uid,
                            displayName: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL,
                            isAdmin: false
                        }
                        // $rootScope.userLog = userObj;
                        // SessionService.setUser(obj);
                        // console.log("$rootScope.userLog when new google user login : " + angular.toJson($rootScope.userLog, ' '));
                        var ref = firebase.database().ref('users/' + user.uid);
                        ref.set(userObj).then(function(snapshot) {
                            console.log('user set successfully...');
                        });
                          $scope.close();
                        $state.go('home');
                    }

                })
                .catch(function(error) {
                    console.log("Error at google login :", error);
                });
        }).catch(function(error) {

            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
    };
});
