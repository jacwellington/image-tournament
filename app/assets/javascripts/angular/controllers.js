var imageTournamentControllers = angular.module('imageTournamentControllers', ['imageTournamentServices', 'ng', 'LocalStorageModule']);

imageTournamentControllers.controller('ContestCtrl', ['$scope', 'localStorageService', 'Contest', '$location', '$route', function ($scope, localStorageService, Contest, $location, $route) {

	// Get current round of images and pair them
	Contest.currentRound().success(function (data) {
		$scope.contest = data;
		if (data.images.length === 1) {
			setupLastRound(data);
		} else {
			setupNormalRound(data);
		}
		$scope.reset = reset;
		$scope.history = function (){
			$location.url('/history');
		};
	}).error( function (data, status) {
		$scope.error = true;
		$scope.errorMessage = "Server returned an error. Please try again later.";
	});

	// Sets up the last round scope
	function setupLastRound(data){
		$scope.lastRound = true;
		$scope.image = data.images[0];
		$scope.completeContest = completeContest;
	}

	// Sets up a not last round's scope
	function setupNormalRound(data){
		$scope.lastRound = false;
		var imagePairs = Contest.pairImages(data.images);
		Contest.prefillChosen(imagePairs);
		$scope.imagePairs = imagePairs;
		$scope.roundFinished = isRoundFinished(imagePairs);
		$scope.submitRound = submitRound;
	}

	// Completes the contest
	function completeContest() {
		Contest.done().success(function (){
			localStorageService.clearAll();
			$route.reload();
		});
	}

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

	// Submits the choices for the current round and goes onto the next.
	function submitRound() {
		var flickrIds = getChosenFlickrIds($scope.imagePairs);
		Contest.answer(flickrIds, $scope.contest.round).success(function (data) {
			localStorageService.clearAll();
			$route.reload();
		});
	}


	// Creates an array of flickr_ids of the chosen images.
	// Only call this function if the round is finished.
	function getChosenFlickrIds(imagePairs) {
		var flickrIds = [];
		angular.forEach(imagePairs, function (imagePair){
			if (imagePair[0]["chosen"] === "chosen"){
				flickrIds.push(imagePair[0]["flickr_id"]);
			} else {
				flickrIds.push(imagePair[1]["flickr_id"]);
			}
		});
		return flickrIds;
	}

	// Resets the contest 
	function reset (){
		Contest.reset().success(function () {
			localStorageService.clearAll();
			$route.reload();
		});
	}

}]);

imageTournamentControllers.controller('ChoiceCtrl', ['$scope', '$routeParams', 'localStorageService', 'Contest', '$location', function ($scope, $routeParams, localStorageService, Contest, $location) {
	Contest.imageDetails().success(function (imageDetails){
		Contest.currentRound().success(function (data) {
			$scope.images = data.images;
			Contest.setImageTitles(data.images, imageDetails);
			$scope.imagePairNumber = $routeParams.imagePair;
			var imagePairs = Contest.pairImages(data.images);
			Contest.prefillChosen(imagePairs);
			$scope.firstImage = imagePairs[$scope.imagePairNumber - 1][0];
			$scope.secondImage = imagePairs[$scope.imagePairNumber - 1][1];
			$scope.choose = function (number) {
				localStorageService.set($scope.imagePairNumber.toString(), number.toString());
				$location.url('/#/contest');

			};
		}).error( function (data, status) {
			$scope.error = true;
			$scope.errorMessage = "Server returned an error. Please try again later.";
		});
	}).error( function (data, status) {
		$scope.error = true;
		$scope.errorMessage = "Server returned an error. Please try again later.";
	});
}]);

imageTournamentControllers.controller('OverviewCtrl', ['$scope', '$routeParams', 'localStorageService', 'Contest', '$location', function ($scope, $routeParams, localStorageService, Contest, $location) {
	Contest.overview().success(function (overview) {
		var images = overview.contest.images;
		$scope.rounds = overview.contest.rounds;
	}).error( function (data, status) {
		$scope.error = true;
		$scope.errorMessage = "Server returned an error. Please try again later.";
	});
	$scope.toContest = function () {
		$location.url('/contest');
	}
}]);
