'use strict';

/* Services */


angular.module('multipostServices', ['ngResource']).
factory('PostSession', function($resource) {

	return $resource('/multipost/post', {}, {
		query: {
			method: 'GET',
			isArray: false
		}
	});
}).
factory('Notebooks', function($resource) {

	return $resource('/multipost/notebooks', {}, {
		query: {
			method: 'GET',
			isArray: true
		}
	});
})
.factory('Tumblrs', function($resource) {

	return $resource('/multipost/blogs', {}, {
		query: {
			method: 'GET',
			isArray: true
		}
	});
});