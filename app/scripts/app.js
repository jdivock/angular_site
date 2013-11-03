'use strict';

angular.module('angularSiteApp', ['ui.bootstrap', 'multipostServices', 'picsServices'])
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
      .when('/pics', {
        templateUrl: 'views/pics.html',
        controller: 'PicsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
