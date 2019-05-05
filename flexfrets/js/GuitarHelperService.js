/**
 * @namespace GuitarHelperService
 * @desc Service that contains music theory logic and constants
 */
app.service('GuitarHelperService', function() {

	/**
	 * @constant
	 * @type {Array}
	 * @desc Array of notes written with flat notation
	 * @memberOf GuitarHelperService
	 */
	var FLAT_NOTES = ["A\u266d","A","B\u266d","B","C","D\u266d","D","E\u266d","E","F","G\u266d","G"];

	/**
	 * @constant
	 * @type {Array}
	 * @desc Array of notes written with sharp notation
	 * @memberOf GuitarHelperService
	 */
	var SHARP_NOTES = ["G\u266f","A","A\u266f","B","C","C\u266f","D","D\u266f","E","F","F\u266f","G"];

	/**
	 * @constant
	 * @type {number}
	 * @desc Number of frets we are displaying
	 * @memberOf GuitarHelperService
	 */
	var NUM_FRETS = 12;

	/**
	 * @constant
	 * @type {number}
	 * @desc Number of guitar strings we are displaying
	 * @memberOf GuitarHelperService
	 */
	var NUM_STRINGS = 6;

	/**
	 * @constant
	 * @type {Array}
	 * @desc Array of notes that includes both flats and sharps.
	 * @memberOf GuitarHelperService
	 */
	var NOTES = ["G\u266f/A\u266d","A","A\u266f/B\u266d","B","C","C\u266f/D\u266d","D","D\u266f/E\u266d","E","F","F\u266f/G\u266d","G"];

	/**
	 * @constant
	 * @type {Settings}
	 * @desc Default application settings
	 * @memberOf GuitarHelperService
	 */ 
	var DEFAULT_SETTINGS = {
		currentTuning: [
			8,	// E
			3,	// B
			11, // G
			6,  // D
			1,  // A
			8,  // E
		],
		currentScale: 0, // Major Scale
		currentRootNote: 4, // C
		flatNotation: true
	};

	/**
	 * @constant
	 * @type {object[]}
	 * @desc Array of scale names and the note progression for each scale (0 being the root note)
	 * @memberOf GuitarHelperService
	 */
	var SCALES = [
		{name: "Major scale", notes: [0, 2, 4, 5, 7, 9, 11]},
		{name: "Mixolydian mode" , notes: [0, 2, 4, 5, 7, 9, 10]},
		{name: "Lydian mode", notes: [0, 2, 4, 6, 7, 9, 11] },
		{name: "Lydian dominant mode", notes: [0, 2, 4, 6, 7, 9, 10]},
		{name: "Phrygian dominant mode", notes: [0, 2, 4, 5, 7, 8, 11]},
		{name: "Harmonic major scale", notes: [0, 2, 4, 5, 7, 8, 11]},
		{name: "Natural minor scale", notes: [0, 2, 3, 5, 7, 8, 10]},
		{name: "Dorian mode", notes: [0, 2, 3, 5, 7, 9, 10]},
		{name: "Harmonic minor scale", notes: [0, 2, 3, 5, 7, 8, 11]},
		{name: "Melodic minor scale", notes: [0, 2, 3, 5, 7, 9, 11]},
		{name: "Phrygian mode", notes: [0, 1, 3, 5, 7, 8, 10]},
		{name: "Locrian mode", notes: [0, 1, 3, 5, 6, 8, 10]},
		{name: "Blues scale", notes: [0, 3, 5, 6, 7, 10]},
		{name: "Altered scale", notes: [0, 1, 3, 4, 6, 8, 10]},
		{name: "Major pentatonic scale", notes: [0, 2, 4, 7, 9]},
		{name: "Minor pentatonic scale", notes: [0, 3, 5, 7, 10]},
		{name: "Chromatic Scale", notes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]},
		{name: "Whole tone scale", notes: [0, 2, 4, 6, 8, 10]},
		{name: "Octatonic scale", notes: [0, 2, 3, 5, 6, 8, 9, 11]},
		{name: "Hexatonic scale", notes: [0, 3, 4, 7, 8, 11]}
	];

	/**
	 * @typedef Fret
	 * @type {object}
	 * @desc Contains properties that the front-end uses to determine how to display the fret
	 * @property {string} note Name of the note to display on the screen
	 * @property {boolean} isInScale Is the note in the scale
	 * @property {boolean} isRoot Is the note the root note
	 */
	
	/**
	 * @typedef String
	 * @type {Fret[]}
	 * @desc Array of fret objects that compose a string
	 */
	
	/**
	 * @typedef Fretboard
	 * @type {String[]}
	 * @desc Array of string objects that make up the fretboard
	 */
	
	/**
	 * @typedef Settings
	 * @type {object}
	 * @desc Object that contains the current settings
	 * @property {number[]} currentTuning Array of NOTE indexes (starting on the high string)
	 * that represent the starting note of each string
	 * @property {number} currentScale SCALE Index of the current scale
	 * @property {number} currentRootNote NOTE Index of the current root note
	 * @property {flatNotation} boolean Is the current notation flat 
	 */

	/**
	 * @name getNotesInScale
	 * @function
	 * @desc Calculates the notes in a scale starting on the given root note
	 * @param {number} rootNote Index of root note (in NOTES array)
	 * @param {number} scaleIndex Index of scale (in SCALES array)
	 * @returns {number[]} Array of indexes of the notes in the scale
	 * @memberOf GuitarHelperService
	 */
	var getNotesInScale = function (rootNote, scaleIndex) {
		// Get scale notes from index
		var scale = SCALES[scaleIndex].notes;

		// Return array that will hold indices of all the notes in the scale
		var notesInScale = [];

		// Loop through the scale array (starting on the root) and add to return array
		for (var i = 0; i < scale.length; i++) {
			notesInScale.push((rootNote + scale[i]) % 12);
		}

		return notesInScale;
	}

	/**
	 * @name buildString
	 * @function
	 * @desc Calculate the properties for each fret in the string
	 * @param {number} openNote Index of string's open (starting) note
	 * @param {number[]} notesInScale Array of notes in the current scale
	 * @param {boolean} flatNotation Flag that determines if notation is flats or sharps
	 * @returns {String} Array of Fret JSON objects
	 * @memberOf GuitarHelperService
	 */
	var buildString = function (openNote, notesInScale, flatNotation) {
		// Boolean that denotes whether the string's open note is in the current scale
		var openNoteIsInScale = notesInScale.includes(openNote);

		// Boolean that denotes whether the string's open note is the root note of the scale
		var openNoteIsRoot = (notesInScale[0] == openNote);

		var frets = [];

		var currentNote = openNote;

		// Iterate through the frets, starting on the first one
		for (j=0;j<NUM_FRETS;j++) {
			currentNote = (currentNote + 1) % 12;
			var isInScale = false;
			var isRoot = false;

			// Check if note is in the scale
			if(notesInScale.indexOf(currentNote) != -1)
			{
				isInScale = true;

				// Check if note is root note
				if(notesInScale.indexOf(currentNote) == 0) {
					isRoot = true;
				}
			}

			var note = flatNotation ? FLAT_NOTES[currentNote] : SHARP_NOTES[currentNote];
			var fret = {note: note, isInScale: isInScale, isRoot: isRoot};
			frets.push(fret);
		}

		var string = { 
			openNoteIsInScale: openNoteIsInScale,
			openNoteIsRoot: openNoteIsRoot,
			frets: frets
		};

		return string;
	}

	/**
	 * @name getFretboard
	 * @function
	 * @desc Generates the Fretboard object array with the given settings
	 * @param {Settings} settings Current settings
	 * @returns {Fretboard} Fretboard Array
	 * @memberOf GuitarHelperService
	 */
	var getFretboard = function (settings) {
		var currentTuning = settings.currentTuning;
		var flatNotation = settings.flatNotation;
		var notesInScale = getNotesInScale(settings.currentRootNote, settings.currentScale);

		var strings = [];

		for (i=0;i<NUM_STRINGS;i++) {
			strings.push(buildString(currentTuning[i],notesInScale,flatNotation));
		}

		var fretboard = {strings: strings};

		return fretboard;
	}

	this.NOTES = NOTES;
	this.SCALES = SCALES;
	this.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
	
	this.getFretboard = getFretboard;
});