define('hello', [
	'helloCtrl',
	'magazinesCtrl',
	'helloDire',
	'sidemenuStructDire',
	'magazinesFact',
	'httpProviderConf',
	'routeProviderConf'
], function(
	helloCtrl,
	magazinesCtrl,
	helloDire,
	sidemenuStructDire,
	magazinesFact,
	httpProviderConf,
	routeProviderConf
) {

	angular
		.module('hello', ['ngRoute', 'ngAnimate'])
		.config(httpProviderConf)
		.config(routeProviderConf)
		.factory('magazinesFact', magazinesFact)
		.directive('hello', helloDire)
		.directive('sidemenuStruct', sidemenuStructDire)
		.controller('helloCtrl', helloCtrl)
		.controller('magazinesCtrl', magazinesCtrl);

	angular.bootstrap(document, ['hello']);	
	
});