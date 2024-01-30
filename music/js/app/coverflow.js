define(["jquery", "coverflow"], function($) {
	const $infoBarTop = $('.info-bar.top');
	const $infoBarBottom = $('.info-bar.bottom');
	const $title = $infoBarTop.find('.title');
	const $artist = $infoBarBottom.find('.artist');
	const $genre = $infoBarBottom.find('.genre');
	const $releaseDate = $infoBarBottom.find('.release-date');
	const $coverflow = $('#coverflow');

	function buildCoverFlow() {
		const numVisibleAlbums = $('#coverflow .album').length;
		if(numVisibleAlbums === 0) return;

		$coverflow.coverflow({
			active: (Math.floor(numVisibleAlbums / 2)),
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
		const $albums = $('#coverflow .album');
		const $unfilteredAlbums = $('#coverflow-unfiltered .album');

		if($albums.length && rebuild) $coverflow.coverflow('destroy');
		$coverflow.empty();

		let unfilteredStartNumber = Math.floor(Math.random() * $unfilteredAlbums.length);
		let albumNum = 1;

		//Cut the deck
		$unfilteredAlbums.each(function(){
			if(albumNum >= unfilteredStartNumber) {
				addUnfilteredAlbumToCoverflow($(this));
			}
			albumNum++;
		});
		albumNum = 1;
		$unfilteredAlbums.each(function(){
			if(albumNum < unfilteredStartNumber) {
				addUnfilteredAlbumToCoverflow($(this));
			}
			albumNum++;
		});
		$coverflow.trigger('init');
	}

	function reNumberAlbums()
	{
		const $albums = $('#coverflow .album');

		albumNum = 1;
		$albums.each(function(){
			$(this).attr('data-album-num', albumNum++);
		});

		$('#slider .slider-button').attr('max', albumNum-1);
	}

	function addUnfilteredAlbumToCoverflow($unfilteredAlbum) {
		const albumsAdded = $('#coverflow .album').length;
		const $album = $unfilteredAlbum.clone(false);
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

		if(show) {
			$album.attr('src', $album.attr('data-src'));
			if(albumsAdded === 0) {
				$('#coverflow').append($album);
			}
			position = Math.floor(Math.random() * albumsAdded) + 1;
			$('#coverflow > .album:nth-child(' + position + ')').after($album);
		}
	}

	applyFiltersToCoverflow(false);
	buildCoverFlow();
	reNumberAlbums();

	$('#coverflow img').on('click',function() {
		if(!$(this).hasClass('ui-state-active')){
			return;
		}
		$('#coverflow').coverflow('next');
	});

	$('.cover-button.left, .cover-button.right').on('click', function() {
		const $button = $(this);

		$('#actions .cover-button').removeClass('active');
		$button.addClass('active');

		if($button.hasClass('left')) {
			$('.info-panel-wrapper').removeClass('show-back');
		} else {
			$('.info-panel-wrapper').addClass('show-back');
		}
	});

	async function handleHardReload(url) {
		await fetch(url, {
			headers: {
				Pragma: 'no-cache',
				Expires: '-1',
				'Cache-Control': 'no-cache',
			},
		});
		window.location.href = url;
		// This is to ensure reload with url's having '#'
		window.location.reload();
	}

	$('.cover-button.top').on('click', function() {
		$(this).addClass('active');
		handleHardReload(window.location.href);
	});

	$coverflow.on('refresh', function() {
		applyFiltersToCoverflow(true);
		buildCoverFlow();
		reNumberAlbums();
	});

	/* Slider */
	$('#slider .slider-button:not(.updating)').on('input', function() {
		$('#coverflow img[data-album-num="' + $(this).val() + '"]').trigger('click');
	});
});