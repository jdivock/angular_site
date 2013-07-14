'use strict';

angular.module('angularSiteApp', ['$strap.directives', 'multipostServices'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainCtrl'
      })
      .when('/blag',{
        templateUrl: 'views/blag.html'
      })
      .when('/multipost',{
        templateUrl: 'views/multipost.html',
        controller: 'MultipostCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
