angular.module('aspirantfashion')
.factory('fireBaseData', function($firebase) {
	var ref = firebase.database().ref(),
    refCart = firebase.database().ref('cart'),
    refUser = firebase.database().ref('users'),
    refCategory = firebase.database().ref('category'),
		refSubCategory = firebase.database().ref('subcategory'),
    refOrder = firebase.database().ref('orders'),
    refFeatured = firebase.database().ref('featured'),
    refProduct = firebase.database().ref('product');
		refBrand = firebase.database().ref('brand');
		refShipping = firebase.database().ref('shipping rate');
		refSize = firebase.database().ref('size');

  return {
    ref: function() {
      return ref;
    },
    refCart: function() {
      return refCart;
    },
    refUser: function() {
      return refUser;
    },
    refCategory: function() {
      return refCategory;
    },
		refSubCategory: function() {
      return refSubCategory;
    },refBrand: function() {
      return refBrand;
    },
    refOrder: function() {
      return refOrder;
    },
    refFeatured: function() {
      return refFeatured;
    },
    refProduct: function() {
      return refProduct;
    },
		refShipping: function() {
      return refShipping;
    },
		refSize: function() {
      return refSize;
    }

  }
});
