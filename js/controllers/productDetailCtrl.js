angular.module('aspirantfashion')
.controller('productDetailCtrl', function($scope,$state,$stateParams,$rootScope,$uibModal,$firebaseObject,$firebaseArray,sharedCartService,SessionService) {
$scope.selectedProId = $stateParams.selected_product_id;
// console.log("$scope.selectedProId"+ $scope.selectedProId);
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $scope.user=user; //Saves data to user_info
    $scope.loadFavourite();
}
});
$scope.loadyoumaylikeproudcts = function (id) {
        var youmaylikeproudctsRef = firebase.database().ref('product').orderByChild('subcategory').equalTo(id).limitToFirst(3);
        var youmaylikeproudctsObj = $firebaseArray(youmaylikeproudctsRef);
        youmaylikeproudctsObj.$loaded()
          .then(function (response) {
            $scope.youmaylikeproudctsData = response;
          });
  };
$scope.loadSelectedProd = function () {
var ref = firebase.database().ref('product/' + $scope.selectedProId);
ref.once("value", function(snapshot) {
  $scope.selectedProductData = snapshot.val();
  $scope.loadyoumaylikeproudcts($scope.selectedProductData.subcategory);
  var user = SessionService.getUser();
  $scope.selectedProductData.$id = snapshot.key;
  var viewRecentlyProdObj = snapshot.val();
   viewRecentlyProdObj.productId = snapshot.key;
  var loadRecentlyViewprod = firebase.database().ref('users').child(user.uid).child('productsviewrecently').orderByChild('productId').equalTo($scope.selectedProductData.$id).limitToLast(3);
  loadRecentlyViewprodObj = $firebaseArray(loadRecentlyViewprod);
      loadRecentlyViewprodObj.$loaded()
      .then(function (response) {
            if (!!response && response.length<1){
              firebase.database().ref('users').child(user.uid).child('productsviewrecently').push(viewRecentlyProdObj);
            } else {
            console.log("item is already in recently view");
            }
        });

});
};
$scope.loadSelectedProd();
$scope.loadviewRecentlyProd = function () {
    var user = SessionService.getUser();
        var loadViewRecentlyProdRef = firebase.database().ref('users').child(user.uid).child('productsviewrecently').limitToLast(3);
        ViewRecentlyProdObj = $firebaseArray(loadViewRecentlyProdRef);
             ViewRecentlyProdObj.$loaded()
               .then(function (response) {
                 $scope.ViewRecentlyProdData = response;
               });
       };
  $scope.loadviewRecentlyProd();
var user = firebase.auth().currentUser;
$scope.addToCart = function(item){
  if (user) {
    sharedCartService.add(item);
  } else {
    $rootScope.modalInstance = $uibModal.open({
      templateUrl: 'templates/signIn.html',
  });
  }
 };
    ///for favourite :
    $scope.loadFavourite = function () {
      var refFavoriteData = firebase.database().ref('favourits/' + $scope.user.uid + '/' +  $scope.selectedProId);
          var favouriteData = $firebaseObject(refFavoriteData);
          favouriteData.$loaded().then(function(resp) {
            $scope.favouritProduct = resp;
              if (!!$scope.favouritProduct.productId) {
                $scope.isFavourite = true;
            } else {
                $scope.isFavourite = false;
            }

          });
    };
     $scope.setFavourite = function (productDetail) {
       if(user){
         $scope.productDetail = productDetail;
           var productObj = {
             productName: $scope.productDetail.name,
             productId: $scope.productDetail.$id,
             image : $scope.productDetail.image,
             categoryId: $scope.productDetail.category,
             subcategoryId : $scope.productDetail.subcategory,
             brand: $scope.productDetail.brand,
             price : $scope.productDetail.price,
             userId : $scope.user.uid
           };
           var userObj = {
             name: $scope.user.displayName,
             email: $scope.user.email,
             userId : $scope.user.uid,
             image: $scope.user.photoURL
           };

         firebase.database().ref().child('product/' + $scope.productDetail.$id + '/favouriteBy/' + $scope.user.uid).set(userObj).then(function (response) {
                console.log("favourite added successfully at product...");
                firebase.database().ref().child('favourits/' + $scope.user.uid + '/' + $scope.productDetail.$id).set(productObj).then(function (response) {
                 console.log("favourite added successfully at favourites...");
                 $scope.loadFavourite();
                }).catch(function (error) {
                  console.log('Error at set favourite : ' + error);
                });
         }).catch(function (error) {
           console.log('Error at set favourite : ' + error);
         });
       }else{
           $rootScope.modalInstance = $uibModal.open({
             templateUrl: 'templates/signIn.html',
         });
       }
     };
     $scope.deletefavourite = function(productId) {
       if (user) {
         console.log("productId  : " + productId);
           var deleteFevoriteRef = firebase.database().ref('favourits/' + $scope.user.uid + '/' + productId);
           var deleteFevoriteProductRef = firebase.database().ref('product/' + productId + '/favouriteBy/' + $scope.user.uid);
           deleteFevoriteRef.remove().then(function (response) {
             deleteFevoriteProductRef.remove().then(function (response) {
               $scope.loadFavourite();
             });
           });
       } else {
         $rootScope.modalInstance = $uibModal.open({
           templateUrl: 'templates/signIn.html',
       });
       }
   };

     $scope.loadlikeProduct =function (id) {
      $scope.selectedProductData = '';
       selectedProductRef = firebase.database().ref('product/' + id);
           productObj = $firebaseObject(selectedProductRef);
           productObj.$loaded()
             .then(function (response) {
               $scope.selectedProductData = response;
                 console.log("$scope.selectedProductData"+ angular.toJson($scope.selectedProductData,' '));
             });
           };
       $scope.loadrecentlyProduct =function (id) {
        $scope.selectedProductData = '';
         selectedProductRef = firebase.database().ref('users/' + $scope.user.uid + '/productsviewrecently/'+ id);
             productObj = $firebaseObject(selectedProductRef);
             productObj.$loaded()
               .then(function (response) {
                 $scope.selectedProductData = response;
                   console.log("$scope.selectedProductData"+ angular.toJson($scope.selectedProductData,' '));
               });
             };
   var geocoder;
   var geocoder = new google.maps.Geocoder();
   $scope.userCity = '';
   $scope.uaerPostalCode = '';
   $scope.uaerCountry = '';
   $scope.userPostalCode = '';
   // $scope.userAddressByZip={};
   $scope.addPinCode = function (pincode) {
    //  console.log("pincode : " + pincode);
         $scope.userAddress = ''
         $scope.pincode = pincode;
         var zipCode = pincode;
         var country = 'India';
         geocoder.geocode({ 'address': pincode + ',' + country }, function (results, status) {
           $scope.address = results[0].formatted_address;
           // console.log("$scope.address : " + $scope.address);
           // console.log("result : " + angular.toJson(results[0].formatted_address , ' '));
           // console.log("result : " + angular.toJson(results , ' '));
           if (!!results[0]) {

            //find country name
                for (var i=0; i<results[0].address_components.length; i++) {
               for (var b=0;b<results[0].address_components[i].types.length;b++) {

               //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate

                     if (results[0].address_components[i].types[b] == "administrative_area_level_2") {
                         //this is the object you are looking for
                         $scope.city= results[0].address_components[i];
                         break;
                     }
                   if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                       //this is the object you are looking for
                       $scope.state= results[0].address_components[i];
                       break;
                   }
                   if (results[0].address_components[i].types[b] == "country") {
                       //this is the object you are looking for
                       $scope.county= results[0].address_components[i];
                       break;
                   }
                   if (results[0].address_components[i].types[b] == "postal_code") {
                       //this is the object you are looking for
                       $scope.postalCode= results[0].address_components[i];
                       break;
                   }
               }
           }
           //full address data

             $scope.userCity = $scope.city.long_name;
             $scope.userState = $scope.state.long_name;
             $scope.userCountry = $scope.county.long_name;
             $scope.userPostalCode = $scope.postalCode.long_name;
             $scope.userAddressByZip = {
                       city : $scope.city.long_name,
                       state: $scope.state.long_name,
                       country : $scope.county.long_name,
                       postalCode : $scope.postalCode.long_name
               }
               SessionService.setUserLocation($scope.userAddressByZip);
               $scope.getuserLocation = SessionService.getUserLocation();
              //  console.log('$scope.getuserLocation' + angular.toJson($scope.getuserLocation, ' '));
              //  $scope.modal.hide();
              $scope.isEnterPin = false;
                $scope.isSelectLocation = true;


             // console.log("userAddressByZip : " + angular.toJson($scope.userAddressByZip , ' '));
             // console.log("user current addres  : " + $scope.city.long_name + " " + $scope.state.long_name + " " + $scope.county.long_name + " " + $scope.postalCode.long_name);
           } else {

             console.log("no result found");
           }

       });
   };
 // $scope.userAddress = {};
 // $scope.userAddressArray=[];
 $scope.addressByLocation = function () {
         $scope.userAddressByZip = '';
         $scope.isEnterPin = false;
         $scope.isSelectLocation = true;
     var geocoder;
     var geocoder = new google.maps.Geocoder();
     // console.log("this is calling...");
 //      if (navigator.geolocation) {
 //     navigator.geolocation.getCurrentPosition(function (position) {
 //           console.log("position : " + angular.toJson(position , ' '));
 //             mysrclat = position.coords.latitude;
 //             mysrclong = position.coords.longitude;
 //         console.log("mysrclat : " + mysrclat);
 //         console.log("mysrclong : " + mysrclong);
 //     });
 //
 // }

       if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
     }
       //Get the latitude and the longitude;
       function successFunction(position) {
          //  console.log("position data at success : " + angular.toJson(position , ' '));
           var lat = position.coords.latitude;
           var lng = position.coords.longitude;
           codeLatLng(lat, lng)
       }

       function errorFunction(status){

           console.log("error at geocoder ");
       }

               function codeLatLng(lat, lng) {
               // console.log("yes comes here at last fun....");
               var latlng = new google.maps.LatLng(lat, lng);
               geocoder.geocode({'latLng': latlng}, function(results, status) {
                 if (status == google.maps.GeocoderStatus.OK) {
                 // console.log("results[0].formatted_address : " + angular.toJson(results[0].formatted_address , ' '));
                 // console.log("result of geocode : " + angular.toJson(results , ' '))
                   if (results[1]) {
                    //formatted address
                   // console.log("results[0].formatted_address : " + angular.toJson(results[0].formatted_address , ' '));
                   //find country name
                        for (var i=0; i<results[0].address_components.length; i++) {
                       for (var b=0;b<results[0].address_components[i].types.length;b++) {

                       //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate

                             if (results[0].address_components[i].types[b] == "administrative_area_level_2") {
                                 //this is the object you are looking for
                                 $scope.city= results[0].address_components[i];
                                 break;
                             }
                           if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                               //this is the object you are looking for
                               $scope.state= results[0].address_components[i];
                               break;
                           }
                           if (results[0].address_components[i].types[b] == "country") {
                               //this is the object you are looking for
                               $scope.county= results[0].address_components[i];
                               break;
                           }
                           if (results[0].address_components[i].types[b] == "postal_code") {
                               //this is the object you are looking for
                               $scope.postalCode= results[0].address_components[i];
                               break;
                           }
                       }
                   }
                   //full address data

                     $scope.userAddress = {
                               city : $scope.city.long_name,
                               state: $scope.state.long_name,
                               country : $scope.county.long_name,
                               postalCode : $scope.postalCode.long_name
                       }
                         SessionService.setUserLocation($scope.userAddress);
                         $scope.getuserLocation = SessionService.getUserLocation();
                        //  console.log('$scope.getuserLocation' + angular.toJson($scope.getuserLocation, ' '));
                     // $scope.userAddressArray.push($scope.userAddress);
                    //  $scope.modal.hide();
                     // console.log("$scope.userAddressArray : " +angular.toJson( $scope.userAddressArray , ' '));
                     // console.log("userAddress : " + angular.toJson($scope.userAddress , ' '));
                     // console.log("user current addres  : " + $scope.city.long_name + " " + $scope.state.long_name + " " + $scope.county.long_name + " " + $scope.postalCode.long_name);

                   } else {
                     console.log("no result found");
                   }
                 } else {
                   console.log("Geocoder failed due to: : " + angular.toJson(status , ' '));
                 }
               });
             }
     };
     $scope.addressByLocation();
     $scope.addPinCodeShow = function () {
       $scope.isEnterPin = true;
       $scope.isSelectLocation = false;
     };

     $scope.goForCheckout = function (selectedProduct) {
       if (user) {
         sharedCartService.add(selectedProduct);
        //  SessionService.setUserProduct(selectedProduct);
        //  console.log('selectedProduct.$id : ' + selectedProduct.$id);
       $state.go('checkoutwithbuy',{'selected_buyProduct_id':selectedProduct.$id});
       } else {
         $rootScope.modalInstance = $uibModal.open({
           templateUrl: 'templates/signIn.html',
       });
       }
     };
});
