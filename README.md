# Angular1-part4-Services

In part 3, we talked about controllers and some of the useful services that you could use with them. We also showed you how to inject dependencies into the controller. In this lesson, we're going to talk about services that you can create yourself. There's three types of services you could possibly use: a service, a factory, or a provider. For the most part, you can use them interchangeably, but it depends on what you need to do. A service is a contstructor and factories and providers are objects, essentially. Services and factories are nearly identical, functionality-wise, so who uses either almost exclusively depends on personal preference. I started out using services because that's what I learned at first, but now I lean towards factories. Why? I worked somewhere that used factories, so I got in the habit of using them. Providers, though, are a little more complicated. They can use all of the functionality of a factory, as well as give some more functionality to the Angular.config method, which we won't worry about until we start talking about `ui-router`, which is a ways off. Last question being, "why would I want to use a service?". It really comes down to just keeping things where they belong and not cluttering the controller. Think of services as a library of functions and values that you can call on when you need them, but you don't need them all the time, so it would be cleaner to store them somewhere else. Moral of the story, though, we'll show you what services and factories look like so you can pick your own preference on what looks/feels better for you.

Getting off that tangent, let's get down to it. let's copy/paste our index.html and app.js page to get back to where we were before. Test your search to make sure that you can see Luke's name and birth year. 

Let's start off by going into `app.js` and adding a service below the controller. Adding a service is almost identical to adding another controller, but instead of using the controller method, we're going to use the service method. Just like the controller method, it takes two arguments. The first argument is the name of the service, which in the case, we'll call `myFirstService`, and the second argument is the callback function that, just like the controller callback function, you can inject dependencies into. Now your `app.js` is going to look like this: 

```text
var app = angular.module('myFirstNgApp', []);

app.controller('myFirstController', function($scope, $http) {
  $scope.makeAPIcall = function(character) {
    $http.get('https://swapi.co/api/people/?search=' + character)
     .then(function(api_response) {
       console.log(api_response);
       $scope.results = api_response.data.results;
     });
  }
});

app.service('myFirstService', function() {
  
});
```

So, let's create an exportable value inside that service and then stick that value in the controller inside a scope variable so we can see it on the DOM. To do this, we just need to inject the name of the service into the controller's callback arguments, just like `$scope` and `$http`. Now that we injected it into the controller, we now have access to the values and the function inside `myFirstService`. Let's prove that by adding a value to the service. Inside the callback function, add: `this.firstValue = 2`. It's worth noting that for a value or a function to be available from outside the service, it needs to be attached to `this`. If we were to have `var firstValue = 2`, it would not be accessible by anything you injected the service into. Now, lets go back to the controller and add a scope variable called `$scope.serviceValue` and assign that to `myFirstService.firstValue`.

```text
var app = angular.module('myFirstNgApp', []);

app.controller('myFirstController', function($scope, $http, myFirstService) {
  $scope.makeAPIcall = function(character) {
    $http.get('https://swapi.co/api/people/?search=' + character)
     .then(function(api_response) {
       console.log(api_response);
       $scope.results = api_response.data.results;
     });
  }
  $scope.serviceValue = myFirstService.firstValue;
});

app.service('myFirstService', function() {
  this.firstValue = 2;
});
``` 
 After doing that, head back to `index.html` and add a div below all of our SWAPI stuff and add `{{serviceValue}}`.
```text
<!DOCTYPE html>
<html ng-app="myFirstNgApp">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body ng-controller="myFirstController">

    <input type="text" ng-model="character">
    <button ng-click="makeAPIcall(character)">Search</button>

    <div class="" ng-repeat="result in results">
      <p>Character name: {{result.name}}</p>
      <p>Birth year: {{result.birth_year}}</p>
    </div>

    <div class="">
      {{serviceValue}}
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.js" charset="utf-8"></script>
    <script src="app.js" charset="utf-8"></script>
  </body>
</html>
```
You'll see that when you save and refresh that now you'll see the value right on the DOM! That is essentially services in a nutshell, but let's show you a couple of other ways that we can clean up the controller by using a service. Let's go back to the `app.js` page and take a look at our controller. Wouldn't it be nice if we could clean up that API call a little bit? I agree. Let's do it. Down in `myFirstService`, let's create a function inside there called `this.getCharacter` with an argument of `character` because need to pass that value from the input element to the controller to the service and write this in there: `return $http.get('https://swapi.co/api/people/?search=' + character)`. So, we're telling the service that when a controller calls `this.getCharacter`, return the promise from that http request to the controller, so the controller can deal with the response. 

```text
app.service('myFirstService', function() {
  this.getCharacter = function(character){
    return $http.get('https://swapi.co/api/people/?search=' + character);
  }
});
```
Let's go back to the controller and make this thing work. We already have the service injected, so we don't need to worry about that. Just because we don't need it anymore, just remove the `$scope.serviceValue` line. Inside `$scope.makeAPIcall`, replace `$http.get('https://swapi.co/api/people/?search=' + character)` with `myFirstService.getCharacter(character)`, then save/refresh. When you search and click the button, nothing happens...but why? So, open up your browser console and you'll see that there's an error `$http is not defined`. Ahhh, we never injected `$http` into the service. This is the error that you'll see if you ever forget to inject something somewhere. There are probably 4 or 5 error that you will commonly see when you're writing Angular. This is one of them. Take note of what it takes to fix these errors because you will probably see them again at some point. Let's fix this, though, by injecting `$http` into our service and try searching again after saving/refreshing. Here's what your `app.js` should look like:
```text
var app = angular.module('myFirstNgApp', []);

app.controller('myFirstController', function($scope, $http, myFirstService) {
  $scope.makeAPIcall = function(character) {
    myFirstService.getCharacter(character)
     .then(function(api_response) {
       console.log(api_response);
       $scope.results = api_response.data.results;
     });
  }
  $scope.serviceValue = myFirstService.firstValue;
});

app.service('myFirstService', function($http) {
  this.getCharacter = function(character){
    return $http.get('https://swapi.co/api/people/?search=' + character);
  }
});
```
