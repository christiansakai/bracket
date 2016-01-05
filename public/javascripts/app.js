var app = angular.module('codeYourBracket', []);
//Global service for global variables
app.factory('Global', [
  function() {
    'use strict';

        var _this = this;
        _this._data = {
            user: window.user,
            authenticated: false
        };
            // authenticated: (!!window.user) && (!!window.user.stripe_id)

        return _this._data;
    }
]);

app.service('invite', function(){
  var domainKeys = {
    'www.codersbracket.com': '32EWR3P5QM6ZMUUPH7KR',
    '127.0.0.1': 'JXBNGAWVNQDV3N8PQU2Y',
    'localhost': 'Q67TJEGRKLJQHHEUYZXM'
  };

  this.domainKey = domainKeys[window.location.hostname] || domainKeys['www.codersbracket.com'];

  this.getEmails = function(contacts) {
    return _.map(contacts, function(contact){
      return contact.primaryEmail();
    });
  };

  this.init = function(cb) {
    var self = this;

    cloudsponge.init({
      domain_key: this.domainKey,
      afterSubmitContacts: function(contacts, source, owner) {
        var emails = self.getEmails(contacts);
        cb(emails);
      }
    });
  };
});
app.directive('equals', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, elem, attrs, ngModel) {
      if(!ngModel) return; // do nothing if no ng-model

      // watch own value and re-validate on change
      scope.$watch(attrs.ngModel, function() {
        validate();
      });

      // observe the other value and re-validate on change
      attrs.$observe('equals', function (val) {
        validate();
      });

      var validate = function() {
        // values
        var val1 = ngModel.$viewValue;
        var val2 = attrs.equals;
        // set validity
        ngModel.$setValidity('equals', val1 === val2);
      };
    }
  };
});
app.controller('ForgotPasswordCtrl', function($scope, $http){
  $scope.submit = function() {
    $http.post("/forgot-password", { email: $scope.email }).
      success(function(data, status, headers, config){
        $scope.status = true;
        $scope.responseText = data.msg;
      }).
      error(function(data, status, headers, config){
        $scope.status = false;
        $scope.responseText = data.msg || 'An error occured. Please try again';
      });
  };
});
app.controller('ResetPasswordCtrl', function($scope, $http){
  $scope.submit = function(){
    $http.post("/reset-password", { token: bootstrapData.token, password: $scope.password }).
      success(function(data, status, headers, config){
        $scope.status = true;
        $scope.responseText = data.msg;
      }).
      error(function(data, status, headers, config){
        $scope.status = false;
        $scope.responseText = data.msg || 'An error occured. Please try again';
      });
  };
});
app.controller('MyAccountCtrl', function($scope, $http, $sce){
  $scope.user = bootstrapData.user;
  $scope.errorFlash = $sce.trustAsHtml(bootstrapData.errorFlash);
  console.log(bootstrapData);
  $scope.submit = function(){
    $http.post("/account", { user: $scope.user, password: $scope.password }).
      success(function(data, status, headers, config){
        $scope.status = true;
        $scope.responseText = data.msg;
      }).
      error(function(data, status, headers, config){
        $scope.status = false;
        $scope.responseText = data.msg || 'An error occured. Please try again';
      });
  };
});
app.controller('CreateGroupCtrl', function($scope, $http, invite, $sce){
  var brackets = bootstrapData.brackets || [];
  $scope.brackets = brackets;
  $scope.bracket = '';

  invite.init(setEmails);

  function reset() {
    $scope.emails = [];
    $scope.emailList = '';
    $scope.name = '';
    $scope.bracket = '';
    $scope.createGroupForm.$setPristine();
  }

  function setEmails(emails) {
    combineLists(emails);
    $scope.$digest();
  }

  function combineLists(emails) {
    var oldList = $scope.emailList ? $scope.emailList.split(',') : [];
    var newList = _.isArray(emails) && emails.length ? oldList.concat(emails) : oldList;

    $scope.emails = newList;
    $scope.emailList = newList.join(', ');
  }

  $scope.submit = function() {
    combineLists();

    $http.post("/groups", { name: $scope.name, bracket: $scope.bracket, emails: $scope.emails  }).
      success(function(data, status, headers, config){
        $scope.status = true;
        $scope.responseText = $sce.trustAsHtml(data.msg);
        reset();
      }).
      error(function(data, status, headers, config){
        $scope.status = false;
        $scope.responseText = $sce.trustAsHtml(data.msg) || 'An error occured. Please try again';
      });
  };
});
app.controller('GroupInviteCtrl', function($scope, $http, invite){
  $scope.group = bootstrapData.group;

  invite.init(setEmails);

  function reset() {
    $scope.emails = [];
    $scope.emailList = '';
    $scope.groupInviteForm.$setPristine();
  }

  function setEmails(emails) {
    combineLists(emails);
    $scope.$digest();
  }

  function combineLists(emails) {
    var oldList = $scope.emailList ? $scope.emailList.split(',') : [];
    var newList = _.isArray(emails) && emails.length ? oldList.concat(emails) : oldList;

    $scope.emails = newList;
    $scope.emailList = newList.join(', ');
  }

  $scope.submit = function() {
    combineLists();

    $http.post("/groups/invite", { group: $scope.group, emails: $scope.emails }).
      success(function(data, status, headers, config){
        $scope.status = true;
        $scope.responseText = data.msg;
        reset();
      }).
      error(function(data, status, headers, config){
        $scope.status = false;
        $scope.responseText = data.msg || 'An error occured. Please try again';
      });
  };
});
app.controller('ViewGroupCtrl', function($scope, $http, Global){
  $scope.group = bootstrapData.group;
  $scope.brackets = bootstrapData.brackets || [];

  if ($scope.group && $scope.group.bracket) {
    $scope.bracket = _.where($scope.brackets, {_id: $scope.group.bracket._id})[0] || "";
  } else {
    $scope.bracket = "";
  }


  $scope.submit = function() {
    $http.put("/groups", { group: $scope.group, bracket: $scope.bracket}).
      success(function(data, status, headers, config){
        $scope.status = true;
        $scope.responseText = data.msg;
      }).
      error(function(data, status, headers, config){
        $scope.status = false;
        $scope.responseText = data.msg || 'An error occured. Please try again';
      });
  };
});
app.controller('ViewGroupInviteCtrl', function($scope, $http, $sce){
  $scope.token = bootstrapData.token;
  $scope.submit = function() {
    $http.post("/groups/invite/" + $scope.token).
      success(function(data, status, headers, config){
        $scope.status = true;
        $scope.responseText = $sce.trustAsHtml(data.msg);
        $scope.accepted = true;
      }).
      error(function(data, status, headers, config){
        $scope.status = false;
        $scope.responseText = $sce.trustAsHtml(data.msg) || 'An error occured. Please try again';
      });
  };

  $scope.submitNew = function() {
    $http.post("/groups/invite/" + $scope.token, { user: $scope.user }).
      success(function(data, status, headers, config){
        $scope.status = true;
        $scope.responseText = $sce.trustAsHtml(data.msg);
        $scope.accepted = true;
      }).
      error(function(data, status, headers, config){
        $scope.status = false;
        $scope.responseText = $sce.trustAsHtml(data.msg) || 'An error occured. Please try again';
      });
  };
});
app.controller('GroupManageCtrl', function($scope, $http){
  $scope.groups = bootstrapData.groups || [];
  $scope.group = $scope.groups[0];

  $scope.brackets = bootstrapData.brackets || [];
  $scope.bracket = $scope.brackets[0];

  $scope.submit = function() {
    $http.post("/groups/manage", { group: $scope.group, bracket: $scope.bracket }).
      success(function(data, status, headers, config){
        $scope.status = true;
        $scope.responseText = data.msg;
      }).
      error(function(data, status, headers, config){
        $scope.status = false;
        $scope.responseText = data.msg || 'An error occured. Please try again';
      });
  };
});
app.controller('HeadersCtrl', function($scope, $http, Global){
  $scope.global = Global;
  // $scope.displayName = $scope.global.user.name.first + " " + $scope.global.user.name.last;
});

app.controller('UsersCtrl', function($scope, $http, Global){
  $scope.global = Global;
  // $('#donateAmount').val($scope.otherValue)
  // $('#totalDonationAmt').html($scope.otherValue)
  $scope.donationAmount = 20;
  $scope.useOtherVal = false;
  
  $scope.showOther = function (obj,$event) {
    $scope.useOtherVal = true;
  };
  
  $scope.hideOther = function (obj,$event) {
    $('#other_amt').hide();
  };
  
});
