define('routeProviderConf', function() {
	return function($routeProvider) {
		$routeProvider
		    .when('/', {
		        templateUrl: 'templates/views/hello.html',
		        controller: 'helloCtrl'
		    })
		    .when('/magazines', {
		        templateUrl: 'templates/views/magazines.html',
		        controller: 'magazinesCtrl'
		    });
		}
});