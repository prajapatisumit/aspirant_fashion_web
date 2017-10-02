angular.module('aspirantfashion')
 .controller("userCheckOutCtrl", function($scope,$state,$firebaseObject,$firebaseArray,fireBaseData,sharedCartService,SessionService) {
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
   });
