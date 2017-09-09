angular.module('aspirantfashion')
.service('SessionService', [function SessionFunction($rootScope) {

  var Session = {
    user: null,
    getUser: function() {
      Session.user = localStorage.getItem("user");
      return JSON.parse(Session.user);
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
