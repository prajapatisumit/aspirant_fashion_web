angular.module('aspirantfashion')
 .controller("orderSummaryCtrl", function($scope,$state,$firebaseObject,sharedCartService,SessionService,$stateParams,$firebaseArray) {
   var user = SessionService.getUser();
  console.log("user : " + angular.toJson(user,' '));
  $scope.selectedProId = $stateParams.selected_ProductOrderSummary_id;
  console.log("$scope.selectedProId : " + ($scope.selectedProId,' '));

  if(!!$scope.selectedProId){
    selectedCartRef = firebase.database().ref('cart/' + user.uid + '/cartList/' + $scope.selectedProId);
        cartObj = $firebaseObject(selectedCartRef);
        cartObj.$loaded()
          .then(function (response) {
            $scope.selectedCartData = response;
      console.log("$scope.selectedCartData"+ angular.toJson($scope.selectedCartData));
          });
  } else {
     selectedCartRef = firebase.database().ref('cart/' + user.uid + '/cartList');
     cartObj = $firebaseArray(selectedCartRef);
     cartObj.$loaded()
       .then(function (response) {
         $scope.selectedCartData = response;
    console.log("$scope.selectedCartData"+ angular.toJson($scope.selectedCartData));
       });
       $scope.cart=sharedCartService.cart_items;
   }
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
$scope.userAddress = SessionService.getUserDeliveryLocation();
console.log("$scope.userAddress"+ angular.toJson($scope.userAddress,' '));

});
