angular.module('aspirantfashion')
.controller("homeCtrl", function($scope,$state,$rootScope,SessionService,$rootScope,$firebaseArray) {
  $(document).ready(function() {

    $(".owl-carousel").owlCarousel({
        navigation : true, // Show next and prev buttons
        paginationSpeed : 400,
        items : 1,
        itemsDesktop : false,
        itemsDesktopSmall : false,
        itemsTablet: false,
        autoplay:true,
        infinite: false,
        autoplayTimeout:4000,
        goToFirst: true,
        loop:true,
        itemsMobile : false
    });

  });
  // $scope.sliderData = {};
  // $scope.$watch('sliderData', function() {
  //       // alert('hey, myVar has changed!');
  //       console.log('tets : ');
  //         $(".owl-carousel").owlCarousel({
  //             navigation : true, // Show next and prev buttons
  //             paginationSpeed : 400,
  //             items : 1,
  //             itemsDesktop : false,
  //             itemsDesktopSmall : false,
  //             itemsTablet: false,
  //             autoplay:true,
  //             infinite: false,
  //             autoplayTimeout:4000,
  //             goToFirst: true,
  //             loop:true,
  //             itemsMobile : false
  //         });
  //   });

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
      $scope.loadSlider = function () {
        sliderDataRef = firebase.database().ref('slider');
            sliderDataObj = $firebaseArray(sliderDataRef);
            sliderDataObj.$loaded()
              .then(function (response) {
                $scope.sliderData = response;
                // $(".owl-carousel").owlCarousel({
                //     navigation : true, // Show next and prev buttons
                //     paginationSpeed : 400,
                //     items : 1,
                //     itemsDesktop : false,
                //     itemsDesktopSmall : false,
                //     itemsTablet: false,
                //     autoplay:true,
                //     infinite: false,
                //     autoplayTimeout:50000,
                //     goToFirst: true,
                //     loop:true,
                //     itemsMobile : false
                // });

            //  console.log("$scope.sliderData    : " + angular.toJson($scope.sliderData, ' '));
              });
      };
      $scope.goProductpage= function (selectedProId) {
        // console.log('its working'+selectedProId);
        $state.go('productdetails',{'selected_product_id':selectedProId});
      };
$scope.loadTrendingProducts();
$scope.loadSlider();
});
