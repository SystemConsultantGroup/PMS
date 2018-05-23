(function () {
  angular
    .module('pms')
    .controller('LoginController', LoginController);

  // 로그인 컨트롤러
  function LoginController($log) {
    const vm = this;
    vm.log = $log.log;

    vm.log('Login controller loaded');
  }
}());
