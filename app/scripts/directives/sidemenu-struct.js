define('sidemenuStructDire', function() {

	var colorSchemes = {
		'black': ['#ffffff', '#000000', '#161616', '#242424'],
		'blue': ['#ffffff', '#05046b', '#021391', '#133dba'],
		'red': ['#ffffff', '#730a00', '#ab0016', '#ca0028'],
		'green': ['#ffffff', '#084d34', '#08724d', '#0c8a73']
	}

	var sidemenuLinks = [
		{'type': 'title', 'label': 'Find Us', 'icon': 'fa fa-facebook-home'},
		{'type': 'btn', 'label': 'Facebook', 'url': 'javascript:;', 'icon': 'fa fa-facebook-square'},
		{'type': 'btn', 'label': 'Google', 'url': 'javascript:;', 'icon': 'fa fa-google'},
		{'type': 'btn', 'label': 'Dropbox', 'url': 'javascript:;', 'icon': 'fa fa-dropbox'},
		{'type': 'btn', 'label': 'Instagram', 'url': 'javascript:;', 'icon': 'fa fa-instagram'},
		{'type': 'btn', 'label': 'Twitter', 'url': 'javascript:;', 'icon': 'fa fa-twitter-square'},
		{'type': 'btn', 'label': 'Github', 'url': 'javascript:;', 'icon': 'fa fa-github-square'}
	];

	return function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/directives/sidemenu-struct.html',
			transclude: true,
			scope: {
				mainColor: '=',
				topTitle: '='
			},
			controller: function($scope, $window) {
				var sidemenuOpened = false;
				var colorScheme = colorSchemes[$scope.mainColor];
				var adjustSidemenu = function() {
					var k = $window.innerWidth > 640 ? 0 : $scope.sidemenuTopHeight;
					angular.element(document.querySelector('.sidemenu-struct>.area-menu'))
						.css('height', ($window.innerHeight - k) + 'px');
					angular.element(document.querySelector('.sidemenu-struct>.area-site'))
						.css('margin-top', k + 'px');
					if (!k && sidemenuOpened) $scope.switchSidemenu();
				}
				$scope.sidemenuTopHeight = 44;
				$scope.colorScheme = colorScheme == undefined ? 
					colorSchemes['black'] : colorScheme;
				$scope.sidemenuLinks = sidemenuLinks;
				$scope.sidemenuAreaMenu = {
					'left': sidemenuOpened ? '0' : '-66%'
				}
				$scope.sidemenuOverlayer = {
					'display': sidemenuOpened ? 'block' : 'none'
				}
				$scope.switchSidemenu = function() {
					sidemenuOpened = !sidemenuOpened;
					var deslocate = sidemenuOpened ? '0' : '-66%';
					var overlayerDisplay = sidemenuOpened ? 'block' : 'none';
					var siteOverflow = sidemenuOpened ? 'hidden' : 'auto';
					angular.element(document.querySelector('.sidemenu-struct>.area-menu'))
						.css('left', deslocate);
					angular.element(document.querySelector('.sidemenu-struct>.overlayer'))
						.css('display', overlayerDisplay);
					angular.element(document.querySelector('body'))
						.css('overflow', siteOverflow);
				}
				angular.element($window).bind('resize', adjustSidemenu);
				adjustSidemenu();
			}
		}
	}
});