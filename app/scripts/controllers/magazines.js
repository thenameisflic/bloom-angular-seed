define('magazinesCtrl', function() {
	return function($scope, magazinesFact) {
		$scope.magazines = magazinesFact.all();
	}
});