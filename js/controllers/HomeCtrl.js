angular.module('aspirantfashion')
.controller("homeCtrl", function($scope,$state,$rootScope,SessionService,$rootScope,$firebaseArray) {
  // console.log('homepage is working');
      if (!!$rootScope.userLog) {
        $scope.user = $rootScope.userLog;
    console.log("$scope.user at rootscope " + angular.toJson($scope.user ,' '));
      }else {
        $rootScope.user = SessionService.getUser();
    //  console.log("$scope.user at at session: " + angular.toJson($scope.user , ' '));
      }
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          $scope.user_info=user; //Saves data to user_info
          // console.log("scope.user_info at home controller : " + angular.toJson($scope.user_info , ' '));
          $scope.get_total= function() {
            var total_qty=0;
            for (var i = 0; i < sharedCartService.cart_items.length; i++) {
              total_qty += sharedCartService.cart_items[i].item_qty;
            }
            return total_qty;
          };
        // }else if ($scope.user.isGuest === 'true') {
        //   $scope.user_info = $scope.user;
        //   $scope.get_total= function() {
        //     var total_qty=0;
        //     for (var i = 0; i < sharedCartService.cart_items.length; i++) {
        //       total_qty += sharedCartService.cart_items[i].item_qty;
        //     }
        //     return total_qty;
        //   };
          // console.log("$scope.user_info for guest : " + angular.toJson($scope.user_info , ' '));
        }else if (!!$rootScope.userLog) {
          $scope.user = $rootScope.userLog;
          $scope.get_total= function() {
            var total_qty=0;
            for (var i = 0; i < sharedCartService.cart_items.length; i++) {
              total_qty += sharedCartService.cart_items[i].item_qty;
            }
            return total_qty;
          };

        }else {

          // $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
          // $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
          //
          // $ionicHistory.nextViewOptions({
          //   historyRoot: true
          // });
          //
          // $rootScope.extras = false;
          // sharedUtils.hideLoading();
          // $state.go('tabsController.login', {}, {location: "replace"});

        }
      });
      $scope.loadTrendingProducts = function () {
        trendingDataRef = firebase.database().ref('trendingProducts').limitToFirst(4);
            sidebarDataObj = $firebaseArray(trendingDataRef);
            sidebarDataObj.$loaded()
              .then(function (response) {
                $scope.trendingData = response;
              // console.log("$scope.trendingData    : " + angular.toJson($scope.trendingData, ' '));
              });
      };
      $scope.loadMoreSellingProducts = function () {
        moresellingDataRef = firebase.database().ref('moresellingproducts').limitToLast(4);
            moresellingDataObj = $firebaseArray(moresellingDataRef);
            moresellingDataObj.$loaded()
              .then(function (response) {
                $scope.moresellingData = response;
              // console.log("$scope.trendingData    : " + angular.toJson($scope.trendingData, ' '));
              });
      };
      $scope.loadlatestproducts = function () {
        latestDataRef = firebase.database().ref('latestproducts').limitToFirst(4);
            latestDataObj = $firebaseArray(latestDataRef);
            latestDataObj.$loaded()
              .then(function (response) {
                $scope.latestData = response;
              });
      };
      $scope.loadDiscountedProducts = function () {
        discountedDataRef = firebase.database().ref('discountedproduct').limitToFirst(4);
          discountedDataObj = $firebaseArray(discountedDataRef);
                discountedDataObj.$loaded()
              .then(function (response) {
                $scope.discountedData = response;
              });
      };
      $scope.loadShopByPriceProducts = function () {
        ShopByPriceDataRef = firebase.database().ref('shopbyprice').limitToLast(4);
          ShopByPriceDataObj = $firebaseArray(ShopByPriceDataRef);
            ShopByPriceDataObj.$loaded()
              .then(function (response) {
                $scope.ShopByPriceData = response;
              });
      };
      $scope.loadSlider = function () {
        sliderDataRef = firebase.database().ref('slider');
            sliderDataObj = $firebaseArray(sliderDataRef);
            sliderDataObj.$loaded()
              .then(function (response) {
                $scope.sliderData = response;
              });
      };
      $scope.loadCategory = function () {
        categoryRef = firebase.database().ref('category').limitToFirst(6);
            categoryObj = $firebaseArray(categoryRef);
            categoryObj.$loaded()
              .then(function (response) {
                $scope.categoryData = response;
                // console.log("$scope.categoryData    : " + angular.toJson($scope.categoryData, ' '));
                // for(var i=0;i<$scope.categoryData.length;i++) {
                //     $scope.categoryData[i].sub_category = $firebaseArray(firebase.database().ref('subcategory').orderByChild('categoryid')
                //         .equalTo($scope.categoryData[i].$id));
                // }
              });
      };
      $scope.goCategoryWiseAllproducts = function(categoryId){
          console.log('its working'+categoryId);
            $state.go('catProducts',{'category_id':categoryId});
      }

      $scope.goProductpage= function (selectedProId) {
        // console.log('its working'+selectedProId);
        $state.go('productdetails',{'selected_product_id':selectedProId});
      };
$scope.loadCategory();
$scope.loadTrendingProducts();
$scope.loadMoreSellingProducts();
$scope.loadlatestproducts();
$scope.loadDiscountedProducts();
$scope.loadShopByPriceProducts();
$scope.loadSlider();
});
