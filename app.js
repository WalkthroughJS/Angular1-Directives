var app = angular.module('myFirstNgApp', []);

app.controller('myFirstController', function($scope, $http, myFirstFactory) {
  $scope.makeAPIcall = function(character) {
    myFirstFactory.getCharacter(character)
     .then(function(api_response) {
       console.log(api_response);
       $scope.results = api_response.data.results;
     });
  }
});

app.service('myFirstService', function($http) {
  this.getCharacter = function(character){
    return $http.get('https://swapi.co/api/people/?search=' + character);
  }
});

app.factory('myFirstFactory', function($http) {
  return {
    getCharacter: function(character){
      return $http.get('https://swapi.co/api/people/?search=' + character);
    }
  }
});
