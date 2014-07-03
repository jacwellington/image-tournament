var imageTournamentControllers = angular.module('imageTournamentControllers', ['imageTournamentServices', 'ng', 'LocalStorageModule']);

imageTournamentControllers.controller('ContestCtrl', ['$scope', 'localStorageService', 'Contest', function ($scope, localStorageService, Contest) {

	// Get current round of images and pair them
	Contest.currentRound().success(function (data) {
		$scope.contest = data;
		var imagePairs = Contest.pairImages(data.images);
		Contest.prefillChosen(imagePairs);
		$scope.imagePairs = imagePairs;
		$scope.roundFinished = isRoundFinished(imagePairs);
	});

	// Returns true if the round is finished.
	// Searches through all image pair objects to find any that
	// do not have one of them chosen.
	function isRoundFinished(imagePairs){
		var allChosen = true;
		angular.forEach(imagePairs, function(imagePair){
			if (imagePair[0]["chosen"] !== "chosen" && imagePair[1]["chosen"] !== "chosen") {
				allChosen = false;
			}
		});
		return allChosen;
	}

}]);

imageTournamentControllers.controller('ChoiceCtrl', ['$scope', '$routeParams', 'localStorageService', 'Contest', '$location', function ($scope, $routeParams, localStorageService, Contest, $location) {
	Contest.currentImages().success(function (data) {
		$scope.images = data;
		$scope.imagePairNumber = $routeParams.imagePair;
		var imagePairs = Contest.pairImages(data);
		Contest.prefillChosen(imagePairs);
		$scope.firstImage = imagePairs[$scope.imagePairNumber - 1][0].image;
		$scope.secondImage = imagePairs[$scope.imagePairNumber - 1][1].image;
		$scope.choose = function (number) {
			localStorageService.set($scope.imagePairNumber.toString(), number.toString());
			$location.url('/#/contest');

		};
	});
}]);
