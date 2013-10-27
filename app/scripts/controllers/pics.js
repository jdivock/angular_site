'use strict';

angular.module('angularSiteApp')
  .controller('PicsCtrl', function($scope, Flickr) {
    
  	$scope.pics = Flickr.query(function(data) {
		console.log("pics");
		console.log(data);
	});
  });
