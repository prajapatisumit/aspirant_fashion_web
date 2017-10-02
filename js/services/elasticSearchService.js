angular.module('aspirantfashion')
.factory('elasticSearchService', ['fireBaseData','$firebaseArray','$http','$q','$firebaseAuth',function(fireBaseData, $firebaseArray,$http, $q,$firebaseAuth){

  var uid ;// uid is temporary user_id
  var elasticSearch={}; // the main Object

  // Check if user already logged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // console.log("user : " + angular.toJson(user , ' '));
      uid= user.uid;
    }
  });

  //Elastic search search :
  elasticSearch.search = function() {
    console.log("elastic search .search service is calling....");
    var defer = $q.defer();
    // var url  = AppSettings.Url;
    // console.log("url.... : " + url);
    var url  = AppSettings.Url + '/api/users';//'api/users?user_id='+$firebaseAuth().$getAuth().uid;
    console.log("url new : " + url);
    var data = {};
    data.user_id = $firebaseAuth().$getAuth().uid;
    var headers = {
      'Content-Type': 'application/json'
    };
  console.log("url " + url);
    $http.get(url, {headers: headers}).
    then(function(response) {
      console.log("response : " + JSON.stringify(response));
        defer.resolve(response);
    });
// .error(function(error) {
//       console.log("Error at getAllUser in app : " + JSON.stringify(error));
//         defer.reject(error);
//     });

    return defer.promise;
  };

  return elasticSearch;
}]);
