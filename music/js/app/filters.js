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