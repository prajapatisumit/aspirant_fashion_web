angular.module('aspirantfashion')
.controller('registerLoginCtrl', function($scope, $state, $rootScope,$firebaseArray, $firebaseObject, SessionService,$uibModal,$window) {
        $scope.signupWithEmail = function(users) {
            firebase.auth().createUserWithEmailAndPassword(users.email, users.password).then(function(response) {
                firebase.database().ref('users/' + response.uid).set({
                    displayName: users.name,
                    email: users.email
                });
            var signupObj = {
                uid: response.uid,
                displayName: users.name,
                email: users.email,
            }
            $scope.close();
          var user = SessionService.setUser(signupObj);
          // var getSessionUser = SessionService.getUser();
          // console.log("getSessionUser : " + angular.toJson(getSessionUser , ' '));
              $state.go('home');
            }).catch(function(error) {
                $window.alert(error);
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
            });
        };
        $scope.user = null;
        $scope.login = function (user) {
          firebase.auth().signInWithEmailAndPassword(user.email,user.password).then(function (resp) {
            var user = resp;
            // console.log("user.uid " + user.uid);
            var usersRef = firebase.database().ref('users/' + user.uid);
            var userData = $firebaseArray(usersRef);
            userData.$loaded().then(function(response) {
                    $scope.data = response;
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
                            $scope.close();
                            SessionService.setUser(obj);
                        });
                    }
                })
                .catch(function(error) {
                    console.log("Error at email login :", error);
                });
          }),
          function(error) {
            console.log('login unsucessfull please try again later...');
          };
        };
        $scope.openSigninModal= function () {
            $rootScope.modalInstance = $uibModal.open({
              templateUrl: 'templates/signIn.html',
          });
        }
        $scope.openSignupModal= function () {
            $rootScope.modalInstance = $uibModal.open({
              templateUrl: 'templates/signup.html',
          });
        }
        $scope.close = function () {
          $rootScope.modalInstance.close();
        };
        $scope.goSignup =function () {
            $scope.close();
            $scope.openSignupModal();
        }
        $scope.goSignin=function () {
          $scope.close();
          $scope.openSigninModal();
        }

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
                var userData = $firebaseObject(usersRef);
                userData.$loaded().then(function(response) {
                        $scope.data = response;
                        // console.log("$scope.data : " + angular.toJson($scope.data , ' '));
                        if (!!$scope.data && !!$scope.data.displayName) {
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
                                $rootScope.userLog = obj;
                                SessionService.setUser(obj);
                                  $scope.close();
                                console.log("$rootScope.user when user alredy signin with facebook..: " + angular.toJson($rootScope.userLog, ' '));
                            });
                            // sharedUtils.hideLoading();
                            $state.go('home', {});
                            console.log("user already saved..");
                        } else {
                            var userObj = {
                                uid: user.uid,
                                displayName: user.displayName,
                                email: user.email,
                                photoURL: user.photoURL,
                                isAdmin: false

                            }
                           $rootScope.userLog = userObj;
                              SessionService.setUser(userObj);
                            console.log("$rootScope.userLog when new facebook user login : " + angular.toJson($rootScope.userLog, ' '));
                            var ref = firebase.database().ref('users/' + user.uid);
                            ref.set(userObj).then(function(snapshot) {
                              $scope.close();
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

        // for google authantication

        var googleProvider = new firebase.auth.GoogleAuthProvider();
        $scope.loginWithGoogle = function() {
            firebase.auth().signInWithPopup(googleProvider).then(function(result) {
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                console.log('user :'+ angular.toJson(user,' '));
                var usersRef = $firebaseObject(firebase.database().ref('users/' + user.uid));
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
                                $rootScope.userLog = obj;
                                SessionService.setUser(obj);
                                $scope.close();
                                console.log("$rootScope.user when user alredy signin with google..: " + angular.toJson($rootScope.userLog, ' '));
                            });
                            // sharedUtils.hideLoading();
                            $state.go('home');
                       } else {
                            var userObj = {
                                uid: user.uid,
                                displayName: user.displayName,
                                email: user.email,
                                photoURL: user.photoURL,
                                isAdmin: false
                            }
                            SessionService.setUser(userObj);
                            var ref = firebase.database().ref('users/' + user.uid);
                            ref.set(userObj).then(function(snapshot) {
                                $scope.close();
                                console.log('user set successfully...');
                            });
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
