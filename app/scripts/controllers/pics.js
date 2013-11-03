'use strict';

angular.module('angularSiteApp')
	.controller('PicsCtrl', function($scope, Flickr) {

		function grabPics() {
			Flickr.query({
				per_page: 5,
				page: $scope.page++
			}, function(data) {
				if (!$scope.pics) {
					$scope.pics = data;
				} else {
					$scope.pics.photos.photo = $scope.pics.photos.photo.concat(data.photos.photo);
				}
			});
		}

		$scope.page = 1;
		grabPics();

		$scope.$watch('pics.photos.photo', function(newVal) {
			var i;
			if (newVal) {
				for (i = newVal.length - 3; i < newVal.length; i++) {
					if (newVal[i].active) {
						// Load more images
						grabPics();
					}
				}
			}
		}, true);

	});