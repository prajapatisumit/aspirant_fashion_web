angular.module('aspirantfashion')
 .controller("userWishListCtrl", function($scope,$state,SessionService,$stateParams,$firebaseObject,$firebaseArray ) {
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
   firebase.auth().onAuthStateChanged(function(user) {
     if (user) {
       $scope.user=user; //Saves data to user_info

       $scope.loadFavourite();
   }
   });
   $scope.loadFavourite = function () {
     var refFavoriteData = firebase.database().ref('favourits/' + $scope.user.uid);
         var favouriteData = $firebaseArray(refFavoriteData);
         favouriteData.$loaded().then(function(response) {
           $scope.favouritsData = response;
         });
   };
   $scope.deletefevorite = function(productId) {
       var deleteFevoriteRef = firebase.database().ref('favourits/' + $scope.user.uid + '/' + productId);
       var deleteFevoriteProductRef = firebase.database().ref('product/' + productId + '/favouriteBy/' + $scope.user.uid);
       deleteFevoriteRef.remove().then(function (response) {
         deleteFevoriteProductRef.remove().then(function (response) {
         });
       });

 };
 });
