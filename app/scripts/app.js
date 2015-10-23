require.config({
	waitSeconds: 0,
	paths: {
	//	Vendor
		'angular': 'vendor/angular/angular.min',
		'angular-animate': 'vendor/angular-animate/angular-animate.min',
		'angular-route': 'vendor/angular-route/angular-route.min',
	//	Modules
		'hello': 'modules/hello',
	//	Controllers
		'helloCtrl': 'controllers/hello',
		'magazinesCtrl': 'controllers/magazines',
	//	Directives
		'helloDire': 'directives/hello',
		'sidemenuStructDire': 'directives/sidemenu-struct',
	//  Factories
		'magazinesFact': 'factories/magazines',
	//	Configs
		'httpProviderConf': 'configs/http-provider',
		'routeProviderConf': 'configs/route-provider'
	},
	shim: {
		'angular-animate': {deps: ['angular']},
		'angular-route': {deps: ['angular']},
		'hello': {deps: [
			'angular-route',
			'angular-animate'
		]}
	}
});

require(['hello']);