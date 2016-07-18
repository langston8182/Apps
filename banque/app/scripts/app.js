'use strict';

/**
 * @ngdoc overview
 * @name banqueApp
 * @description
 * # banqueApp
 *
 * Main module of the application.
 */



angular
  .module('banqueApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .directive("login", function() {
    return function($scope, element, attrs) {
      $scope.$on('userInfo', function(event, data) {
        if ($scope.userInfo.logged) {
          element.modal('hide');
        }
      });
    }
  })
  .directive("erreurLogin", function($timeout) {
    return {
      template: '<div class="alert alert-danger" role="alert" >Login ou mot de passe incorrect.</div>',
      link: function($scope, element) {
          element.hide();
          $scope.$on('userInfo', function(event, data) {
            if (!$scope.userInfo.logged) {
              element.show();
              $timeout(function() {
                element.hide();
              }, 2000);
            }
          });
      }
    };
  })
  .run(function ($rootScope, $location, serviceAjax, $q) {
      $rootScope.$on('$routeChangeStart', function(event) {
      var userInfo = serviceAjax.getUserInfo();
      if (userInfo) {
        return $q.when(userInfo);
      } else {
        $location.path('/');
        return $q.reject({authenticated : false});
      }
    });
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/utilisateurs', {
        templateUrl: 'views/utilisateurs.html',
        controller: 'UtilisateursCtrl',
        controllerAs: 'utilisateurs',
      })
      .when('/ajouter', {
        templateUrl: 'views/ajouter.html',
        controller: 'AjouterCtrl',
        controllerAs: 'ajouter',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
