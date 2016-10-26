angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state) {
  $scope.logout = function() {
    $state.go('landing');
  }
})

.controller('loginCtrl', function($scope, $state, userDAO, dataShare) {
  $scope.authorization = {};
  $scope.login = function() {
    var promise = userDAO.getUsers();
    promise.then(function successCallback(response) {
      var authenticated = false;
      var users = response.data.data;
      for (var i = 0; i < users.length; i++) {
        if (users[i].username.toLowerCase() == $scope.authorization.username.toLowerCase() && users[i].password == $scope.authorization.password) {
          dataShare.sendData(users[i].username.toLowerCase());
          $state.go('app.profile');
          authenticated = true;
        }
      }
      if (!authenticated) {
        console.log("incorrect username/password");
      }
    }, function errorCallback(response) {
      //if duplicate email/username
      console.log(response);
    });
  }
})

.controller('signupCtrl', function($scope, $state, $ionicHistory, userDAO) {
  $scope.type = "password";
  $scope.input = {
    gender: "Male"
  };
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
    if (form.$valid) {
      var promise = userDAO.addUser($scope.input);
      promise.then(function successCallback(response) {
        console.log(response);
        $state.go('login');
      }, function errorCallback(response) {
        //if duplicate email/username
        console.log(response);
        alert("Unable to sign up. Please try again.")
      });
    }
  }

})

.controller('profileCtrl', function($scope, $state, dataShare) {
  $scope.myAppts = [{
    id: 1
  }, {
    id: 2
  }, {
    id: 3
  }]
  $scope.username = dataShare.getData();
})

.controller('myApptsCtrl', function($scope, $state, $ionicHistory) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }
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

.controller('proofCtrl', function($scope, $state, $ionicHistory, $window, $cordovaCamera, $cordovaFile, $ionicActionSheet, $cordovaImagePicker, $jrCrop, $ionicPlatform) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }

  // This is to display the action sheet
  $scope.show = function() {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [{
        text: 'Take A Photo'
      }, {
        text: 'Choose From Gallery'
      }],
      titleText: 'Upload Front of ID Card',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index == 0) {
          $scope.addImage();
        } else if (index == 1) {
          $scope.upload();
        }
        return true;
      }
    });
  };

  // This is to upload by taking photo
  // https://devdactic.com/how-to-capture-and-store-images-with-ionic/
  $scope.images = [];

  $scope.addImage = function() {
    var options = {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      targetWidth: 500,
      targetHeight: 500,
      quality: 80
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      onImageSuccess(imageData);

      function onImageSuccess(fileURI) {
        createFileEntry(fileURI);
      }

      function createFileEntry(fileURI) {
        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
      }

      function copyFile(fileEntry) {
        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
        var newName = makeid() + name;

        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
            fileEntry.copyTo(
              fileSystem2,
              newName,
              onCopySuccess,
              fail
            );
          },
          fail);
      }

      function onCopySuccess(entry) {
        $scope.$apply(function() {
          $scope.images = [];
          $scope.images.push(entry.nativeURL);
          $scope.crop($scope.images[0]);
        });
      }

      function fail(error) {
        console.log("fail: " + error.code);
      }

      function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

    }, function(err) {
      console.log(err);
    });
  }

  // This is to upload from Gallery
  $scope.collection = {
    selectedImage: ''
  };

  $ionicPlatform.ready(function() {

    $scope.collection = {
      selectedImage: ''
    };

    $ionicPlatform.ready(function() {
      $scope.upload = function() {
        // Image picker will load images according to these settings
        var options = {
          maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
          width: 360,
          height: 227,
        };

        $cordovaImagePicker.getPictures(options).then(function(results) {
          for (var i = 0; i < results.length; i++) {
            var imageData = results[i];
          }

          onImageSuccess(imageData);

          function onImageSuccess(fileURI) {
            createFileEntry(fileURI);
          }

          function createFileEntry(fileURI) {
            window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
          }

          function copyFile(fileEntry) {
            var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
            var newName = makeid() + name;

            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                fileEntry.copyTo(
                  fileSystem2,
                  newName,
                  onCopySuccess,
                  fail
                );
              },
              fail);
          }

          function onCopySuccess(entry) {
            $scope.$apply(function() {
              $scope.crop(entry.nativeURL);
            });
          }

          function fail(error) {
            console.log("fail: " + error.code);
          }

          function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++) {
              text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
          }

        }, function(err) {
          console.log(err);
        });
      };
    });
  });

  // For cropping
  $scope.crop = function(image) {
    $jrCrop.crop({
      url: image,
      width: 360,
      height: 227,
      title: 'Move and Scale'
    }).then(function(canvas) {
      dataURL = canvas.toDataURL("image/jpeg", 0.9);

      profilePhoto = document.createElement('img');
      profilePhoto.src = dataURL;
      localStorage.setItem("profilePicture", dataURL);
      $scope.profilePicture = dataURL;

      // Style your image here
      profilePhoto.style.width = '360px';
      profilePhoto.style.height = '227px';

      // After you are done styling it, append it to the BODY element
      var element;
      element = document.getElementById("profilephoto");
      if (element) {
        element.innerHTML = "";
      }
      document.querySelector('.cropped-photo').appendChild(profilePhoto);

      $scope.profilePictures[$scope.uid] = $scope.profilePicture;
      localStorage.setItem("profilePictures", JSON.stringify($scope.profilePictures));
    }, function() {
      // User canceled or couldn't load image.
    });
  };

  // For displaying the image
  $scope.urlForImage = function(imageName) {
    var name = imageName.substr(imageName.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;
    return trueOrigin;
  }
})

.controller('proof1Ctrl', function($ionicPopup, $scope, $state, $ionicHistory, $window, $cordovaCamera, $cordovaFile, $ionicActionSheet, $cordovaImagePicker, $jrCrop, $ionicPlatform) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Proof of Identity Uploaded!',
      template: 'Your account will be verified within 3 working days.'
    });

    alertPopup.then(function(res) {
      $state.go("app.profile");
    });
  };

  // This is to display the action sheet
  $scope.show = function() {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [{
        text: 'Take A Photo'
      }, {
        text: 'Choose From Gallery'
      }],
      titleText: 'Upload Front of ID Card',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index == 0) {
          $scope.addImage();
        } else if (index == 1) {
          $scope.upload();
        }
        return true;
      }
    });
  };

  // This is to upload by taking photo
  // https://devdactic.com/how-to-capture-and-store-images-with-ionic/
  $scope.images = [];

  $scope.addImage = function() {
    var options = {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      targetWidth: 500,
      targetHeight: 500,
      quality: 80
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      onImageSuccess(imageData);

      function onImageSuccess(fileURI) {
        createFileEntry(fileURI);
      }

      function createFileEntry(fileURI) {
        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
      }

      function copyFile(fileEntry) {
        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
        var newName = makeid() + name;

        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
            fileEntry.copyTo(
              fileSystem2,
              newName,
              onCopySuccess,
              fail
            );
          },
          fail);
      }

      function onCopySuccess(entry) {
        $scope.$apply(function() {
          $scope.images = [];
          $scope.images.push(entry.nativeURL);
          $scope.crop($scope.images[0]);
        });
      }

      function fail(error) {
        console.log("fail: " + error.code);
      }

      function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

    }, function(err) {
      console.log(err);
    });
  }

  // This is to upload from Gallery
  $scope.collection = {
    selectedImage: ''
  };

  $ionicPlatform.ready(function() {

    $scope.collection = {
      selectedImage: ''
    };

    $ionicPlatform.ready(function() {
      $scope.upload = function() {
        // Image picker will load images according to these settings
        var options = {
          maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
          width: 360,
          height: 227,
        };

        $cordovaImagePicker.getPictures(options).then(function(results) {
          for (var i = 0; i < results.length; i++) {
            var imageData = results[i];
          }

          onImageSuccess(imageData);

          function onImageSuccess(fileURI) {
            createFileEntry(fileURI);
          }

          function createFileEntry(fileURI) {
            window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
          }

          function copyFile(fileEntry) {
            var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
            var newName = makeid() + name;

            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                fileEntry.copyTo(
                  fileSystem2,
                  newName,
                  onCopySuccess,
                  fail
                );
              },
              fail);
          }

          function onCopySuccess(entry) {
            $scope.$apply(function() {
              $scope.crop(entry.nativeURL);
            });
          }

          function fail(error) {
            console.log("fail: " + error.code);
          }

          function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++) {
              text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
          }

        }, function(err) {
          console.log(err);
        });
      };
    });
  });

  // For cropping
  $scope.crop = function(image) {
    $jrCrop.crop({
      url: image,
      width: 360,
      height: 227,
      title: 'Move and Scale'
    }).then(function(canvas) {
      dataURL = canvas.toDataURL("image/jpeg", 0.9);

      profilePhoto = document.createElement('img');
      profilePhoto.src = dataURL;
      localStorage.setItem("profilePicture", dataURL);
      $scope.profilePicture = dataURL;

      // Style your image here
      profilePhoto.style.width = '360px';
      profilePhoto.style.height = '227px';

      // After you are done styling it, append it to the BODY element
      var element;
      element = document.getElementById("profilephoto");
      if (element) {
        element.innerHTML = "";
      }
      document.querySelector('.cropped-photo').appendChild(profilePhoto);

      $scope.profilePictures[$scope.uid] = $scope.profilePicture;
      localStorage.setItem("profilePictures", JSON.stringify($scope.profilePictures));
    }, function() {
      // User canceled or couldn't load image.
    });
  };

  // For displaying the image
  $scope.urlForImage = function(imageName) {
    var name = imageName.substr(imageName.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;
    return trueOrigin;
  }
})

.controller('reportCtrl', function($scope, $state, $ionicHistory) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }
})

.controller('scheduleApptCtrl', function($scope, $ionicPopup, $state, $ionicHistory, $ionicModal, bankDAO, branchDAO) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Appointment Confirmed!',
      template: 'You may view your appointments under My Appointments.'
    });

    alertPopup.then(function(res) {
      $state.go("app.profile");
    });
  };

  $scope.banks = [];
  $scope.branches = [];

  $scope.selectedBank = "Select a bank";
  $scope.selectedBranch = "Select a branch";
  $scope.selectedDate = "Select a date";
  $scope.selectedTime = "Select a time";

  $scope.hasSelectedBank = function() {
    if ($scope.selectedBank == "Select a bank") {
      return false;
    } else {
      return true;
    }
  }

  $scope.hasSelectedBranch = function() {
    if ($scope.selectedBranch == "Select a branch") {
      return false;
    } else {
      return true;
    }
  }

  $scope.hasSelectedDate = function() {
    if ($scope.selectedDate == "Select a date") {
      return false;
    } else {
      return true;
    }
  }

  var promise = bankDAO.getBanks();
  promise.then(function successCallback(response) {
    $scope.banks = response.data.data;
  }, function errorCallback(response) {
    console.log(response);
  });

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
    $scope.selectedBank = $scope.banks[index].bankname;
    $scope.closeBankModal();

    var promise = branchDAO.getBranches();
    promise.then(function successCallback(response) {
      var allBranches = response.data.data;
      $scope.branches = [];
      for (var i = 0; i < allBranches.length; i++) {
        if (allBranches[i].bank == $scope.banks[index].id) {
          $scope.branches.push({
            branchname: allBranches[i].branchname
          });
        }
      }
      //$scope.selectedBranch = $scope.branches[0].branchname;
    }, function errorCallback(response) {
      console.log(response);
    });
  }

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
    $scope.selectedBranch = $scope.branches[index].branchname;
    $scope.closeBranchModal();
  }
});
