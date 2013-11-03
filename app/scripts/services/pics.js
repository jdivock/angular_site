'use strict';

/* Services */


angular.module('picsServices', ['ngResource']).
factory('Flickr', function($resource) {

	return $resource('http://api.flickr.com/services/rest/', {
		method: 'flickr.photos.search',
		api_key: '3a947c1b81460ce890dfd71b32ce0c85',
		user_id: '8978912@N07',
		format: 'json',
		jsoncallback: 'JSON_CALLBACK'
	}, {
		query: {
			method: 'JSONP'
		}
	});


	// return $resource('/pics/flickr', {}, {
	// 	query: {
	// 		method: 'GET'
	// 	}
	// });
}).config(function($httpProvider) {
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});