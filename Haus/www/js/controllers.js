angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state) {
    $scope.logout = function() {
        $state.go('landing');
    }
})

.controller('loginCtrl', function($scope, $state) {
  $scope.login = function() {
      $state.go('app.profile');
  }
})

.controller('profileCtrl', function($scope, $state) {

})

.controller('setupCtrl', function($scope, $state, $ionicHistory) {
    $scope.data = {
        type: "single",
        age: 21,
        residency: "spore",
        property: "hdb",
        term: 20
    };
    $scope.goBack = function() {
        $ionicHistory.goBack();
    }
})

.controller('reportCtrl', function($scope, $state, $ionicHistory) {
    $scope.goBack = function() {
        $ionicHistory.goBack();
    }
})

.controller('scheduleApptCtrl', function($scope, $state, $ionicHistory) {
    $scope.goBack = function() {
        $ionicHistory.goBack();
    }
});
