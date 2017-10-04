angular.module('aspirantfashion')
.service('SessionService', [function SessionFunction($rootScope) {

  var Session = {
    user: null,
    userProduct: null,
    getUser: function() {
      Session.user = localStorage.getItem("user");
      if(!!Session.user && Session.user !=="undefined")
        return JSON.parse(Session.user);
      else
        return "";
    },
    setUser: function(data) {
      Session.user = JSON.stringify(data);
      localStorage.setItem("user", Session.user);
    },
    getUserLocation: function() {
      Session.userLocation = localStorage.getItem("userLocation");
      return JSON.parse(Session.userLocation);
    },
    setUserLocation: function(data) {
      Session.userLocation = JSON.stringify(data);
      localStorage.setItem("userLocation", Session.userLocation);
    },
    getUserDeliveryLocation: function() {
      Session.userAddress = localStorage.getItem("userAddress");
      return JSON.parse(Session.userAddress);
    },
    setUserDeliveryLocation: function(data) {
      Session.userAddress = JSON.stringify(data);
      localStorage.setItem("userAddress", Session.userAddress);
    },
    getUserProduct: function() {
      Session.userProduct = localStorage.getItem("userProduct");
      return JSON.parse(Session.userProduct);
    },
    setUserProduct: function(data) {
      Session.userProduct = data;
      localStorage.setItem("userProduct", Session.userProduct);
    },
    isLoggedIn: function() {
      if (!!Session.getUser()) {
        return true;
      } else {
        return false;
      }
    },
    cache: {},
  };
  return Session;
}]);
