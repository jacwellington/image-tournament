var imageTournamentServices = angular.module('imageTournamentServices', []);

imageTournamentServices.factory('Contest', ['$http', function ($http) {
	return  {
		currentRound: function() {
		   return $http.get('/contest/current-round.json');
		},
		currentImages: function () {
		   return $http.get('/contest/current-images.json');
		},
		round: function () {
			return $http.get('/contest/round.json');
		},
		reset: function () {
			return $http.post('/contests/reset.json');
		},
		done: function () {
			return $http.post('/contests/done.json');
		},
		answer: function (flickrIds, roundNumber) {
			return $http.post('/contests/answer.json', { flick_ids: flickrIds, round: roundNumber });
		}
	};
}]);
