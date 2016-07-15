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
    var userInfo;

    return {
      users: function () {
        return $http.get("http://localhost:3000/users/").then(function(response) {
        	return response.data;
        });
      },

      supprime: function(id) {
      	return $http.get("http://localhost:3000/supprime?id=" + id);
      },

      user: function(id) {
      	return $http.get("http://localhost:3000/user?id=" + id);
      },

      modifierUtilisateur: function(id, nom, prenom) {
      	return $http.get("http://localhost:3000/modifierUtilisateur?id=" + id + "&nom=" + nom + "&prenom=" + prenom);
      },

      /*authenticate: function(login, mdp) {
      	return $http.get("http://localhost:3000/login?id=" + login + "&mdp=" + mdp);
      },*/

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
      		return userInfo;
      },

      ajout: function(nom, prenom) {
      	return $http.get("http://localhost:3000/ajout?nom=" + nom + "&prenom=" + prenom);
      }
    };
  });
