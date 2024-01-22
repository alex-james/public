define(["jquery", "jquery-ui"], function($) {
	//Filter tabs
	$('#filter-tabs').tabs();

	//Filters Selection
	$('.filter-option, .filter-type').on('click', function(){
		const $filterOption = $(this);

		$filterOption.attr('data-active', $filterOption.attr('data-active') === '0' ? '1' : '0');
		updateActiveFilters()
		$('#coverflow').trigger('refresh');
		applyFiltersToFilters();
	});

	//Filter remaining filters
	function applyFiltersToFilters(activeFilters)
	{
		let availableFilters = {
			genre: [],
			decade: [],
			artist: []
		};

		$('#coverflow .album').each(function() {
			const $album = $(this);
			const genre = $album.attr('data-filter-genre');
			const decade = $album.attr('data-filter-decade');
			const artist = $album.attr('data-filter-artist-id');

			if(availableFilters.genre.indexOf(genre) === -1){
				availableFilters.genre.push(genre);
			}

			if(availableFilters.decade.indexOf(decade) === -1){
				availableFilters.decade.push(decade);
			}

			if(availableFilters.artist.indexOf(artist) === -1){
				availableFilters.artist.push(artist);
			}
		});

		$('#filter-genre .filter-option').hide();
		for (i in availableFilters.genre) {
			$('#filter-genre .filter-option[data-code="' + availableFilters.genre[i] + '"]').show();
		}

		$('#filter-decade .filter-option').hide();
		for (i in availableFilters.decade) {
			$('#filter-decade .filter-option[data-code="' + availableFilters.decade[i] + '"]').show();
		}

		$('#filter-artist .filter-option').hide();
		for (i in availableFilters.artist) {
			$('#filter-artist .filter-option[data-code="' + availableFilters.artist[i] + '"]').show();
		}
	}

	function updateActiveFilters()
	{
		const $filterTable = $('.filter-table');
		document.activeFilters = {
			type: $filterTable.find('.filter-type:checked').val(),
			genre: [],
			decade: [],
			artist: []
		}

		$filterTable.find('#filter-genre .filter-option[data-active="1"]').each(function(){
			document.activeFilters.genre.push($(this).attr('data-code'));
		});

		$filterTable.find('#filter-decade .filter-option[data-active="1"]').each(function(){
			document.activeFilters.decade.push($(this).attr('data-code'));
		});

		$filterTable.find('#filter-artist .filter-option[data-active="1"]').each(function(){
			document.activeFilters.artist.push($(this).attr('data-code'));
		});
	}
});