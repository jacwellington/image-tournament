var imageTournamentServices = angular.module('imageTournamentServices', ['LocalStorageModule']);

imageTournamentServices.factory('Contest', ['$http', 'localStorageService', function ($http, localStorageService) {
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
			return $http.post('/contest/reset.json');
		},
		done: function () {
			return $http.post('/contest/done.json');
		},
		answer: function (flickrIds, roundNumber) {
			return $http.post('/contest/answer.json', { flickr_ids: flickrIds, round: roundNumber });
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
		},
		// Prefill the image objects within imagePairs with chosen values
		// The image["chosen"] === "chosen" if the user chose that image, otherwise empty.
		prefillChosen: function (imagePairs){
			var i = 0;
			for (i = 0; i < imagePairs.length; i++) {
				var chosen = localStorageService.get((i+1).toString());
				imagePairs[i][0]["chosen"] = "";
				imagePairs[i][1]["chosen"] = "";
				if (chosen !== null) {
					imagePairs[i][0]["chosen"] = "not-chosen";
					imagePairs[i][1]["chosen"] = "not-chosen";
					imagePairs[i][chosen]["chosen"] = "chosen";
				}
			}
		}
	};
}]);
