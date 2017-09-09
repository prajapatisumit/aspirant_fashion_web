angular.module('aspirantfashion')
 .controller("productCtrl", function($scope,$stateParams,$firebaseArray,$state) {
     var allProducts = [];
  $scope.selectedId = $stateParams.subcategory_id;
  console.log("$scope.selectedId : " + $scope.selectedId);
  $scope.loadSidebar = function () {
    sidebarDataRef = firebase.database().ref('category');
        sidebarDataObj = $firebaseArray(sidebarDataRef);
        sidebarDataObj.$loaded()
          .then(function (response) {
            $scope.sidebarData = response;
          //  console.log("$scope.sidebarData    : " + angular.toJson($scope.sidebarData, ' '));
            for(var i=0;i<$scope.sidebarData.length;i++) {
                $scope.sidebarData[i].sub_category = $firebaseArray(firebase.database().ref('subcategory').orderByChild('categoryid')
                    .equalTo($scope.sidebarData[i].$id));
            }
          });
  };
$scope.loadSelectedProd = function () {
  categoryRef = firebase.database().ref('product').orderByChild('subcategory').equalTo($scope.selectedId);
      categoryObj = $firebaseArray(categoryRef);
      categoryObj.$loaded()
        .then(function (response) {
          $scope.categoryData = response;
          allProducts = response;
          //  console.log("$scope.categoryData    : " + angular.toJson($scope.categoryData, ' '));
        });
};
$scope.getProductById= function (subcategoryId) {
  //  console.log("subcategory_id : " + angular.toJson(subcategoryId,''));
    categoryDataRef = firebase.database().ref('product').orderByChild('subcategory').equalTo(subcategoryId);
    categoryDataObj = $firebaseArray(categoryDataRef);
        categoryDataObj.$loaded()
          .then(function (response) {
            $scope.categoryData = response;
          // console.log("$scope.categoryData    : " + angular.toJson($scope.categoryData, ' '));
          });
   $state.go('products', { 'subcategory_id': subcategoryId });
};

$scope.loadBrand = function () {
      brandDataRef = firebase.database().ref('brand').orderByChild('category');
      brandDataObj = $firebaseArray(brandDataRef);
      brandDataObj.$loaded()
        .then(function (response) {
          $scope.brandData = response;
          });
  };
 $scope.selection = [];
 $scope.selectedBrand = function (brandData) {
  var idx = $scope.selection.indexOf(brandData);
   // Is currently selected
   if (idx > -1) {
     $scope.selection.splice(idx, 1);
   }
   // Is newly selected
   else {
     $scope.selection.push(brandData);
      }
      var doFilter = true;
      if($scope.selection.length === 0) {
        var doFilter = false;
      }
   console.log("$scope.selection" + angular.toJson($scope.selection ,' '));
                var tempArray = [];

           for(var j=0; j<$scope.selection.length; j++){
              //  if(!!$scope.selection[j].is_selected && $scope.selection[j].is_selected === true) {
              //    doFilter = true;
                debugger
                   for(var i=0; i< allProducts.length; i++) {
                       if(allProducts[i].brand === $scope.selection[j].name) {
                         tempArray.push(allProducts[i]);
                       }
                  //  }
           }

    }
      if(doFilter === true) {
        $scope.categoryData = tempArray;
       }
       else {
        $scope.categoryData = allProducts;
          }
  };
  $scope.goHomepage= function () {
    $state.go('home');
  };
  $scope.goProductpage= function (selectedProId) {
    console.log('its working'+selectedProId);
    $state.go('productdetails',{'selected_product_id':selectedProId});
  };
$scope.loadBrand();
$scope.loadSelectedProd();
$scope.loadSidebar();
 });
