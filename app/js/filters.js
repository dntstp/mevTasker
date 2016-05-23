'use strict';

/* Filters */

taskListControllers.filter('priorityFilter', function() {
	return function(input) {
		var res = 'generic'
		switch (input) {
			case 1: 
			res = 'important'
			case 2: 
			res = 'medium'
			case 3: 
			res = 'generic'
			default:
			res = input
		}
		return res
	}
});