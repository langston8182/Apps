'use strict';

/**
 * @ngdoc function
 * @name banqueApp.controller:UtilisateursCtrl
 * @description
 * # UtilisateursCtrl
 * Controller of the banqueApp
 */
angular.module('banqueApp')
  .controller('UtilisateursCtrl', function ($scope, serviceAjax, $route) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.users = [];
    $scope.loadUsers = function() {
        serviceAjax.users().then(function(response) {
    		$scope.users = response;
    	}, function(error) {
    		console.log(error);
    	});
    };

    $scope.supprimerUtilisateur = function(id) {
    	serviceAjax.supprime(id);
    	$route.reload();
    };

    $scope.loadUser = function(id) {
    	serviceAjax.user(id).then(function(response) {
    		$scope.user = angular.fromJson(response.data[0]);
    	}, function(error) {
    		console.log(error);
    	});
    };

    $scope.modifierUtilisateur = function(id) {
    	serviceAjax.modifierUtilisateur(id, $scope.user.nom, $scope.user.prenom);
    	$scope.loadUsers();
    }

    $scope.loadUsers();
  });
