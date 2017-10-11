angular.module('aspirantfashion')
 .controller("userAccountCtrl", function($scope,$firebaseObject,$state) {
            firebase.auth().onAuthStateChanged(function(user) {
                  if (user) {
                    $scope.user = user;
                    // console.log("user : " + angular.toJson(user , ' '));
                    selecteduserDataRef = firebase.database().ref('users/' + $scope.user.uid);
                    selecteduserDataObj = $firebaseObject(selecteduserDataRef);
                    selecteduserDataObj.$loaded()
                    .then(function (response) {
                      $scope.selecteduserData = response;
                      //  console.log("$scope.selecteduserData"+ angular.toJson($scope.selecteduserData));
                    });
                  }
                });
 $scope.saveUserdetail = function(userdata){
  //  console.log("userdata : " + angular.toJson(userdata , ' '));
   firebase.database().ref('users/' + $scope.user.uid).set({
     firstName: userdata.firstName,
     displayName: userdata.firstName + userdata.lastName,
     lastName: userdata.lastName,
     mobileNumber:userdata.mobileNumber,
     email : userdata.email,
     gender : userdata.gender
      });
      // console.log("data updated successfully...");
 };
 $scope.goMyOrders= function () {
   $state.go('orderdetails');
 };
 $scope.goMywishList= function () {
   $state.go('userWishlist');
 };
 $scope.goMyAccount= function () {
   $state.go('useraccount');
 };
 $scope.logout = function() {
     firebase.auth().signOut().then(function() {
        //  console.log('logout successfully');
        $state.reload();
     }, function(error) {
         console.log('error' + error);
     });
 };
 });
