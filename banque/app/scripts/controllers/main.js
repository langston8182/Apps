'use strict';

/**
 * @ngdoc function
 * @name banqueApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the banqueApp
 */
angular.module('banqueApp')
  .controller('MainCtrl', function ($scope, $location, serviceAjax, $window) {
    $scope.isActive = function(location) {
    	return (location === $location.path() ? "active" : "");
    };

    $scope.authenticate = function() {
    	serviceAjax.login($scope.user).then(function(response) {
    		$scope.userInfo = angular.fromJson($window.sessionStorage['userInfo']);
    		$scope.$broadcast('userInfo',$scope.userInfo);
    		$location.path('/#/');
    	}, function(error) {
    		$scope.userInfo={logged:false};
    		$scope.$broadcast('userInfo',$scope.userInfo);
    	});
    };

    $scope.dismiss = function() {
    	if ($scope.userInfo) {
    		return "modal";
    	}
    };

    $scope.logout = function() {
    	serviceAjax.logout();
    	$scope.userInfo = null;
    	$location.path('/#/');
    }
  });
