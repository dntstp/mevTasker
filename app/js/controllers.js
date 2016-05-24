'use strict';

/* Controllers */
var taskListControllers = angular.module('taskListControllers',
    ['ui.bootstrap.datetimepicker', 'ui.bootstrap', 'rzModule', 'ngDraggable']);

taskListControllers.controller('TaskListCtrl',
    function TaskListCtrl($scope, $routeParams, $filter, $location, storage, Slug, $uibModal) {
        'use strict';

        var LIST_STORAGE_ID = 'lists';
        storage.bind($scope, LIST_STORAGE_ID);

        var defaultList = {
            listId: Slug.slugify('Work tasks' + '-' + 0),
            title: 'Tasks to be hired by Mev',
            tasks: [
                {
                    title: 'Learn HTML5',
                    completed: true,
                    priority: 1,
                    progress: 50,
                    progress2: 50
                },
                {
                    title: 'Learh JS',
                    completed: true,
                    priority: 2,
                    progress: 33,
                    progress2: 33
                },
                {
                    title: 'Learn CSS3',
                    completed: false,
                    startTime: new Date(2016, 4, 19, 16),
                    endTime: new Date(2016, 4, 25, 9),
                    priority: 1,
                    progress: 80,
                    progress2: 80,
                    progress_history: [
                        {
                            time: new Date(2016, 4, 19, 16, 18),
                            progress: 15
                        },
                        {
                            time: new Date(2016, 4, 21, 19, 36),
                            progress: 25
                        },
                        {
                            time: new Date(2016, 4, 22, 19, 36),
                            progress: 80
                        }
                    ]
                },
                {
                    title: 'Become an Angular Master',
                    completed: false,
                    startTime: new Date(2016, 4, 19, 16),
                    endTime: new Date(2016, 4, 25, 9),
                    priority: 3,
                    progress: 100,
                    progress2: 100,
                    progress_history: [
                        {
                            time: new Date(2015, 1, 19, 16, 18),
                            progress: 15
                        },
                        {
                            time: new Date(2015, 2, 21, 19, 36),
                            progress: 25
                        },
                        {
                            time: new Date(2015, 3, 22, 19, 36),
                            progress: 100
                        }
                    ]
                },
                {
                    title: 'Write this SPA',
                    completed: false,
                    startTime: new Date(2016, 4, 19, 16),
                    endTime: new Date(2016, 4, 25, 9),
                    priority: 1,
                    progress: 80,
                    progress2: 80,
                    progress_history: [
                        {
                            time: new Date(2016, 4, 19, 16, 18),
                            progress: 15
                        },
                        {
                            time: new Date(2016, 4, 21, 19, 36),
                            progress: 25
                        },
                        {
                            time: new Date(2016, 4, 22, 19, 36),
                            progress: 80
                        }
                    ]
                }
            ]
        };
        var defaultList2 = {
            listId: Slug.slugify('Work tasks' + '-' + 1),
            title: 'Home tasks',
            tasks: [
                {
                    title: 'Buy a chocolate',
                    completed: true,
                    priority: 1,
                    progress: 100,
                    progress2: 100
                },
                {
                    title: 'Buy a milk',
                    completed: true,
                    priority: 2,
                    progress: 100,
                    progress2: 100
                }
            ]
        };

        $scope.newTask = {};
        $scope.newList = '';

        var lists = $scope.lists = storage.get(LIST_STORAGE_ID) || [defaultList, defaultList2];

        $scope.currentList = lists[0] || {tasks: []};
        var tasks = $scope.tasks = $scope.currentList.tasks;

        $scope.$watch('tasks', function () {
            $scope.currentList.remainingCount = $filter('filter')(tasks, {completed: false}).length;
            $scope.currentList.completedCount = tasks.length - $scope.currentList.remainingCount
        }, true);

        // Update the location url whenever current list changes
        $scope.$watch('currentList', function (newValue, oldValue) {
            if (newValue.title !== oldValue.title) {
                $scope.setLocation();
            }
        }, true);

        // Monitor the current route for changes and adjust the filter accordingly.
        $scope.$on('$routeChangeSuccess', function () {
            if ($routeParams.listId) {
                var listId = $routeParams.listId.split("-").pop();
                var list = lists[listId];

                if (list !== undefined && list !== $scope.currentList) {
                    $scope.currentList = list;
                    $scope.setTasks();
                } else if (list !== $scope.currentList) {
                    $location.path('/');
                }
            }
        });

        $scope.setLocation = function () {
            var url = '/';

            if ($scope.currentList) {
                url += $scope.currentList.listId;
            }

            $location.path(url);
        };

        $scope.setTasks = function () {
            tasks = $scope.tasks = $scope.currentList.tasks;
        };

        $scope.setCurrentList = function () {
            if (!$scope.currentList && !lists) {
                $scope.currentList = lists[0];
            }
        };

        $scope.addList = function () {
            var newList = $scope.newList.trim();

            if (!newList.length) {
                return;
            }

            lists.push({
                listId: Slug.slugify(newList + '-' + lists.length),
                title: newList,
                tasks: [],
                remainingCount: 0
            });

            $scope.newList = '';
            $scope.currentList = lists[lists.length - 1];
            $scope.setTasks();
        };

        $scope.removeList = function (list) {
            if (confirm("Are uou sure?")) {
                lists.splice(lists.indexOf(list), 1);
                $scope.currentList = lists[lists.length - 1];
                $scope.setTasks();
            }
        };

        $scope.addTask = function () {
            var newTaskName = $scope.newTask.name.trim();
            var newStartTime = $scope.newTask.startTime ? $scope.newTask.startTime : new Date();
            var newPriority = $scope.newTask.priority ? $scope.newTask.priority : 3;
            if (!newTaskName.length) {
                return;
            }
            tasks.push({
                title: newTaskName,
                completed: false,
                endTime: $scope.newTask.endTime,
                startTime: newStartTime,
                priority: newPriority,
                progress: 0,
                progress2: 0
            });

            $scope.newTask = {};
        };

        $scope.removeTask = function (task) {
            if (confirm('Sure to delete?')) {
                tasks.splice(tasks.indexOf(task), 1);
            }
        };
        $scope.reload = function () {
            localStorage.clear();
            location.reload();
        };
        setInterval(function () {
            $scope.now = new Date();
        }, 1000);


        $scope.duration = function (task) {
            return moment.duration(task.endTime.diff(task.startTime)).asHours();
        };

        $scope.time_spent = function (task) {
            var nowtime = moment($scope.now);
            return moment.duration(nowtime.diff(task.startTime)).asHours();

        };
        $scope.set_progress = function (task) {
            if (confirm("Set progress to " + task.progress2 + "?")) {
                task.progress = task.progress2;
                if (typeof(task.progress_history) === 'undefined')
                    task.progress_history = [];
                task.progress_history.push({
                    time: new Date(),
                    progress: task.progress
                });
                if (task.progress == 100) {
                    task.completed = true;
                } else {
                    task.completed = false;
                }
            }
        };
        $scope.set_done = function (task) {
            if (confirm("Set this done?")) {
                if (typeof(task.progress_history) === 'undefined')
                    task.progress_history = [];
                task.progress_history.push({
                    time: new Date(),
                    progress: 100
                });
                task.completed = true;
                task.progress = 100;
                task.progress2 = 100;
            }
        };
        $scope.start_task = function (task) {
            if (confirm('Srart this task?')) {
                if (typeof(task.progress_history) === 'undefined')
                    task.progress_history = [];
                task.progress_history.push({
                    time: new Date(),
                    progress: 0
                });
                task.progress = 0;
                task.progress2 = 0;
            }
        };
        $scope.time_remaining = function (task) {
            var eventTime = task.progress_history[task.progress_history.length - 1].time; // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
            var currentTime = $scope.now; // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
            var diffTime = (currentTime - eventTime) * Math.pow(task.progress, -2);
            var duration = moment.duration(diffTime * 1000, 'milliseconds');

            duration = moment.duration(duration - interval, 'milliseconds');
            return duration.hours() + ":" + duration.minutes() + ":" + duration.seconds();
        };

        $scope.onDropComplete = function (data, index) {
            tasks.splice(tasks.indexOf(data), 1);
            tasks.splice(index, 0, data);
        };
        $scope.onDropComplete2 = function (data, index) {
            tasks.splice(tasks.indexOf(data), 1);
            $scope.lists[index].tasks.push(data);
            console.log($scope.lists[index]);
        };

    });