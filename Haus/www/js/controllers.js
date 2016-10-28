angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state) {
  $scope.logout = function() {
    $state.go('landing');
  }
})

.controller('loginCtrl', function($scope, $state, userDAO, dataShare, $ionicLoading, $ionicPopup) {
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Logging In...</p><ion-spinner icon="lines" class="spinner-light"></ion-spinner>'
    });
  };

  $scope.hide = function() {
    $ionicLoading.hide();
  };

  $scope.authorization = {};
  $scope.login = function() {
    $scope.show();
    var promise = userDAO.getUsers();
    promise.then(function successCallback(response) {
      var authenticated = false;
      var users = response.data.data;
      for (var i = 0; i < users.length; i++) {
        if (users[i].username.toLowerCase() == $scope.authorization.username.toLowerCase() && users[i].password == $scope.authorization.password) {
          $scope.hide();
          localStorage.setItem("username", $scope.authorization.username.toLowerCase());
          localStorage.setItem("userID", users[i].id);
          localStorage.setItem("affordability", 0);
          $state.go('app.profile');
          authenticated = true;
        }
      }
      if (!authenticated) {
        $scope.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Opps!',
          template: 'You have entered an invalid username/password.'
        });

        alertPopup.then(function(res) {});
      }
    }, function errorCallback(response) {
      $scope.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Opps!',
        template: 'You have entered an invalid username/password.'
      });

      alertPopup.then(function(res) {});
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

.controller('profileCtrl', function($scope, $state, dataShare, appointmentDAO, myAppointments) {
    $scope.affordability = localStorage.getItem("affordability");
      $scope.username = localStorage.getItem("username");
  var promise = appointmentDAO.getAppointments();
  var myAppts = [];
  promise.then(function successCallback(response) {
    var appointments = response.data.data;
    for (var i = 0; i < appointments.length; i++) {
      if (appointments[i].user == localStorage.getItem("userID")) {
        myAppts.push({
          branch: appointments[i].branch,
          datetime: appointments[i].datetime,
          id: appointments[i].id,
          user: appointments[i].user
        });
      }
    }
    $scope.myAppts = myAppts;
    myAppointments.data = myAppts;
  }, function errorCallback(response) {
    console.log(response);
  });


})

.controller('browseLoansCtrl', function($scope, $state, $ionicHistory, myAppointments, branchDAO) {
    $scope.affordability1 = parseInt(localStorage.getItem("affordability")) + 1000;
    $scope.affordability2 = parseInt(localStorage.getItem("affordability")) + 1200;
    $scope.affordability3 = parseInt(localStorage.getItem("affordability")) + 1300;
    $scope.affordability4 = parseInt(localStorage.getItem("affordability")) + 1500;
})

.controller('myApptsCtrl', function($scope, $state, $ionicHistory, myAppointments, branchDAO) {
  $scope.appointments = myAppointments.data;

  var promise = branchDAO.getBranches();
  promise.then(function successCallback(response) {
    $scope.branches = response.data.data;
  }, function errorCallback(response) {
    console.log(response);
  });
  for (var i = 0; i < $scope.appointments.length; i++) {
    var datetime = new Date($scope.appointments[i].datetime);
    datetime = datetime.getTime();
    $scope.appointments[i].datetime = datetime;
  }
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }
})

.controller('setupCtrl', function($scope, $state, $ionicHistory, dataShare) {
  $scope.input = {
    type: "single",
    age: 21,
    residency: "spore",
    property: "hdb",
    term: 20,
    monthlyIncome: 0,
    cpfFunds: 0,
    cash: 0,
    totalDebt: 0
  };

  $scope.goBack = function() {
    $ionicHistory.goBack();
  }

  $scope.confirm = function() {
    $scope.tdsr = ($scope.input.monthlyIncome * 0.6 - $scope.input.totalDebt) * ($scope.input.term * 12) * 0.8 + $scope.input.cpfFunds + $scope.input.cash;
    dataShare.sendData($scope.tdsr);
    localStorage.setItem("affordability", $scope.tdsr);
    $state.go("report");
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

.controller('reportCtrl', function($scope, $state, $ionicHistory, dataShare) {
  $scope.tdsr = dataShare.getData();
  $scope.loanAmount = $scope.tdsr * 0.8;
  $scope.totalDeposit = $scope.tdsr * 0.2;
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }

})

.controller('viewPropertyCtrl', function($scope, $state, $ionicHistory, $ionicModal) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }

  $scope.allImages = [{
    'src': 'img/1.jpg'
  }, {
    'src': 'img/2.jpg'
  }, {
    'src': 'img/3.jpg'
  }, {
    'src': 'img/4.jpg'
  }];

  $scope.showImages = function(index) {
    $scope.activeSlide = index;
    $scope.showModal('templates/image-popover.html');
  }

  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }

  // Close the modal
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal.remove()
  };

  $scope.input = {};
  $scope.comments = [];

  $scope.postComment = function() {
    var dts = new Date().getTime();
    $scope.comments.push($scope.input.comment);
    $scope.input.comment = "";
  };
})

.controller('scheduleApptCtrl', function($scope, $ionicPopup, $state, $ionicHistory, $ionicModal, bankDAO, branchDAO, appointmentDAO) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }

  $scope.banks = [];
  $scope.branches = [];
  $scope.times = [{
    id: 1,
    time: "10:00 AM"
  }, {
    id: 2,
    time: "11:00 AM"
  }, {
    id: 3,
    time: "11:00 AM"
  }, {
    id: 4,
    time: "1:00 PM"
  }, {
    id: 5,
    time: "2:00 PM"
  }, {
    id: 6,
    time: "3:00 PM"
  }, {
    id: 7,
    time: "4:00 PM"
  }, {
    id: 8,
    time: "5:00 PM"
  }];

  $scope.selectedBank = "Select a bank";
  $scope.selectedBranch = "Select a branch";
  $scope.selectedDate = "Select a date";
  $scope.selectedTime = "Select a time";

  $scope.selectedBranchID = 0;

  $scope.scheduleAppt = function() {
    console.log($scope.selectedDate);
    console.log($scope.selectedTime);
    if (document.getElementById("date") != null && document.getElementById("time") != null) {
      var date = document.getElementById("date").innerHTML;
      var time = document.getElementById("time").innerHTML;
    }
    if ($scope.selectedBank == "Select a bank") {
      var alertPopup = $ionicPopup.alert({
        title: 'Invalid Entry!',
        template: 'Please select a bank'
      });
    } else if ($scope.selectedBranch == "Select a branch") {
      var alertPopup = $ionicPopup.alert({
        title: 'Invalid Entry!',
        template: 'Please select a branch'
      });
    } else if (date == "Select a date" || time == "Select a time") {
      var alertPopup = $ionicPopup.alert({
        title: 'Invalid Entry!',
        template: 'Please select a date/time'
      });
    } else {

      var dateTime = date + " " + time;
      var formattedDate = new Date(dateTime);
      console.log(date);
      console.log(time);
      console.log(formattedDate);
      var sentData = {
        "branch": $scope.selectedBranchID,
        "user": localStorage.getItem("userID"),
        "datetime": formattedDate
      };

      var promise = appointmentDAO.addAppointment(sentData);
      var alertPopup = $ionicPopup.alert({
        title: 'Appointment Confirmed!',
        template: 'You may view your appointments under My Appointments.'
      });
      alertPopup.then(function(res) {
        $state.go("app.profile");
      });
    }
  }

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
            id: allBranches[i].id,
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
    $scope.selectedBranchID = $scope.branches[index].id;
    $scope.selectedBranch = $scope.branches[index].branchname;
    $scope.closeBranchModal();
  }

  $ionicModal.fromTemplateUrl('timeModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.timeModal = modal;
  });
  $scope.openTimeModal = function() {
    $scope.timeModal.show();
  };
  $scope.closeTimeModal = function() {
    $scope.timeModal.hide();
  };
  $scope.selectTime = function(index) {
    $scope.selectedTimeID = $scope.times[index].id;
    $scope.selectedTime = $scope.times[index].time;
    $scope.closeTimeModal();
  }
});
