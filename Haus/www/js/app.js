// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'backand', 'ngMessages', 'ion-datetime-picker', 'ngCordova', 'jrCrop'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function(BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
  BackandProvider.setAppName('haus');
  BackandProvider.setSignUpToken('269ac5cd-5949-4e19-9cbe-50feb489c366');
  BackandProvider.setAnonymousToken('b109c358-b8fa-49da-adce-6e3ce78569f2');
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('landing', {
    url: '/landing',
    templateUrl: 'templates/landing.html'
  })

  .state('login', {
    url: '/login',
    cache: 'false',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/signup',
    cache: 'false',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('app.profile', {
    url: '/profile',
    cache: 'false',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('myAppts', {
    url: '/myAppts',
    cache: 'false',
    templateUrl: 'templates/myAppts.html',
    controller: 'myApptsCtrl'
  })

  .state('setup', {
    cache: 'false',
    url: '/setup',
    templateUrl: 'templates/setup.html',
    controller: 'setupCtrl'
  })

  .state('proof', {
    url: '/proof',
    cache: 'false',
    templateUrl: 'templates/proof.html',
    controller: 'proofCtrl'
  })

  .state('proof1', {
    url: '/proof1',
    cache: 'false',
    templateUrl: 'templates/proof1.html',
    controller: 'proof1Ctrl'
  })

  .state('report', {
    cache: 'false',
    url: '/report',
    templateUrl: 'templates/report.html',
    controller: 'reportCtrl'
  })

  .state('app.browseLoans', {
    url: '/browseLoans',
    views: {
      'menuContent': {
        templateUrl: 'templates/browseLoans.html'
      }
    }
  })

  .state('app.browseProperties', {
    url: '/browseProperties',
    views: {
      'menuContent': {
        templateUrl: 'templates/browseProperties.html'
      }
    }
  })

  .state('viewProperty', {
    cache: 'false',
    url: '/viewProperty',
    templateUrl: 'templates/viewProperty.html',
    controller: 'viewPropertyCtrl'
  })

  .state('app.scheduleAppt', {
    url: '/scheduleAppt',
    views: {
      'menuContent': {
        templateUrl: 'templates/scheduleAppt.html',
        controller: 'scheduleApptCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/landing');
})

.directive('passwordStrength', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      // regex
      // var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
      // var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

      function setAsChecking(bool) {
        ngModel.$setValidity('checking', !bool);
      }

      function setAsStrong(bool) {
        ngModel.$setValidity('strong', bool);
      }

      ngModel.$parsers.push(function(value) {
        if (!value || value.length == 0) return;

        setAsChecking(true);
        setAsStrong(false);

        if (strongRegex.test(value)) {
          setAsChecking(false);
          setAsStrong(true);
        } else {
          setAsChecking(false);
          setAsStrong(false);
        }

        return value;
      })
    }
  }
})

//Manage items object in /www/js/services.js
// .service('ItemsModel', function ($http, Backand) {
//     var service = this,
//     baseUrl = '/1/objects/',
//     objectName = 'items/';
//
//     ...
// })

.service('userDAO', function($http, Backand) {
  var service = {};
  var baseUrl = '/1/objects/',
    objectName = 'users/';

  function getUrl() {
    return Backand.getApiUrl() + baseUrl + objectName;
  }

  function getUrlForId(id) {
    return getUrl() + id;
  }

  service.getUsers = function() {
    return $http.get(getUrl());
  };

  service.getUser = function(id) {
    return $http.get(getUrlForId(id));
  };

  service.addUser = function(object) {
    return $http.post(getUrl(), object);
  };

  service.updateUser = function(id, object) {
    return $http.put(getUrlForId(id), object);
  };

  service.deleteUser = function(id) {
    return $http.delete(getUrlForId(id));
  };
  return service;
})

.service('appointmentDAO', function($http, Backand) {
  var service = {};
  var baseUrl = '/1/objects/',
    objectName = 'appointments/';

  function getUrl() {
    return Backand.getApiUrl() + baseUrl + objectName;
  }

  function getUrlForId(id) {
    return getUrl() + id;
  }

  service.getAppointments = function() {
    return $http.get(getUrl());
  };

  service.getAppointment = function(id) {
    return $http.get(getUrlForId(id));
  };

  service.addAppointment = function(object) {
    return $http.post(getUrl(), object);
  };

  service.updateAppointment = function(id, object) {
    return $http.put(getUrlForId(id), object);
  };

  service.deleteAppointment = function(id) {
    return $http.delete(getUrlForId(id));
  };
  return service;
})

.service('branchDAO', function($http, Backand) {
  var service = {};
  var baseUrl = '/1/objects/',
    objectName = 'bankbranches/';

  function getUrl() {
    return Backand.getApiUrl() + baseUrl + objectName;
  }

  function getUrlForId(id) {
    return getUrl() + id;
  }

  service.getBranches = function() {
    return $http.get(getUrl());
  };

  service.getBranch = function(id) {
    return $http.get(getUrlForId(id));
  };

  service.addBranch = function(object) {
    return $http.post(getUrl(), object);
  };

  service.updateBranch = function(id, object) {
    return $http.put(getUrlForId(id), object);
  };

  service.deleteBranch = function(id) {
    return $http.delete(getUrlForId(id));
  };
  return service;
})

.service('bankDAO', function($http, Backand) {
  //https://api.backand.com:443/1/objects/users?returnObject=false&deep=false
  var service = {};
  var baseUrl = '/1/objects/',
    objectName = 'banks/';

  function getUrl() {
    return Backand.getApiUrl() + baseUrl + objectName;
  }

  function getUrlForId(id) {
    return getUrl() + id;
  }

  service.getBanks = function() {
    return $http.get(getUrl());
  };

  service.getBank = function(id) {
    return $http.get(getUrlForId(id));
  };

  service.addBank = function(object) {
    return $http.post(getUrl(), object);
  };

  service.updateBank = function(id, object) {
    return $http.put(getUrlForId(id), object);
  };

  service.deleteBank = function(id) {
    return $http.delete(getUrlForId(id));
  };
  // CUSTOM QUERY
  // service.getUserByUsername = function(username) {
  //     return $http({
  //         method: 'GET',
  //         url: Backand.getApiUrl() + '/1/query/data/getUserByUsername',
  //         params: {
  //             parameters: {
  //                 username: username
  //             }
  //         }
  //     });
  // }
  return service;
})

.factory('myAppointments', function() {
  var service = {};
  service.data = false;
  service.sendData = function(data) {
    this.data = data;
  };
  service.getData = function() {
    return this.data;
  };
  service.clearData = function() {
    this.data = false;
  };
  return service;
})

.factory('dataShare', function() {
  var service = {};
  service.data = false;
  service.sendData = function(data) {
    this.data = data;
  };
  service.getData = function() {
    return this.data;
  };
  service.clearData = function() {
    this.data = false;
  };
  return service;
});
