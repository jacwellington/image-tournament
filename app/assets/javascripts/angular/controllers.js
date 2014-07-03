var imageTournamentControllers = angular.module('imageTournamentControllers', ['imageTournamentServices', 'ng', 'LocalStorageModule']);

imageTournamentControllers.controller('ContestCtrl', ['$scope', 'localStorageService', 'Contest', function ($scope, localStorageService, Contest) {

	// Get current round of images and pair them
	Contest.currentRound().success(function (data) {
		$scope.contest = data;
		var imagePairs = Contest.pairImages(data.images);
		prefillChosen(imagePairs);
		$scope.imagePairs = imagePairs;
	});

	// Prefill the image objects within imagePairs with chosen values
	// The image["chosen"] === "chosen" if the user chose that image, otherwise empty.
	function prefillChosen(imagePairs){
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

}]);

imageTournamentControllers.controller('ChoiceCtrl', ['$scope', '$routeParams', 'localStorageService', 'Contest', '$location', function ($scope, $routeParams, localStorageService, Contest, $location) {
	Contest.currentImages().success(function (data) {
		$scope.images = data;
		$scope.imagePairNumber = $routeParams.imagePair;
		var imagePairs = Contest.pairImages(data);
		$scope.firstImage = imagePairs[$scope.imagePairNumber - 1][0].image;
		$scope.secondImage = imagePairs[$scope.imagePairNumber - 1][1].image;
		$scope.choose = function (number) {
			localStorageService.set($scope.imagePairNumber.toString(), number.toString());
			$location.url('/#/contest');

		};
	});
}]);
