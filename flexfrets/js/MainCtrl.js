/**
 * @namespace MainCtrl
 * @desc Main Controller
 */
app.controller("MainCtrl", ["$scope", "GuitarHelperService", function($scope, GuitarHelperService) {

	$scope.showTunerDropdown = false;
	$scope.showRootNoteDropdown = false;
	$scope.showScaleDropdown = false;
	$scope.showOverlay = false;
	
	$scope.notes = GuitarHelperService.NOTES;
	$scope.scales = GuitarHelperService.SCALES;
	$scope.settings = GuitarHelperService.DEFAULT_SETTINGS;

	/* Initialize fretboard */
	$scope.fretboard = GuitarHelperService.getFretboard($scope.settings);

	/**
	 * @name hideAllDropdowns
	 * @function
	 * @desc Hides any dropdowns that are currently visible
	 * @memberOf MainCtrl
	 */
	$scope.hideAllDropdowns = function () {
		$scope.showTunerDropdown = false;
		$scope.showRootNoteDropdown = false;
		$scope.showScaleDropdown = false;
	}

	/**
	 * @name toggleTuner
	 * @function
	 * @desc Hides any dropdowns that are currently visible and sets the current string variable
	 * @memberOf MainCtrl
	 */
	$scope.toggleTunerDropdown = function (selectedString) {
		$scope.currentString = selectedString;

		$scope.showTunerDropdown = !$scope.showTunerDropdown;
		$scope.showRootNoteDropdown = false;
		$scope.showScaleDropdown = false;
	}

	/**
	 * @name toggleRootNoteDropdown
	 * @function
	 * @desc Shows root note selection dropdown, hides any other dropdowns
	 * @memberOf MainCtrl
	 */
	$scope.toggleRootNoteDropdown = function () {
		$scope.showTunerDropdown = false;
		$scope.showRootNoteDropdown = !$scope.showRootNoteDropdown;
		$scope.showScaleDropdown = false;
	}

	/**
	 * @name toggleScaleDropdown
	 * @function
	 * @desc Shows root note selection dropdown, hides any other dropdowns
	 * @memberOf MainCtrl
	 */
	$scope.toggleScaleDropdown = function () {
		$scope.showTunerDropdown = false;
		$scope.showRootNoteDropdown = false;
		$scope.showScaleDropdown = !$scope.showScaleDropdown;
	}

	/**
	 * @name changeRootNote
	 * @function
	 * @desc Changes root note of current scale
	 * @param {number} newRootNote Index of new root note
	 * @memberOf MainCtrl
	 * @uses GuitarHelperService.getFretboard
	 */
	$scope.changeRootNote = function (newRootNote) {
		$scope.settings.currentRootNote = newRootNote;
		$scope.fretboard = GuitarHelperService.getFretboard($scope.settings);
		$scope.showRootNoteDropdown = false;
	}

	/**
	 * @name changeScale
	 * @function
	 * @desc Changes the current scale
	 * @param {number} newScale Index of new scale
	 * @memberOf MainCtrl
	 */
	$scope.changeScale = function (newScale) {
		$scope.settings.currentScale = newScale;
		$scope.fretboard = GuitarHelperService.getFretboard($scope.settings);
		$scope.showScaleDropdown = false;
	}

	/**
	 * @name changeTuning
	 * @function
	 * @desc Changes the starting note of the current active string
	 * @param {number} newNote Index of new note
	 * @memberOf MainCtrl
	 */
	$scope.changeTuning = function (newNote) {
		$scope.settings.currentTuning[$scope.currentString] = newNote;
		$scope.fretboard = GuitarHelperService.getFretboard($scope.settings);
		$scope.showTunerDropdown = false;
	}

	/**
	 * @name changeNotation
	 * @function
	 * @desc Change to either flat or sharp notation
	 * @param {boolean} flatNotation True if flat, false if sharp
	 * @memberOf MainCtrl
	 */
	$scope.changeNotation = function (flatNotation) {
		$scope.settings.flatNotation = flatNotation;
		$scope.fretboard = GuitarHelperService.getFretboard($scope.settings);
	}

	/**
	 * @name shiftTuning
	 * @function
	 * @desc Uniformly changes the tuning for all strings
	 * @param {number} offset Amount to offset the start note by for each string
	 * @memberOf MainCtrl
	 */
	$scope.shiftTuning = function (offset) {
		$scope.settings.currentTuning = $scope.settings.currentTuning.map(function(note) {
			return mod((note + offset), 12);
		});
		$scope.fretboard = GuitarHelperService.getFretboard($scope.settings);
	}

	/* modular arithmetic function from https://maurobringolf.ch/2017/12/a-neat-trick-to-compute-modulo-of-negative-numbers/ */
	const mod = (x, n) => (x % n + n) % n
}]);