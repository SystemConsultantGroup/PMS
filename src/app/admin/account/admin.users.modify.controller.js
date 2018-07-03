(function () {
  angular
    .module('pms')
    .controller('AdminUsersModifyController', AdminUsersModifyController);

  // admin/users 컨트롤러
  function AdminUsersModifyController(
    $log, $http, $window, $sessionStorage, $location,
    $stateParams
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
    $http.get('/rest/session').then((result) => {
      if (result.data.auth === 1) { vm.user = 'admin'; } else if (result.data.auth === 0 && result.data.auth > 1) { vm.user = 'user'; }
    });

    $http.get('/rest/session').then(successCallback, errorCallback);
    function successCallback(response) {
      if (response.data.auth === 1) vm.state = 'admin';
      else if (response.data.auth === 0 && response.data.auth > 1) vm.state = 'user';
    }

    function errorCallback(error) {
      vm.log(error, 'can not get data.');
    }
    vm.initModify = () => {
      if (vm.stateParams.modify_id != null) {
        // 유저 데이터 불러오기
        $http.get(`/rest/admin/user/${vm.stateParams.modify_id}`).then((response) => {
          if (response.data.error) {
            alert('This user does not exist.');
          }
          vm.user = response.data.user;
          vm.proj = response.data.project;
        });
      }
    };
    // 유저 수정
    vm.modify = () => {
      $http.put(`/rest/admin/user/${vm.stateParams.modify_id}`, {
        uid: vm.user.uid,
        name: vm.user.name,
        auth: vm.user.auth,
        email: vm.user.email,
        ph: vm.user.ph
      });
      $location.path('/admin/users');
    };
  }
}());
