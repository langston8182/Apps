'use strict';

/**
 * @ngdoc function
 * @name banqueApp.controller:AjouterCtrl
 * @description
 * # AjouterCtrl
 * Controller of the banqueApp
 */
angular.module('banqueApp')
  .controller('AjouterCtrl', function ($scope, serviceAjax, $timeout) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.ajouterUtilisateur = function() {
    	serviceAjax.ajout($scope.nom, $scope.prenom);
    	$scope.ajoutOK = "L'utilisateur à été ajouté";
    	$timeout(function() {
    		reset();
    	}, 2000);

    	$scope.isOK = true;

    	function reset() {
    		$scope.nom = "";
    		$scope.prenom = "";
    	}
    }
  });
