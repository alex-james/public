define(["jquery", "coverflow"], function($) {
	const $header = $('#header');
	const $artist = $header.find('.artist');
	const $title = $header.find('.title');
	const $genre = $header.find('.genre');

	$('#coverflow').coverflow({
		active: 2,
		select: function(event, ui){
			$artist.text($(ui.active).attr("data-artist"));
			$title.text($(ui.active).attr("data-title"));
			$genre.text($(ui.active).attr("data-genre"));
		}
	});

	$('#coverflow img').click(function() {
		if( ! $(this).hasClass('ui-state-active')){
			return;
		}
		$('#coverflow').coverflow('next');
	});
});