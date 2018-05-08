(function() {
  'use strict';

angular
  .module('pms')
  .controller('MainController', MainController);

//로그인 컨트롤러
function MainController($log, $rootScope,$scope, $http, $state, $location, $sessionStorage, $document, $window, SHA256) {
    var vm = this;
    vm.log = $log.log;

    vm.log("Main controller loaded");

}
})();
