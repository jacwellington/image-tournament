var imageTournamentApp = angular.module('imageTournamentApp', ['ngRoute', 'LocalStorageModule', 'imageTournamentServices', 'imageTournamentControllers']);

imageTournamentApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/contest', {
		templateUrl: 'partials/contest.html',
		controller: 'ContestCtrl'
	}).
		when('/choose/:imagePair', {
		templateUrl: 'partials/choose.html',
		controller: 'ChoiceCtrl'
	}).
		otherwise({
		redirectTo: '/contest'
	});
}]);
