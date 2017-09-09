angular.module('aspirantfashion')
.controller("homeCtrl", function($scope,$rootScope,SessionService,$rootScope) {
  console.log('homepage is working');
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

});
