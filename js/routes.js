angular.module('aspirantfashion')
.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
  $stateProvider
  .state('home', {
  url: '/home',
  templateUrl: 'templates/home.html',
  controller: 'homeCtrl'
})
.state('signup', {
  url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
})
.state('products', {
    url: '/products?:subcategory_id:subcategoryId',
      templateUrl: 'templates/products.html',
      controller: 'productCtrl'
})
.state('catProducts', {
      url: '/products?:category_id:categoryId',
      templateUrl: 'templates/products.html',
      controller: 'productCtrl'
})

.state('productdetails', {
    url: '/productdetails?:selected_product_id:productId',
      templateUrl: 'templates/productdetails.html',
      controller: 'productDetailCtrl'
})
.state('cartdetails', {
    url: '/cartdetails',
      templateUrl: 'templates/cartdetails.html',
      controller: 'cartDetailCtrl'
})
.state('orderdetails', {
    url: '/orderdetails',
      templateUrl: 'templates/orderdetails.html',
      controller: 'orderDetailCtrl'
})
.state('userWishlist', {
    url: '/userWishlist',
      templateUrl: 'templates/userwishlist.html',
      controller: 'userWishListCtrl'
})
.state('useraccount', {
    url: '/useraccount',
      templateUrl: 'templates/useraccount.html',
      controller: 'userAccountCtrl'
})
.state('usercheckout', {
    url: '/usercheckout',
      templateUrl: 'templates/usercheckout.html',
      controller: 'userCheckOutCtrl'
})
.state('checkoutwithbuy', {
    url: '/usercheckout?:selected_buyProduct_id',
      templateUrl: 'templates/usercheckout.html',
      controller: 'userCheckOutCtrl'
})
// .state('orderreview', {
//     url: '/orderreview',
//       templateUrl: 'templates/orderreview.html',
//       controller: 'orderReviewCtrl'
// })
.state('ordersummary', {
    url: '/ordersummary?:selected_ProductOrderSummary_id',
      templateUrl: 'templates/ordersummary.html',
      controller: 'orderSummaryCtrl'
})
.state('emptycart', {
    url: '/emptycart',
      templateUrl: 'templates/emptycart.html',
      controller: 'emptyCartCtrl'
})
  // $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/home');
});
