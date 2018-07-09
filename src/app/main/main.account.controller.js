(function () {
  angular
    .module('pms')
    .controller('AccountController', ['$log', '$sha', '$http', '$window', '$sessionStorage', '$location', '$stateParams', '$state', AccountController]);

  // admin/users 컨트롤러
  function AccountController(
    $log, $sha, $http, $window, $sessionStorage, $location,
    $stateParams, $state
  ) {
    const vm = this;

    vm.log = $log.log;
    vm.stateParams = $stateParams;
    vm.session = $sessionStorage.getObject('session');
    vm.query = {
      order: 'pid',
      limit: 7,
      page: 1
    };
    vm.pwshow = 'none';
    vm.npw = '';
    vm.changePW = () => {
      console.log(vm.check);
      if (vm.pwshow === 'none' & $sha.hash(vm.check) === vm.user.pw) {
        vm.pwshow = 'display';
      } else {
        vm.pwshow = 'none';
      }
    };

    vm.initModify = () => {
      $http.get('/rest/session').then((response) => {
        if (response.data.error) {
          alert('해당 유저가 존재하지 않습니다.');
        }
        $http.get(`/rest/user/${response.data.uid}`).then((res) => {
          if (res.data.error) {
            alert('해당 유저가 존재하지 않습니다.');
          }
          vm.user = res.data;
        });
      });
    };

    vm.go = () => {
      $http.get('/rest/session').then((response) => {
        if (response.data.auth === 1) {
          $state.go('adminProject', {}, { reload: true });
        } else if (response.data.auth === 2) {
          $state.go('pmProject', {}, { reload: true });
        } else {
          $state.go('main', {}, { reload: true });
        }
      });
    };

    // 유저 수정
    vm.modify = () => {
      console.log(vm.npw);
      if (vm.npw === '') {
        $http.put(`/rest/user/${vm.user.uid}`, {
          uid: vm.user.uid,
          name: vm.user.name,
          auth: vm.user.auth,
          email: vm.user.email,
          ph: vm.user.ph,
          pw: vm.user.pw
        });
      } else {
        $http.put(`/rest/user/${vm.user.uid}`, {
          uid: vm.user.uid,
          name: vm.user.name,
          auth: vm.user.auth,
          email: vm.user.email,
          ph: vm.user.ph,
          pw: $sha.hash(vm.npw)
        });
      }
      $window.location.reload();
    };
  }
}());
