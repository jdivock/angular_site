var Flickr = require("flickrapi"),
	flickrOptions = {
		key: process.env.FLICKR_KEY,
		secret: process.env.FLICKR_SECRET,
		user_ud: process.env.FLICKR_USER_ID,
		access_token: process.env.FLICKR_ACCESS_TOKEN,
		access_token_secret: process.env.FLICKR_ACCESS_TOKEN_SECRET
	};


exports.getFlickrPhotos = function(req, res) {
	Flickr.authenticate(flickrOptions, function(error, flickr) {
		// we can now use "flickr" as our API object
		console.log('flickr options', flickr);

		flickr.photos.search({
			user_id: flickr.options.user_ud,
			page: 1,
			per_page: 10
		}, function(err, result) {

			console.log('err', err);
			// console.log('result', result);
			res.send(result);
		});


	});
}