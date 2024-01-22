define(["jquery", "coverflow"], function($) {
	const $infoBarTop = $('.info-bar.top');
	const $infoBarBottom = $('.info-bar.bottom');
	const $title = $infoBarTop.find('.title');
	const $artist = $infoBarBottom.find('.artist');
	const $genre = $infoBarBottom.find('.genre');
	const $releaseDate = $infoBarBottom.find('.release-date');
	const $coverflow = $('#coverflow');

	function buildCoverFlow() {
		$coverflow.coverflow({
			active: 4,
			scale: 0.6,
			select: function(event, ui){
				const $activeAlbum = $(ui.active);
				const releaseDate = new Date($activeAlbum.attr("data-release-date"));

				$artist.text($activeAlbum.attr("data-artist"));
				$title.text($activeAlbum.attr("data-title"));
				$genre.text($activeAlbum.attr("data-genre"));
				$releaseDate.text(releaseDate.toLocaleDateString('en-GB'));

				$('#slider .slider-button').addClass('updating').val($activeAlbum.attr("data-album-num")).removeClass('updating');
			}
		});
	}

	function applyFiltersToCoverflow(rebuild = false)
	{
		if(rebuild) $coverflow.coverflow('destroy');
		$coverflow.empty();

		let albumNum = 1;
		$('#coverflow-unfiltered .album').each(function(){
			const $album = $(this).clone(false);
			let show = true;

			switch(document.activeFilters.type) {
				case 'favourites':
					show = $album.attr('data-filter-favourite') === '1';
					break;
				case 'recent':
					show = $album.attr('data-filter-recent-added') === '1';
					break;
			}

			if(show && document.activeFilters.genre.length && document.activeFilters.genre.indexOf($album.attr('data-filter-genre')) === -1) {
				show = false;
			}

			if(show && document.activeFilters.decade.length && document.activeFilters.decade.indexOf($album.attr('data-filter-decade')) === -1) {
				show = false;
			}

			if(show && document.activeFilters.artist.length && document.activeFilters.artist.indexOf($album.attr('data-filter-artist-id')) === -1) {
				show = false;
			}

			if(show) $album.attr('src', $album.attr('data-src')).attr('data-album-num', albumNum++).appendTo($coverflow);
		});
		$('#slider .slider-button').attr('max', $coverflow.children().length);
		$coverflow.trigger('init');
	}

	applyFiltersToCoverflow(false);
	buildCoverFlow();

	$('#coverflow img').on('click',function() {
		if(!$(this).hasClass('ui-state-active')){
			return;
		}
		$('#coverflow').coverflow('next');
	});

	$('.cover-button').on('click', function() {
		const $button = $(this);

		$('#actions .cover-button').removeClass('active');
		$button.addClass('active');

		if($button.hasClass('left')) {
			$('.info-panel-wrapper').removeClass('show-back');
		} else {
			$('.info-panel-wrapper').addClass('show-back');
		}
	});

	$coverflow.on('refresh', function() {
		applyFiltersToCoverflow(true);
		buildCoverFlow();
	});

	/* Slider */
	$('#slider .slider-button:not(.updating)').on('input', function() {
		$('#coverflow img[data-album-num="' + $(this).val() + '"]').trigger('click');
	});
});