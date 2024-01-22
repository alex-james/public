requirejs.config({
	"baseUrl": "js/lib",
	"paths": {
		"app": "../app",
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min",
		"jquery-ui": "https://code.jquery.com/ui/1.13.1/jquery-ui.min",
		"coverflow": "coverflow"
	},

	shim: {
		"jquery-ui": {
			exports: "$",
			deps: ['jquery']
		}
	},
	"bootstrap": ['jquery']
});

document.activeFilters = {
	type: 'all',
	genre: [],
	decade: [],
	artist: []
};

// Load the main app module to start the app
requirejs(["app/coverflow"]);
requirejs(["app/filters"]);
requirejs(["app/assign"]);