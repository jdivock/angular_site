'use strict';

angular.module('angularSiteApp')
	.controller('MainCtrl', function(){
		
	})
	.controller('HeaderCtrl', function($scope, $location) {
		$scope.isActive = function(viewLocation) {
			return viewLocation === $location.path();
		};
	});