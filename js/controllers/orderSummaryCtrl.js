angular.module('aspirantfashion')
 .controller("orderSummaryCtrl", function($scope,$state,$firebaseObject,sharedCartService,SessionService ) {
   firebase.auth().onAuthStateChanged(function(user) {
     if (user) {
       $scope.user = user;
      //  console.log("user : " + angular.toJson(user , ' '));
       $scope.cart=sharedCartService.cart_items;  // Loads users cart
      // console.log("$scope.cart "+ angular.toJson($scope.cart , ' '));
         selectedCartRef = firebase.database().ref('cart/' + $scope.user.uid);
             cartObj = $firebaseObject(selectedCartRef);
             cartObj.$loaded()
               .then(function (response) {
                 $scope.selectedCartData = response;
            console.log("$scope.selectedCartData"+ angular.toJson($scope.selectedCartData));
               });

       console.log("$scope.cart : " + angular.toJson($scope.cart , ' '));
       $scope.get_qty = function() {
         $scope.total_qty=0;
         $scope.total_amount=0;
         for (var i = 0; i < sharedCartService.cart_items.length; i++) {
           $scope.total_qty += sharedCartService.cart_items[i].item_qty;
           $scope.total_amount += (sharedCartService.cart_items[i].item_qty * sharedCartService.cart_items[i].item_price);
           $scope.total_weight += (sharedCartService.cart_items[i].item_qty * sharedCartService.cart_items[i].item_weight);
         }
         return $scope.total_amount;
       };
     }
   });
$scope.userAddress = SessionService.getUserDeliveryLocation();
console.log("$scope.userAddress"+ angular.toJson($scope.userAddress,' '));

});
