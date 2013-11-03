'use strict';

angular.module('angularSiteApp')
	.controller('PicsCtrl', function($scope, Flickr) {

		$scope.pics = Flickr.query({
				per_page: 20
			},
			function(data) {
				console.log('pics', data);
			});
	});