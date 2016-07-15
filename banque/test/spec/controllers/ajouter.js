'use strict';

describe('Controller: AjouterCtrl', function () {

  // load the controller's module
  beforeEach(module('banqueApp'));

  var AjouterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AjouterCtrl = $controller('AjouterCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AjouterCtrl.awesomeThings.length).toBe(3);
  });
});
