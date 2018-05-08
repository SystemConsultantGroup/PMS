(function() {
  'use strict';

angular
  .module('pms')
  .controller('LoginController', LoginController);

//로그인 컨트롤러
function LoginController($log, $rootScope,$scope, $http, $state, $location, $sessionStorage, $document, $window, SHA256) {
    var vm = this;
    vm.log = $log.log;

    vm.log("Login controller loaded");

}
})();
