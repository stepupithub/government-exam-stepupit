'use strict';

var appModule = angular.module('smModule', ['ngRoute', 'ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'toastr', 'ngAnimate']);

appModule.run(function($rootScope, $timeout, $location, icdb, $http, alertService) {
    $rootScope.g = {};


    $rootScope.g.logout = function(key) {
        $http.post('api/user/logout').success(function() {
            $location.path('login');
        });
    }
});


appModule.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode({
            enabled: false,
            requireBase: true
        }).hashPrefix('!');

        $stateProvider.state('login', {
            url: '/login',
            templateUrl: '/angular/views/login.html',
        });

        $stateProvider.state('index', {
            url: '/index',
            templateUrl: '/angular/views/index.html',
        });


        $urlRouterProvider.otherwise('/login');
    }
]);