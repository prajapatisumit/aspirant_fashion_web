angular.module('aspirantfashion')
.controller('signupCtrl', function($scope, $state, $rootScope,$firebaseArray, $firebaseObject, SessionService) {
        $scope.initPage = function() {
            $scope.loginUser = {};
        }
        $scope.signupWithEmail = function(userdata) {
            console.log("signupWithEmail : " + angular.toJson(userdata, ' '));

            firebase.auth().createUserWithEmailAndPassword(userdata.email, userdata.password).then(function(response) {
                console.log("response data : " + angular.toJson(response, ' '));

                firebase.database().ref('users/' + response.uid).set({
                    displayName: userdata.name,
                    email: userdata.email
                });
            }).catch(function(error) {
                console.log("error : " + error);
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
            });
        };
        $scope.signinWithEmail = function() {
            // if (formName.$valid) { // Check if the form data is valid or not
            // sharedUtils.showLoading();
            firebase.auth().signInWithEmailAndPassword($scope.loginUser.email, $scope.loginUser.password).then(function(result) {
                    console.log('login sucessfully..');
                    $state.go('home');
                },
                function(error) {
                    console.log('login unscessfull please try again later...');
                });
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
                                $rootScope.userLog = obj;
                                SessionService.setUser(obj);
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
                console.log('user :'+ angular.toJson(user,' '));
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
                                $rootScope.userLog = obj;
                                SessionService.setUser(obj);
                                console.log("$rootScope.user when user alredy signin with google..: " + angular.toJson($rootScope.userLog, ' '));
                            });
                            // sharedUtils.hideLoading();
                            $state.go('home');
                            // TODO: refresh current page
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
                            // console.log("$rootScope.userLog when new google user login : " + angular.toJson($rootScope.userLog, ' '));
                            var ref = firebase.database().ref('users/' + user.uid);
                            ref.set(userObj).then(function(snapshot) {
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
