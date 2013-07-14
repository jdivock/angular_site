"use strict";angular.module("angularSiteApp",["$strap.directives","multipostServices"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/home.html",controller:"MainCtrl"}).when("/blag",{templateUrl:"views/blag.html"}).when("/multipost",{templateUrl:"views/multipost.html",controller:"MultipostCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("angularSiteApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("angularSiteApp").controller("MultipostCtrl",["$scope","PostSession","Notebooks","Tumblrs",function(a,b,c,d){a.postSession=b.query(function(a){console.log("SESSION"),console.log(a)}),a.notebooks=c.query(function(a){console.log("NOTEBOOKS"),console.log(a)}),a.tumblrs=d.query(function(a){console.log("Tumblrs"),console.log(a)}),a.multipostSave=function(){a.postSession.$save()}}]),angular.module("multipostServices",["ngResource"]).factory("PostSession",["$resource",function(a){return a("/multipost/post",{},{query:{method:"GET",isArray:!1}})}]).factory("Notebooks",["$resource",function(a){return a("/multipost/notebooks",{},{query:{method:"GET",isArray:!0}})}]).factory("Tumblrs",["$resource",function(a){return a("/multipost/blogs",{},{query:{method:"GET",isArray:!0}})}]);