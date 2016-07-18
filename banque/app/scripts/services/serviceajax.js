'use strict';

/**
 * @ngdoc service
 * @name banqueApp.serviceAjax
 * @description
 * # serviceAjax
 * Factory in the banqueApp.
 */
angular.module('banqueApp')
  .factory('serviceAjax', function ($http, $q, $window) {
    var userInfo = angular.fromJson($window.sessionStorage['userInfo']);

    return {
      users: function () {
        return $http.get("http://localhost:3000/auth/users?token=" + userInfo.token).then(function(response) {
        	return response.data;
        });
      },

      supprime: function(id) {
      	return $http.get("http://localhost:3000/auth/supprime?id=" + id + "&token=" + userInfo.token);
      },

      user: function(id) {
      	return $http.get("http://localhost:3000/user?id=" + id);
      },

      modifierUtilisateur: function(id, nom, prenom) {
      	return $http.get("http://localhost:3000/modifierUtilisateur?id=" + id + "&nom=" + nom + "&prenom=" + prenom);
      },

      login: function(user) {
      		var deferred = $q.defer();
      		$http.post("http://localhost:3000/login/", user).then(function(response) {
      			userInfo = {
      				token:response.data.token,
      				login:response.data.login,
      				logged:true
      			};
            $window.sessionStorage['userInfo'] = JSON.stringify(userInfo);
      			deferred.resolve(userInfo);
      		}, function(error) {
      			deferred.reject(error);
      		});

      		return deferred.promise;
      },
      
      logout: function() {
      	userInfo = null;
      	$window.sessionStorage['userInfo'] = null;
      },

      getUserInfo: function() {
      		return angular.fromJson($window.sessionStorage['userInfo']);;
      },

      ajout: function(nom, prenom) {
      	return $http.get("http://localhost:3000/auth/ajout?nom=" + nom + "&prenom=" + prenom + "&token=" + userInfo.token);
      }
    };
  });
