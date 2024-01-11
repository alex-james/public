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

// Load the main app module to start the app
requirejs(["app/main"]);

define(["jquery", "jquery-ui"], function($) {
	// Datepicker
	$('.js-datepicker').datepicker({dateFormat: 'yy-mm-dd'});

	// Album Select
	$('.album-image').on('click', function() {
		const $row = $(this).closest('.album-row');
		const $genreSelect = $row.find('.album-genre-select');
		if($genreSelect.val() === '') {
			const artistId = $(this).siblings('.artist-id').val();
			$.get("/music/app/Controller/Ajax/GetGenre.php?artist_id=" + artistId,
				function(genreData){
					genreData = JSON.parse(genreData);
					$genreSelect.val(genreData.internal_genre);
					$row.find('.album-external-genres').val(genreData.external_genres);
				}
			);
		}
	});

	// Pagination
	$('.js-search').on('click', function(){
		const $arrowEl = $(this);
		const $row = $arrowEl.closest('.covers');
		const rowNum = $row.attr('data-row');
		const artists = $row.attr('data-artist');
		const album = $row.attr('data-album');
		const currentOffset = Number($row.attr('data-offset'));
		let newOffset = ($arrowEl.hasClass('nav-prev') && currentOffset > 0) ? currentOffset - 1 : currentOffset + 1;

		$row.attr('data-offset', newOffset);
		$.get("/music/app/Controller/Ajax/SearchSpotify.php?row=" + rowNum
			+ "&artist=" + encodeURI(artists)
			+ "&album=" + encodeURI(album)
			+ "&offset=" + newOffset,
			function(albumHtml){
				$row.find('.cover-options').remove();
				$row.find('.js-search.nav-prev').after(albumHtml);
		});

		$row.find('.nav-prev').hide();
		if(newOffset > 0) $row.find('.nav-prev').show();
	});
});