var Evernote = require('evernote').Evernote,
	OAuth = require('oauth').OAuth,
	querystring = require('querystring'),
	async = require('async'),
	needle = require('needle'),
	Tumblr = require('tumblrwks');

exports.checkSessions = function(req, res) {

	// keys are signed and kept in cookie
	// console.log("CHECK SESSION:");
	// console.log("CHECK SESSION", req.cookies);


	res.send(JSON.stringify({
		evernote_session: req.cookies.evernote_oauth_access_token ? true : false,
		tumblr_session: req.cookies.tumblr_oauth_access_token ? true : false,
		sbwc_session: req.session.mybb_oauth_accesss_token ? true : false,
		tumblr_active: req.cookies.tumblr_active === "true" ? true : false,
		evernote_active: req.cookies.evernote_active === "true" ? true : false,
		guid: req.cookies.guid,
		tumblr: req.cookies.tumblr

	}));
};

exports.clearAll = function(req, res) {
	res.clearCookie('tumblr_oauth_access_token');
	res.clearCookie('evernote_oauth_access_token');

};

exports.cookies = function(req, res) {

	res.send(JSON.stringify({
		"posts": {
			evernote_active: req.cookies.evernote_active
		}
	}));
};

exports.getNotebooks = function(req, res) {

	var client = new Evernote.Client({
		token: req.cookies.evernote_oauth_access_token,
		sandbox: true
	});
	var selfReq = req;

	var note_store = client.getNoteStore();
	note_store.listNotebooks(req.cookies.evernote_oauth_access_token, function(notebooks) {
		// console.log("NOTEBOOKS");
		//console.log(notebooks);
		//console.log(req.cookies.guid);

		res.send(JSON.stringify(
			notebooks));
	})
};

exports.require_tumblr_login = function(req, res, next) {
	if (!req.cookies.tumblr_oauth_access_token) {
		//res.redirect("/multipost/tumblr_login?action=" + querystring.escape(req.originalUrl));
		res.send(JSON.stringify());
		return;
	}
	next();
};

exports.getBlogs = function(req, res) {
	// console.log("GETTING BLOGS");
	// console.log(req.cookies);

	tumblr = new Tumblr({
		consumerKey: process.env.TUMBLR_CONSUME_KEY,
		consumerSecret: process.env.TUMBLR_SECRET_KEY,
		accessToken: req.cookies.tumblr_oauth_access_token,
		accessSecret: req.cookies.tumblr_oauth_access_token_secret
	});

	tumblr.get('/user/info', function(data) {
		res.send(JSON.stringify(
			data.user.blogs
		));
	});
};



exports.require_evernote_login = function(req, res, next) {
	if (!req.cookies.evernote_oauth_access_token) {
		//res.redirect("/multipost/evernote_login?action=" + querystring.escape(req.originalUrl));
		res.send(JSON.stringify({
			"notebooks": null
		}));
		return;
	}
	next();
};

exports.evernote_login = function(req, res) {
	var evernoteClient = new Evernote.Client({
		consumerKey: process.env.EVERNOTE_CONSUME_KEY,
		consumerSecret: process.env.EVERNOTE_SECRET_KEY,
		sandbox: true
	});

	evernoteClient.getRequestToken('http://' + req.headers.host + '/multipost/evernote_cb', function(error, oauthToken, oauthTokenSecret, results) {
		req.session.evernote_oauth_token = oauthToken;
		req.session.evernote_oauth_token_secret = oauthTokenSecret;

		res.redirect(evernoteClient.getAuthorizeUrl(oauthToken));
	});
};

exports.evernote_cb = function(req, res) {
	var evernoteClient = new Evernote.Client({
		consumerKey: process.env.EVERNOTE_CONSUME_KEY,
		consumerSecret: process.env.EVERNOTE_SECRET_KEY,
		sandbox: true
	});

	evernoteClient.getAccessToken(req.session.evernote_oauth_token, req.session.evernote_oauth_token_secret, req.param('oauth_verifier'), function(error, oauthAccessToken, oauthAccessTokenSecret, results) {

		res.cookie('evernote_oauth_access_token', oauthAccessToken);
		res.cookie('evernote_oauth_access_token_secret', oauthAccessTokenSecret);


		res.cookie('evernote_active', true);

		res.redirect('/#/multipost');
	});
};

exports.tumblr_login = function(req, res) {

	var oa = new OAuth("http://www.tumblr.com/oauth/request_token",
		"http://www.tumblr.com/oauth/access_token",
		process.env.TUMBLR_CONSUME_KEY,
		process.env.TUMBLR_SECRET_KEY,
		"1.0",
		"http://" + req.headers.host + "/multipost/tumblr_cb" + (req.param('action') && req.param('action') != "" ? "?action=" + querystring.escape(req.param('action')) : ""),
		"HMAC-SHA1");

	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
		if (error) {
			console.log('error');
			console.log(error);
		} else {
			// store the tokens in the session
			req.session.oa = oa;
			req.session.tumblr_oauth_token = oauth_token;
			req.session.tumblr_oauth_token_secret = oauth_token_secret;

			// redirect the user to authorize the token
			res.redirect("http://www.tumblr.com/oauth/authorize?oauth_token=" + oauth_token);
		}
	})
};

// Callback for the authorization page
exports.tumblr_cb = function(req, res) {

	// get the OAuth access token with the 'oauth_verifier' that we received

	var oa = new OAuth(req.session.oa._reqUrl,
		req.session.oa._accessUrl,
		req.session.oa._consumerKey,
		req.session.oa._consumerSecret,
		req.session.oa._version,
		req.session.oa._authorize_callback,
		req.session.oa._signatureMethod);

	oa.getOAuthAccessToken(
		req.session.tumblr_oauth_token,
		req.session.tumblr_oauth_token_secret,
		req.param('oauth_verifier'), function(error, tumblr_oauth_access_token, tumblr_oauth_access_token_secret, results2) {

		if (error) {
			console.log('error', error);
		} else {
			console.log("TUMBLR OA SUCCESS");
			// store the access token in the session
			//req.session.tumblr_oauth_access_token = tumblr_oauth_access_token;
			//req.session.tumblr_oauth_access_token_secret = tumblr_oauth_access_token_secret;

			res.cookie('tumblr_oauth_access_token', tumblr_oauth_access_token);
			res.cookie('tumblr_oauth_access_token_secret', tumblr_oauth_access_token_secret);

			// console.log("SETTING TUMBLR TOKEN", req.cookie);

			//store in redis
			//redis.hset(TUMB_KEY, tumblr_oauth_access_token, tumblr_oauth_access_token_secret);

			res.cookie('tumblr_active', true);

			res.redirect('/#/multipost');

		}

	});

};

function postTumblr(req, res, cb) {

	// console.log("POSTIN TUMBLR");
	// console.log(req.cookies.tumblr_oauth_access_token);
	// console.log(req.cookies.tumblr_oauth_access_token_secret);

	tumblr = new Tumblr({
		consumerKey: process.env.TUMBLR_CONSUME_KEY,
		consumerSecret: process.env.TUMBLR_SECRET_KEY,
		accessToken: req.cookies.tumblr_oauth_access_token,
		accessSecret: req.cookies.tumblr_oauth_access_token_secret
	}, req.body.tumblr + ".tumblr.com");

	tumblr.post('/post', {
		type: 'text',
		title: req.body.title,
		body: req.body.post
	}, function(json) {
		console.log("TUMBLR POST COMPLETE", json);
		cb();
	});
};

function postEvernote(req, res, cb) {


	// console.log(req.body.guid);
	var client = new Evernote.Client({
		token: req.cookies.evernote_oauth_access_token,
		sandbox: true
	});
	var note_store = client.getNoteStore();

	var note = new Evernote.Note({
		title: req.body.title,
		guid: req.body.guid
	});

	note.content = '<?xml version="1.0" encoding="UTF-8"?>';
	note.content += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
	note.content += '<en-note>' + req.body.post;
	note.content += '</en-note>';

	note_store.createNote(req.cookies.evernote_oauth_access_token, note, function(note) {
		console.log("NOTE CREATED");
		//console.log(note);
		cb();
	});
};

exports.multiPostPosts = function(req, res) {


	// Don't need to enter a notebook, will go to default
	// req.evernote_notebook = req.session.notebooks[0];

	async.parallel([
		function(cb) {
			if (req.body.tumblr_active) {
				res.cookie('tumblr_active', true);
				res.cookie('tumblr', req.body.tumblr);
				postTumblr(req, res, cb);
			} else {
				res.cookie('tumblr_active', false);
				cb();
			}
		},
		function(cb) {
			if (req.body.evernote_active) {
				res.cookie('evernote_active', true);
				res.cookie('guid', req.body.guid);
				postEvernote(req, res, cb);
			} else {
				res.cookie('evernote_active', false);
				cb();
			}
		}
	], function() {
		res.send({
			"post": null
		})
	});

};

exports.sbwcPost = function(req, res) {

	/*req.body.threadId = 251;
	req.body.post.title = "test";
	req.body.post.post = "asdf";*/

	needle.post("http://southbrooklynwc.com/forum/newreply.php?ajax=1", {
		my_post_key: req.session.sbwcPostKey,
		//subject: req.body.post.title,
		//tid: req.body.post.threadId,
		//message: req.body.post.post,
		tid: 251,
		subject: "test",
		message: "asdf",
		action: 'do_newreply',
		method: 'quickreply'
	}, function(err, resp, body) {
		console.log(body);
		console.log(err);
		console.log(resp);
		res.send(body);
	})
};

exports.sbwcLogin = function(req, res) {

	//var username = req.body.sbwc.username;
	//var password = req.body.sbwc.login;

	username = 'jdivock';
	password = '####';

	needle.post('http://southbrooklynwc.com/forum/member.php', {
		action: 'do_login',
		quick_login: 1,
		quick_username: username,
		quick_password: password,
		submit: 'Login'
	}, function(err, resp, body) {
		if (err) {
			console.log("ERROR: ");
			console.log(err);
			res.send({
				'success': false
			});
		} else {
			console.log("RESP: ");
			console.log(body);

			//check response for positive login?
			var regex = /my_post_key\s=\s\"(\w*)\"/;
			var result = body.match(regex);

			var badLoginRegex = /You have entered an invalid username/;
			var resultBad = body.match(badLoginRegex);

			var captchaRegex = /captcha/;
			var captcha = body.match(captchaRegex);

			console.log("RESULTBAD: " + resultBad);

			console.log("CAPTHCHAD: " + captcha);

			if (resultBad) {
				res.send(JSON.stringify({
					'success': 'false',
					'code': "BAD_LOGIN"
				}));
			} else if (captcha) {
				res.send(JSON.stringify({
					'success': 'false',
					'code': "CAPTCHA"
				}));
			} else {
				req.session.sbwcPostKey = result[1];

				needle.post("http://southbrooklynwc.com/forum/newreply.php?ajax=1", {
					my_post_key: req.session.sbwcPostKey,
					//subject: req.body.post.title,
					//tid: req.body.post.threadId,
					//message: req.body.post.post,
					tid: 251,
					subject: "test",
					message: "asdf",
					action: 'do_newreply',
					method: 'quickreply'
				}, function(err, resp, body) {
					console.log(body);
					console.log(err);
					console.log(resp);
					res.send(body);
				})



				/*res.send(JSON.stringify({
					'success': 'true'
				}));*/
			}

		}
	});

};