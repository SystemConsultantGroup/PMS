(function () {
  angular
    .module('pms')
    .controller('AdminApproveController', AdminApproveController);

  // admin/users 컨트롤러
  function AdminApproveController($log, $http, $window, $sessionStorage) {
    const vm = this;

    vm.log = $log.log;
    vm.session = $sessionStorage.getObject('session');
    vm.query = {
      order: 'uid',
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

    vm.initUsers = () => {
      $http.get('/rest/admin/users/default').then((response) => {
        if (response.data.error) {
          alert('승인 대상 유저가 존재하지 않습니다.');
        }
        vm.user = response.data;
      });
    };
    vm.approve = (uid) => {
      console.log(uid);
      const cf = window.confirm('승인하시겠습니까?');
      if (cf) {
        $http.put(`/rest/admin/users/approve/${uid}`);
        alert('해당 유저가 승인되었습니다.');
        $window.location.reload();
      }
    };
  }
}());
