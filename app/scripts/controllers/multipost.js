angular.module('angularSiteApp')
	.controller('MultipostCtrl', function($scope, PostSession, Notebooks, Tumblrs) {
	$scope.postSession = PostSession.query(function(data) {
		console.log("SESSION");
		console.log(data);
	});

	$scope.notebooks = Notebooks.query(function(data) {
		console.log("NOTEBOOKS");
		console.log(data);
	});

	$scope.tumblrs = Tumblrs.query(function(data) {
		console.log("Tumblrs");
		console.log(data);
	});

	$scope.multipostSave = function() {
		$scope.postSession.$save(function() {
			$scope.postSession = PostSession.query();
			$.pnotify({
				title: 'Success!',
				text: 'Post Successfully Created.',
				type: 'success'
			});
		});

	}
});