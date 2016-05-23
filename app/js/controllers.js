'use strict';

/* Controllers */
var taskListControllers = angular.module('taskListControllers', ['ui.bootstrap.datetimepicker', 'ui.bootstrap']);

taskListControllers.controller('TaskListCtrl', function TaskListCtrl($scope, $routeParams, $filter, $location, storage, Slug) {
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
          priority: 1
        },
        { 
          title: 'Learh JS',
           completed: true,
           priority: 2
         },
        { 
          title: 'Learn CSS3',
          completed: true,
          priority: 1
        },
        { 
          title: 'Become an Angular Master', 
          completed: true,
          priority: 3
        },
        { 
          title: 'Write this SPA', 
          completed: false,
          startTime: new Date(2016, 4, 19, 16),
          endTime: new Date(2016, 4, 25, 9),
          priority: 1,
          progress: 80
        }
      ]
    };
    var defaultList2 = {
        listId: Slug.slugify('Work tasks' + '-' + 1),
        title: 'Home tasks',
        tasks: [
            {
                title: 'Buy a chocolate',
                completed: false,
                priority: 'high'
            },
            {
                title: 'Buy a milk',
                completed: false,
                priority: 'medium'
            }
        ]
    };

    $scope.newTask = {};
    $scope.newList = '';

    var lists = $scope.lists = storage.get(LIST_STORAGE_ID) || [defaultList, defaultList2];

    $scope.currentList = lists[0] || { tasks: [] };
    var tasks = $scope.tasks = $scope.currentList.tasks;

    $scope.$watch('tasks', function (newValue, oldValue) {
      $scope.currentList.remainingCount = $filter('filter')(tasks, { completed: false}).length;
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

    $scope.setLocation = function() {
      var url = '/';

      if ($scope.currentList) {
        url += $scope.currentList.listId;
      }

      $location.path(url);
    };

    $scope.setTasks = function() {
      tasks = $scope.tasks = $scope.currentList.tasks;
    };

    $scope.setCurrentList = function() {
      if (!$scope.currentList && !lists) {
        $scope.currentList = lists[0];
      }
    };

    $scope.addList = function() {
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

    $scope.removeList = function(list) {
      lists.splice(lists.indexOf(list), 1);
      $scope.currentList = lists[lists.length - 1];
      $scope.setTasks();
    };

    $scope.addTask = function() {
      var newTaskName = $scope.newTask.name.trim();
      var newStartTime = $scope.newTask.startTime ? $scope.newTask.startTime : new Date();
      var newStartTime = $scope.newTask.priority ? $scope.newTask.priority : 'generic';
      if (!newTaskName.length) {
        return;
      }
      if (!$scope.newTask.startTime) {
        return;
      }

      tasks.push({
        title: newTaskName,
        completed: false,
        endTime: $scope.newTask.endTime,
        startTime: newStartTime,
          priority: 'generic'
      });

      $scope.newTask = {};
    };

    $scope.removeTask = function(task) {
      tasks.splice(tasks.indexOf(task), 1);
    };
    $scope.reload = function (){
      localStorage.clear(); 
      location.reload();
    };
    $scope.now = new Date();

    $scope.duration = function(time1, time2){
      // var time1 = moment(time1);
      // var time2 = moment(time2);
      return moment.duration(time1.diff(time2)).asHours();
    };
    $scope.time_spent = function (time1, time2) {
        // var time1 = moment(time1);
        // var time2 = moment(time2);
        return time1.asSeconds()/time2.asSeconds()*100;

    };


  });
