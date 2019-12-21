'use strict';
appModule.controller('UserController', ['$scope', '$http', '$location', 'alertService',
    function($scope, $http, $location, alertService) {
        $scope.uObj = {};

        $scope.uObj.login = {};
        $scope.uObj.login.model = {};
        $scope.uObj.login.submit = function(form) {

        	if($scope.uObj.login.model.username=='aa' && $scope.uObj.login.model.password=='aa'){
            	$location.path('index');
            	alertService.flash('success', 'Login successfully');
        	} else {
        		alertService.flash('error', 'User and Password wrong');
        	}
        }
    }
]);
