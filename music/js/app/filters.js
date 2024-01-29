define(["jquery", "jquery-ui"], function($) {
	//Filter tabs
	$('#filter-tabs').tabs();

	//Filters Selection
	$('.filter-option, .filter-type, .filter-option-all').on('click', function(){
		const $filterOption = $(this);

		setAllFilterStatus($filterOption);
		$filterOption.attr('data-active', $filterOption.attr('data-active') === '0' ? '1' : '0');
		updateActiveFilters()
		$('#coverflow').trigger('refresh');
		applyFiltersToFilters();
	});

	function setAllFilterStatus($filterOption)
	{
		const $filterOptions = $filterOption.closest('.filter-options');
		const activeFiltersForGenre = $filterOptions.find('.filter-option[data-active="1"]').length;

		if($filterOption.hasClass('filter-option-all') && activeFiltersForGenre) {
			$filterOptions.removeClass('has-active-filters');
			$filterOptions.find('.filter-option').attr('data-active', 0);
		} else {
			$filterOptions.addClass('has-active-filters');
			$filterOptions.find('.filter-option-all').attr('data-active', (activeFiltersForGenre > 0 ? '0' : '1'));
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

	function buildDataSelector(filterType, filterValue) {
		let selector;

		switch(filterType) {
			case 'genre':
				selector = 'genre';
				break
			case 'decade':
				selector = 'decade';
				break
			case 'artist':
				selector = 'artist-id';
				break;
		}

		return '[data-filter-' + selector + '="' + filterValue + '"]';
	}

	//Filter remaining filters
	function applyFiltersToFilters()
	{
		let availableFilters = {
			genre:[],
			decade: [],
			artist: []
		};

		['genre', 'decade', 'artist'].forEach(function(primaryFilterType){
			let selectors= [];
			let filterValue, primaryDataSelector, secondaryDataSelector, tertiaryDataSelector, secondaryFilterTypes;
			for (i in document.activeFilters[primaryFilterType]) {
				filterValue = document.activeFilters[primaryFilterType][i];
				primaryDataSelector = buildDataSelector(primaryFilterType, filterValue);

				switch(primaryFilterType) {
					case 'genre':
						secondaryFilterTypes = ['decade', 'artist'];
						break
					case 'decade':
						secondaryFilterTypes = ['genre', 'artist'];
						break
					case 'artist':
						secondaryFilterTypes = ['genre', 'decade'];
						break;
				}

				if(document.activeFilters[secondaryFilterTypes[0]].length && document.activeFilters[secondaryFilterTypes[1]].length) {
					for (i in document.activeFilters[secondaryFilterTypes[0]]) {
						secondaryDataSelector = buildDataSelector(secondaryFilterTypes[0], document.activeFilters[secondaryFilterTypes[0]][i]);
						for (i in document.activeFilters[secondaryFilterTypes[1]]) {
							tertiaryDataSelector = buildDataSelector(secondaryFilterTypes[1], document.activeFilters[secondaryFilterTypes[1]][i]);
							selectors.push(primaryDataSelector+secondaryDataSelector+tertiaryDataSelector);
						}
					}
				} else if(document.activeFilters[secondaryFilterTypes[0]].length) {
					for (i in document.activeFilters[secondaryFilterTypes[0]]) {
						secondaryDataSelector = buildDataSelector(secondaryFilterTypes[0], document.activeFilters[secondaryFilterTypes[0]][i]);
						selectors.push(primaryDataSelector+secondaryDataSelector);
					}
				} else if(document.activeFilters[secondaryFilterTypes[1]].length) {
					for (i in document.activeFilters[secondaryFilterTypes[1]]) {
						tertiaryDataSelector = buildDataSelector(secondaryFilterTypes[1], document.activeFilters[secondaryFilterTypes[1]][i]);
						selectors.push(primaryDataSelector+tertiaryDataSelector);
					}
				} else {
					selectors.push(primaryDataSelector);
				}

				selectors.forEach(function(selector){
					$('#coverflow-unfiltered .album' + selector).each(function(){
						const $album = $(this);
						const genre = $album.attr('data-filter-genre');
						const decade = $album.attr('data-filter-decade');
						const artist = $album.attr('data-filter-artist-id');

						if(availableFilters.genre.indexOf(genre) === -1) {
							availableFilters.genre.push(genre);
						}
						if(availableFilters.decade.indexOf(decade) === -1) {
							availableFilters.decade.push(decade);
						}
						if(availableFilters.artist.indexOf(artist) === -1) {
							availableFilters.artist.push(artist);
						}
					})
				})
			}
		});

		if(!$('#filter-genre .filter-options').hasClass('has-active-filters')) {
			$('#filter-genre .filter-option').hide();
			for (i in availableFilters.genre) {
				$('#filter-genre .filter-option[data-code="' + availableFilters.genre[i] + '"]').show();
			}
		}

		if(!$('#filter-decade .filter-options').hasClass('has-active-filters')) {
			$('#filter-decade .filter-option').hide();
			for (i in availableFilters.decade) {
				$('#filter-decade .filter-option[data-code="' + availableFilters.decade[i] + '"]').show();
			}
		}

		if(!$('#filter-artist .filter-options').hasClass('has-active-filters')) {
			$('#filter-artist .filter-option').hide();
			for (i in availableFilters.artist) {
				$('#filter-artist .filter-option[data-code="' + availableFilters.artist[i] + '"]').show();
			}
		}
	}
});