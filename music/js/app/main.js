define(["jquery", "coverflow"], function($) {
	const $infoBarTop = $('.info-bar.top');
	const $infoBarBottom = $('.info-bar.bottom');
	const $title = $infoBarTop.find('.title');
	const $artist = $infoBarBottom.find('.artist');
	const $genre = $infoBarBottom.find('.genre');
	const $releaseDate = $infoBarBottom.find('.release-date');

	$('#coverflow').coverflow({
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

	$('#coverflow img').click(function() {
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

	$('#slider .slider-button:not(.updating)').on('input', function() {
		$('#coverflow img[data-album-num="' + $(this).val() + '"]').trigger('click');
	});
});