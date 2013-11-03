"use strict";angular.module("angularSiteApp",["ui.bootstrap","multipostServices","picsServices"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/home.html",controller:"MainCtrl"}).when("/blag",{templateUrl:"views/blag.html"}).when("/multipost",{templateUrl:"views/multipost.html",controller:"MultipostCtrl"}).when("/pics",{templateUrl:"views/pics.html",controller:"PicsCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("angularSiteApp").controller("MainCtrl",["$scope",function(){}]),angular.module("angularSiteApp").controller("MultipostCtrl",["$scope","PostSession","Notebooks","Tumblrs",function(a,b,c,d){a.postSession=b.query(function(a){console.log("SESSION"),console.log(a)}),a.notebooks=c.query(function(a){console.log("NOTEBOOKS"),console.log(a)}),a.tumblrs=d.query(function(a){console.log("Tumblrs"),console.log(a)}),a.multipostSave=function(){a.postSession.$save(function(){a.postSession=b.query(),$.pnotify({title:"Success!",text:"Post Successfully Created.",type:"success"})})}}]),angular.module("angularSiteApp").controller("PicsCtrl",["$scope","Flickr",function(a,b){function c(){b.query({per_page:5,page:a.page++},function(b){a.pics?a.pics.photos.photo=a.pics.photos.photo.concat(b.photos.photo):a.pics=b})}a.page=1,c(),a.$watch("pics.photos.photo",function(a){var b;if(a)for(b=a.length-3;b<a.length;b++)a[b].active&&c()},!0)}]),angular.module("multipostServices",["ngResource"]).factory("PostSession",["$resource",function(a){return a("/multipost/post",{},{query:{method:"GET",isArray:!1}})}]).factory("Notebooks",["$resource",function(a){return a("/multipost/notebooks",{},{query:{method:"GET",isArray:!0}})}]).factory("Tumblrs",["$resource",function(a){return a("/multipost/blogs",{},{query:{method:"GET",isArray:!0}})}]),angular.module("picsServices",["ngResource"]).factory("Flickr",["$resource",function(a){return a("http://api.flickr.com/services/rest/",{method:"flickr.photos.search",api_key:"3a947c1b81460ce890dfd71b32ce0c85",user_id:"8978912@N07",format:"json",jsoncallback:"JSON_CALLBACK"},{query:{method:"JSONP"}})}]).config(["$httpProvider",function(a){delete a.defaults.headers.common["X-Requested-With"]}]);