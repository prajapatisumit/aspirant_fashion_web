angular.module('aspirantfashion')
 .controller("userCheckOutCtrl", function($scope,$state,$firebaseObject,sharedCartService) {
   $scope.goCartPage= function () {
     $state.go('cartdetails');
   };
   $scope.goOrderReviewPage= function () {
     $state.go('orderreview');
   };
   firebase.auth().onAuthStateChanged(function(user) {
         if (user) {
           $scope.user = user;
            console.log("$scope.user "+ angular.toJson($scope.user , ' '));
        selectedCartRef = firebase.database().ref('cart/' + $scope.user.uid + '/shippingAddress');
                 cartObj = $firebaseObject(selectedCartRef);
                 cartObj.$loaded()
                   .then(function (response) {
                  $scope.userDataForaddress = response;
                console.log("$scope.userDataForaddress"+ angular.toJson($scope.userDataForaddress));
                   });
         }
       });
    $scope.saveUserdetail = function(userdata){
     console.log("userdata : " + angular.toJson(userdata , ' '));
     firebase.database().ref('cart/' + $scope.user.uid + '/shippingAddress').set({
       firstName: userdata.firstName,
       lastName: userdata.lastName,
       Street:userdata.Street,
       Address:userdata.Address,
       City:userdata.City,
       mobileNumber:userdata.mobileNumber,
       zip:userdata.zip,
       mobileNumber : userdata.mobileNumber,
       email : userdata.email
        });
        console.log("data updated successfully...");
   };
   });
