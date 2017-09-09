angular.module('aspirantfashion')
.controller('productDetailCtrl', function($scope,$state,$stateParams,$firebaseObject,sharedCartService) {
$scope.selectedProId = $stateParams.selected_product_id;
// console.log("$scope.selectedProId"+ $scope.selectedProId);
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $scope.user=user; //Saves data to user_info
    $scope.loadFavourite();
}
});

$scope.loadSelectedProd = function () {
  selectedProductRef = firebase.database().ref('product/' + $scope.selectedProId);
      productObj = $firebaseObject(selectedProductRef);
      productObj.$loaded()
        .then(function (response) {
          $scope.selectedProductData = response;
            // console.log("$scope.selectedProductData"+ angular.toJson($scope.selectedProductData));
        });
};
$scope.loadSelectedProd();
$scope.addToCart = function(item){
// IonicPopupService.alert("Item added to cart");
// console.log("item : " + angular.toJson(item , ' '));
    sharedCartService.add(item);
 };

$scope.gohomepage= function () {
  $state.go('home');
};


    ///for favourite :
    $scope.loadFavourite = function () {
      var refFavoriteData = firebase.database().ref('favourits/' + $scope.user.uid + '/' +  $scope.selectedProId);
          var favouriteData = $firebaseObject(refFavoriteData);
          favouriteData.$loaded().then(function(resp) {
            $scope.favouritProduct = resp;
            // console.log("$scope.favouritProduct : " + angular.toJson($scope.favouritProduct , ''));
            if (!!$scope.favouritProduct.productId) {
                $scope.isFavourite = true;
                console.log("$scope.isFavourite true calling.. : " + $scope.isFavourite);
            } else {
                $scope.isFavourite = false;
                console.log("$scope.isFavourite false calling ... : " + $scope.isFavourite);
            }

          });
    };

     $scope.setFavourite = function (productDetail) {
         $scope.productDetail = productDetail;
            // console.log("productDetail : " + angular.toJson(productDetail , ' '));
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

     };
     $scope.deletefevorite = function(productId) {
       console.log("productId  : " + productId);
         var deleteFevoriteRef = firebase.database().ref('favourits/' + $scope.user.uid + '/' + productId);
         var deleteFevoriteProductRef = firebase.database().ref('product/' + productId + '/favouriteBy/' + $scope.user.uid);
         deleteFevoriteRef.remove().then(function (response) {
           deleteFevoriteProductRef.remove().then(function (response) {
             $scope.loadFavourite();
           });
         });
   };
});
