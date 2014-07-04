var phonecatApp = angular.module('phonecatApp', []);

phonecatApp.controller('PhoneListCtrl', function($scope) {
    $scope.phones = [
      {'name': 'Name 1', 'snippet': 'Fast'},
      {'name': 'Name 2', 'snippet': 'Fast 2'},
      {'name': 'Name 3', 'snippet': 'Fast 3'}
    ]
})
