var express = require('express'),
	Cookies = require('cookies'),
	http = require('http'),
  flickr = require('./routes/flickr'),
	routes = require('./routes/multipost');

// var allowCrossDomain = function(req, res, next) {
// 	res.header('Access-Control-Allow-Origin', "*");
// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
// 	res.header('Access-Control-Allow-Headers', 'Content-Type');

// 	next();
// }

// Setup the Express.js server
var app = module.exports = express();
var server = require('http').createServer(app);

app.set('port', process.env.PORT || 3000);

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser(process.env.COOKIE_SECRET));
app.use(express.session({
	secret: process.env.SESSION_SECRET
}));
app.use(express.methodOverride());
// app.use(allowCrossDomain);
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
  app.use(express.static(__dirname + "/app"));
  app.use(express.static(__dirname + "/.tmp"));
}

// production only
if (app.get('env') === 'production') {
  // TODO
  app.use(express.static(__dirname + "/dist"));
};

// Routes

app.get('/pics/flickr', flickr.getFlickrPhotos);

// MULTI POST
app.get('/multipost/evernote_login', routes.evernote_login);
app.get('/multipost/evernote_cb', routes.evernote_cb);
app.get('/multipost/tumblr_login', routes.tumblr_login);
app.get('/multipost/tumblr_cb', routes.tumblr_cb);
// app.get('/multipost/getTumblrUserInfo', routes.getTumblrUserInfo);

app.get('/multipost/post', routes.checkSessions);
app.post('/multipost/post', routes.multiPostPosts);

app.get('/multipost/blogs', routes.require_tumblr_login, routes.getBlogs);

app.get('/multipost/notebooks', routes.require_evernote_login, routes.getNotebooks);

app.post('/multipost/sbwc', routes.sbwcLogin);
app.get('/multipost/sbwcPost', routes.sbwcPost);
app.get('/multipost/sbwc', routes.sbwcLogin);

app.get('/clear', routes.clearAll);
app.get('/cookies', routes.cookies);

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});