define('helloDire', function() {
	return function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/directives/hello.html',
			scope: {
				checking: '='
			},
			controller: function($scope) {
				console.log($scope.checking);
			}
		}
	}
});