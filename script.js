var app = angular.module('myApp',[]);

app.run([function () { }]);

app.controller('MainController', ['$scope','$http', function ($scope,$http){
  $scope.image = null;
  $scope.imageFileName = '';
  $scope.uploadedFile = null;
  
  $scope.uploadme = {};
  $scope.uploadme.src = '';
  $scope.showPrediction = false;
  $scope.predictionResult = [];

  function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

$("#file").change(function(){
    readURL(this);
});
  $scope.processImage = () =>{
    var f = document.getElementById('file').files[0];

      var form = new FormData();
      form.append("username", "acc_37279cae5fc01f1");
      form.append("password", "d6b44dbebb7a0e63b162e421d2954fd8");
      form.append("image", f, "");
      
      var settings = {
        "url": "https://api.imagga.com/v2/tags",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": "Basic YWNjXzM3Mjc5Y2FlNWZjMDFmMTpkNmI0NGRiZWJiN2EwZTYzYjE2MmU0MjFkMjk1NGZkOA=="
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        response = JSON.parse(response);
        $scope.predictionResult =[response.result.tags[0],response.result.tags[1],response.result.tags[2],response.result.tags[3],response.result.tags[4]];
        $scope.$apply(function(){
          $scope.showPrediction = true;
        });
        console.log($scope.showPrediction,$scope.predictionResult)
      });
  
  }
}]);

app.directive('fileDropzone', function() {
  return {
    restrict: 'A',
    scope: {
      file: '=',
      fileName: '='
    },
    link: function(scope, element, attrs) {
      var checkSize,
          isTypeValid,
          processDragOverOrEnter,
          validMimeTypes;
      
      processDragOverOrEnter = function (event) {
        if (event != null) {
          event.preventDefault();
        }
        event.dataTransfer.effectAllowed = 'copy';
        return false;
      };
      
      validMimeTypes = attrs.fileDropzone;
      
      checkSize = function(size) {
        var _ref;
        if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
          return true;
        } else {
          alert("File must be smaller than " + attrs.maxFileSize + " MB");
          return false;
        }
      };

      isTypeValid = function(type) {
        if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
          return true;
        } else {
          alert("Invalid file type.  File must be one of following types " + validMimeTypes);
          return false;
        }
      };
      
      element.bind('dragover', processDragOverOrEnter);
      element.bind('dragenter', processDragOverOrEnter);

      return element.bind('drop', function(event) {
        var file, name, reader, size, type;
        if (event != null) {
          event.preventDefault();
        }
        reader = new FileReader();
        file = event.dataTransfer.files[0];
        name = file.name;
        type = file.type;
        size = file.size;
        reader.readAsDataURL(file);
        return false;
      });
    }
  };
})
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);