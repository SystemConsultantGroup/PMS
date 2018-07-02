(function () {
  angular
    .module('pms')
    .controller('LoginController', LoginController);

  // 로그인 컨트롤러
  function LoginController($log, $window, $sessionStorage, $document, $http, $state, $sha) {
    const vm = this;
    vm.log = $log.log;

    vm.login = () => {
      // 백엔드에 인증 시도
      $http.post('/rest/login', {
        uid: vm.uid,
        pw: $sha.hash(vm.pw)
      }).then((result) => {
        if (result.data.result) {
          if (result.data.auth === 1) {
            $state.go('adminProject').then(() => {
              $window.location.reload(true);
            });
          } else {
            $state.go('main').then(() => {
              $window.location.reload(true);
            });
          }
        } else if (vm.uid == null) alert('Please enter your ID');
        else alert('Please check your ID and PW again.');

        $sessionStorage.putObject('session', result.data);
      });
    };

    /* vm.login = () => {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.uid, vm.pw, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.uid, vm.pw);
                    $location.path('/main');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                    console.log("Error")
                }
            });
        }; */


    const input = $document[0].getElementById('password_input');

    if (input != null) {
      input.onkeyup = function (e) {
        if (e.keyCode === 13) { vm.login(); }
      };
    }

    vm.logout = () => {
      $sessionStorage.remove('session');
      $http.get('/rest/logout').then(() => {
        $window.location.assign('/login');
      });
    };

    vm.register = () => {
      $http.post('/rest/user', {
        name: vm.name,
        uid: vm.uid,
        pw: $sha.hash(vm.pw),
        email: vm.email,
        ph: vm.ph
      });
      $window.location.assign('/login');
    };
  }
}());
