(function () {
  angular
    .module('pms')
    .controller('MainController', MainController);

  // 로그인 컨트롤러
  function MainController($log) {
    const vm = this;
    vm.log = $log.log;

    vm.log('Main controller loaded');
  }
}());
