(function() {
  'use strict';

angular
  .module('pms')
  .controller('LoginController', LoginController);

//로그인 컨트롤러
function LoginController($log, $rootScope,$scope, $http, $state, $location, $sessionStorage, $document, $window, SHA256) {
    var vm = this;

    vm.login = function () {
      // 백엔드에 인증 시도
      $http.post('/profsystem/login', {
        uid: vm.uid,
        pw: SHA256(vm.pw)
      }).then(function (result) {
        if(result.data.result) {
          $window.location.assign('/profsystem/notice');
        }
        else if (vm.uid==null) alert("내선번호를 입력해주세요.");
        else alert("내선번호 또는 비밀번호를 다시 확인해주세요.");

        $sessionStorage.putObject('session',result.data);

      });
    };
    var input = $document[0].getElementById("password_input");

    if(input != null) {
      input.onkeyup = function(e) {
        if(e.keyCode == 13)
            vm.login();
        }
    }

    vm.logout = function () {
        $sessionStorage.remove('session');
        $http.get("/profsystem/logout").then(function() {
            $state.go('login');
        });
    };
}
})();
