'use strict';

/* Services */


angular.module('picsServices', ['ngResource']).
factory('Flickr', function($resource) {

	return $resource('/pics/flickr', {}, {
		query: {
			method: 'GET'
		}
	});
});