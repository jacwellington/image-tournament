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
		},
		// Takes in an array of image objects and pairs them 2 by 2
		pairImages: function (images){
			var imagePairs = [];
			angular.forEach(images, function (image) {
				if (imagePairs.length === 0) {
					imagePairs.push([image]);
				} else if (imagePairs[imagePairs.length - 1].length === 1) {
					imagePairs[imagePairs.length - 1].push(image);
				} else {
					imagePairs.push([image]);
				}
			});
			return imagePairs;
		}
	};
}]);
