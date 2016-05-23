'use strict';

/* Filters */

taskListControllers.filter('priorityFilter', function() {
	return function(input) {
		var res = 'generic';
		switch (input) {
			case 1: 
				res = 'important';
				break;
			case 2: 
				res = 'medium';
				break;
			case 3: 
				res = 'generic';
				break;
			default:
				res = input;
				break;
		}
		return res;
	}
});