angular.module('aspirantfashion')
 .controller("orderDetailCtrl", function($scope,$state,$firebaseObject) {
   firebase.auth().onAuthStateChanged(function(user) {
         if (user) {
           $scope.user = user;
            // console.log("user : " + angular.toJson(user , ' '));
           selecteduserDataRef = firebase.database().ref('users/' + $scope.user.uid + '/cartList');
           selecteduserDataObj = $firebaseObject(selecteduserDataRef);
           selecteduserDataObj.$loaded()
           .then(function (response) {
             $scope.selecteduserData = response;
            // console.log("$scope.selecteduserData"+ angular.toJson($scope.selecteduserData));
           });
         }
       });
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
           console.log('logout successfully');
          $state.reload();
       }, function(error) {
           console.log('error' + error);
       });
   };
 });
