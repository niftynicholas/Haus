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
  $scope.input = {
    gender: "Male"
  };

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

  $scope.signup = function(form) {
    console.log(form);
    console.log(form.email.$viewValue);
    console.log(form.email.$viewValue);
    console.log(form.email.$viewValue);
    console.log(form.email.$viewValue);
    console.log(form.email.$viewValue);

    if (form.$valid) {
      var dataSent = {
        firstname: localStorage.getItem("CustID"), //add session
        lastname: $scope.input.BankID,
        gender: $scope.input.CardName,
        mobileno: $scope.input.CardID,
        email: 0,
        password: ""
      };
      userDAO.addUser(dataSent);
    }
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

  $scope.banks = [{
    id: 1,
    name: "DBS"
  }, {
    id: 2,
    name: "OCBC"
  }, {
    id: 3,
    name: "HSBC"
  }];

  $scope.selectedBank = $scope.banks[0].name;

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

  $scope.selectBank = function(index) {
    $scope.selectedBank = $scope.banks[index].name;
    $scope.closeBankModal();
  }

  $scope.branches = [{
    id: 1,
    name: "Alexandra Branch"
  }, {
    id: 2,
    name: "Kallang Wave Mall Branch"
  }, {
    id: 3,
    name: "Tampines Central Branch"
  }];

  $scope.selectedBranch = $scope.branches[0].name;

  $ionicModal.fromTemplateUrl('branchModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.branchModal = modal;
  });
  $scope.openBranchModal = function() {
    $scope.branchModal.show();
  };
  $scope.closeBranchModal = function() {
    $scope.branchModal.hide();
  };

  $scope.selectBranch = function(index) {
    $scope.selectedBranch = $scope.branches[index].name;
    $scope.closeBranchModal();
  }

  $scope.selectedDate = new Date();

  $scope.selectedTime = new Date();
});
