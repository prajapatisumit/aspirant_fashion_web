angular.module('aspirantfashion')
 .controller("userCheckOutCtrl", function($scope,$state,$firebaseObject,$firebaseArray,fireBaseData,sharedCartService,SessionService,$stateParams) {
   $scope.goCartPage= function () {
     $state.go('cartdetails');
   };

   $scope.goOrderReviewPage= function () {
     $state.go('orderreview');
   };
   $scope.isDivShow = false;
   $scope.showDiv = function (isEdit) {
     if ($scope.isDivShow === false) {
       if (isEdit===false) {
         $scope.addressObj = {};
       }
       $scope.isDivShow = true;
     }else if ($scope.isDivShow === true) {
       $scope.isDivShow = false;
     }
   };
   firebase.auth().onAuthStateChanged(function(user) {
           if (user) {
             selectedaddressesRef = fireBaseData.refUser().child(user.uid).child("address");
                 addressesObj = $firebaseArray(selectedaddressesRef);
                 addressesObj.$loaded()
                   .then(function (response) {
                     $scope.addresses = response;
                    //  console.log("$scope.addresses"+ angular.toJson($scope.addresses,' '));
                     $scope.user=user;
                     if ($scope.addresses.length <=0) {
                         $scope.isDivShow = true;
                     }
                     else{
                       $scope.isDivShow = false;
                     }
                    //  console.log("$scope.addresses.length : " + angular.toJson($scope.addresses.length  , ' '));
                    $scope.selected_price_option = $scope.addresses[0];
                      });
           }
           else if (!!sessionUser.uid) {
             $scope.addresses= $firebaseArray( fireBaseData.refUser().child(sessionUser.uid).child("address") );
             $scope.user=sessionUser;
           }
       });
    $scope.saveAddress = function (addressObj) {
          //  if ($scope.validate(addressObj) === false) {
          //        return;
          //      }
           var obj = {
                 name : addressObj.name,
                 city : addressObj.city,
                 area : addressObj.area,
                 building : addressObj.building,
                 postalCode : addressObj.pincode,
                 state : addressObj.state,
                 phoneNumber : addressObj.number,
                 alternateNumber : addressObj.alternateNumber,
             };
           fireBaseData.refUser().child($scope.user.uid).child("address").push(obj);
           $scope.isDivShow = false;
       };
       $scope.goEditAddress = function (selectedAddress) {
         $scope.addressObj = selectedAddress;
         $scope.edit = true;
         console.log("$scope.addressObj:" + angular.toJson($scope.addressObj,''));
       };
       $scope.editAddress = function (addressObj) {
           var obj = {
                 name : addressObj.name,
                 city : addressObj.city,
                 area : addressObj.area,
                 building : addressObj.building,
                 postalCode : addressObj.pincode,
                 state : addressObj.state,
                 phoneNumber : addressObj.number,
                 alternateNumber : addressObj.alternateNumber,
             };
           var addressRef = firebase.database().ref().child('users/'+$scope.user.uid + '/address/' + $scope.addressObj.$id).update(obj);
                console.log("addressRef :" + angular.toJson(addressRef,' '));
                $scope.isDivShow = false;
       };
      $scope.close =function(){
          $scope.isDivShow = false;
      }
      $scope.selectAddress = function (selectedAddress) {
            console.log("selectedAddress : " + angular.toJson(selectedAddress , ' '));
          SessionService.setUserDeliveryLocation(selectedAddress);

      };
  //  $scope.validate = function(addressObj) {
  //          // console.log("addressObj : " + angular.toJson(addressObj , ' '));
  //        if (!addressObj) {
  //          IonicPopupService.alert("Oops!" , "Please enter data.");
  //        }else if (CommonService.validateEmpty(addressObj.city, 'Oops!', 'Please enter city') === false) {
  //          return false;
  //        }else if (CommonService.validateEmpty(addressObj.area, 'Oops!', 'Please enter area') === false) {
  //          return false;
  //        } else if (CommonService.validateEmpty(addressObj.building, 'Oops!', 'Please enter building or society name') === false) {
  //          return false;
  //        }else if (CommonService.validateEmpty(addressObj.pincode, 'Oops!', 'Please enter pincode') === false) {
  //          return false;
  //        } else if (CommonService.validateEmpty(addressObj.state, 'Oops!', 'Please enter state') === false) {
  //          return false;
  //        }else if (CommonService.validateEmpty(addressObj.name, 'Oops!', 'Please enter name') === false) {
  //          return false;
  //        } else if (CommonService.validateEmpty(addressObj.number, 'Oops!', 'Please enter phone number') === false) {
  //          return false;
  //        }
  //      };
  $scope.goAddress= function() {
    $state.go('usercheckout');
  }
  $scope.goOrderSummary= function(selectedProduct) {
       console.log("selectedProduct..."+ angular.toJson(selectedProduct));
        SessionService.setUserProduct(selectedProduct);
        console.log('selectedProduct.$id : ' + selectedProduct.$id);
      $state.go('ordersummary',{'selected_ProductOrderSummary_id':selectedProduct.$id});
  };
    $scope.isAddress = true;
    $scope.isOrder = false;
    $scope.showorder= function () {
        $scope.isAddress = false;
        $scope.isOrder = true;
    };
    $scope.showAddress = function () {
      $scope.isOrder = false;
      $scope.isAddress = true;
    }
 var user = SessionService.getUser();
console.log("user : " + angular.toJson(user,' '));
$scope.selectedProId = $stateParams.selected_buyProduct_id;
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
});
