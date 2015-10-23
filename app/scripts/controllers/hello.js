define('helloCtrl', function() {
	return function($scope, $timeout) {
		$scope.name = 'I am alive';
		$scope.helloStyle = {"background-color": "#eee"};
		$scope.loadingScreen = false;
		$timeout(function() { $scope.loadingScreen = true; }, 500);
	}
})