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
            $scope.getOneProduct();
      // console.log("$scope.selectedCartData"+ angular.toJson($scope.selectedCartData));
          });
  } else {
     selectedCartRef = firebase.database().ref('cart/' + user.uid + '/cartList');
     cartObj = $firebaseArray(selectedCartRef);
     cartObj.$loaded()
       .then(function (response) {
         $scope.selectedCartData = response;
         $scope.get_qty();
    // console.log("$scope.selectedCartData"+ angular.toJson($scope.selectedCartData));
       });
       $scope.cart=sharedCartService.cart_items;
   }
   $scope.getOneProduct = function(data) {
     $scope.total_qty=0;
     $scope.total_amount=0;
     $scope.total_weight=0;
      $scope.total_qty = $scope.selectedCartData.item_qty;
      $scope.total_amount = ($scope.selectedCartData.item_qty * $scope.selectedCartData.item_price);
      $scope.total_weight = ($scope.selectedCartData.item_qty * $scope.selectedCartData.item_weight);
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
$scope.userAddress = SessionService.getUserDeliveryLocation();
console.log("$scope.userAddress"+ angular.toJson($scope.userAddress,' '));

});
