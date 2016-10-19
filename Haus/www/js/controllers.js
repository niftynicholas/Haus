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

.controller('signupCtrl', function($scope, $state, $ionicHistory) {
  $scope.type = "password";

  $scope.toggleVisibility = function() {
    if ($scope.type == "password") {
      $scope.type = "text";
    } else if ($scope.type == "text") {
      $scope.type = "password";
    }
  }

  $scope.goBack = function() {
    $ionicHistory.goBack();
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

.controller('scheduleApptCtrl', function($scope, $state, $ionicHistory, $ionicModal) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }

  $ionicModal.fromTemplateUrl('bankModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.bankModal = modal;
  });
  $scope.openBankModal = function() {
    $scope.bankModal.show();
  };
  $scope.closeBankModal = function() {
    $scope.bankModal.hide();
  };
});
