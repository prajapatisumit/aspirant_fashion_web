angular.module('aspirantfashion')
 .controller("cartDetailCtrl", function($scope,$stateParams,$firebaseArray,$firebaseObject,sharedCartService,$window ,$state) {

     firebase.auth().onAuthStateChanged(function(user) {
       if (user) {
         $scope.user = user;
      //  console.log("user : " + angular.toJson(user , ' '));
         $scope.cart=sharedCartService.cart_items;  // Loads users cart
        //  console.log("$scope.cart "+ angular.toJson($scope.cart , ' '));
           selectedCartRef = firebase.database().ref('cart/' + $scope.user.uid + '/cartList');
               cartObj = $firebaseArray(selectedCartRef);
               cartObj.$loaded()
                 .then(function (response) {
                   $scope.selectedCartData = response;
                  // console.log("$scope.selectedCartData"+ angular.toJson($scope.selectedCartData));
                 });

        //  console.log("$scope.cart : " + angular.toJson($scope.cart , ' '));

         $scope.get_qty = function() {
           $scope.total_qty=0;
           $scope.total_amount=0;
           $scope.total_weight=0;
           for (var i = 0; i < $scope.selectedCartData.length; i++) {
             $scope.total_qty += $scope.selectedCartData[i].item_qty;
             $scope.total_amount += ($scope.selectedCartData[i].item_qty * $scope.selectedCartData[i].item_price);
             $scope.total_weight += ($scope.selectedCartData[i].item_qty * $scope.selectedCartData[i].item_weight);
           }
          var weightInKg = $scope.total_weight / 1000;
          var finalWeight = Math.ceil(weightInKg);
          console.log('finalWeight : ' + finalWeight);
           if ($scope.selectedCartData.length < 1) {
               $scope.shippingRate = 0;
           }  else {
               $scope.shippingRate = 55 * finalWeight;
           }
             $scope.finalTotal = $scope.shippingRate + $scope.total_amount;
             return $scope.total_qty;

         };

       }
     });
     $scope.cartReload= function () {
       console.log("working");
       $state.reload();
     };
     $scope.removeFromCart=function(c_id){
      var deleteproduct = $window.confirm('Are you sure you want to delete the product?');
      if(deleteproduct){
        sharedCartService.drop(c_id);
      }
   };
   $scope.updateQty = function (qty) {
     $scope.get_qty();
   }
     $scope.goForCheckout= function () {
       $state.go('usercheckout');
     };
 });
