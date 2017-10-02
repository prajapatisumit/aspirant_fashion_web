function headerwithsearchbar() {

  return {
    // controllerAs: '$ctrl',
    templateUrl: 'js/directives/headerwithsearchbar/headerwithsearchbar.html',
    restrict: 'EA',
    replace: true,
    scope: {},
    controller: function($scope,$state,$firebaseArray,$uibModal,$stateParams,$log,sharedCartService,$firebaseObject,SessionService,fireBaseData) {
      $scope.goSignup= function () {
        console.log('its working');
        $state.go('signup');
      };
      $scope.goCartPage= function () {
        $state.go('cartdetails');
      };
      $scope.gohomepage= function () {
        console.log('its working');
        $state.go('home');
      };
      $scope.goOrderDetails= function () {
        $state.go('orderdetails');
      };
      $scope.goMyWishList= function () {
        $state.go('userWishlist');
      };
      $scope.goMyAccount= function () {
        $state.go('useraccount');
      };
      $scope.goProducts= function (subcategoryId) {
          // console.log("subcategory_id : " + angular.toJson(subcategoryId,''));
        $state.go('products', { 'subcategory_id': subcategoryId });
      };
      ////for check user login :
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          $scope.user = user;
          $scope.isLogin = true;
          //  console.log("user : " + angular.toJson(user , ' '));
          $scope.cart = sharedCartService.cart_items;
          // console.log("$scope.cart at header : " +$scope.cart);
          $scope.get_qty = function() {
            $scope.total_qty=0;
            $scope.total_amount=0;

            for (var i = 0; i < sharedCartService.cart_items.length; i++) {
              $scope.total_qty += sharedCartService.cart_items[i].item_qty;
              $scope.total_amount += (sharedCartService.cart_items[i].item_qty * sharedCartService.cart_items[i].item_price);
              $scope.total_weight += (sharedCartService.cart_items[i].item_qty * sharedCartService.cart_items[i].item_weight);

            }
            return $scope.total_qty;
          };
          //We dont need the else part because indexCtrl takes care of it
          loginUserRef = firebase.database().ref('users/' + $scope.user.uid);
                   loginObj = $firebaseObject(loginUserRef);
                   loginObj.$loaded()
                     .then(function (response) {
                    $scope.user = response;
                    //  console.log("$scope.userData :"+ angular.toJson(  $scope.user,' '));
                  });
        }

      });

      $scope.loadCategory = function () {
        categoryRef = firebase.database().ref('category');
            categoryObj = $firebaseArray(categoryRef);
            categoryObj.$loaded()
              .then(function (response) {
                $scope.categoryData = response;
                // console.log("$scope.categoryData    : " + angular.toJson($scope.categoryData, ' '));
                for(var i=0;i<$scope.categoryData.length;i++) {
                    $scope.categoryData[i].sub_category = $firebaseArray(firebase.database().ref('subcategory').orderByChild('categoryid')
                        .equalTo($scope.categoryData[i].$id));
                }
              });
      };
      $scope.loadCategory();
      $scope.logout = function() {
          firebase.auth().signOut().then(function() {
              $scope.isLogin = false;
              console.log('logout successfully');
              $state.reload();
          }, function(error) {
              console.log('error' + error);
          });
      };

    }
  };
}
angular.module('aspirantfashion').directive('headerwithsearchbar', headerwithsearchbar);
