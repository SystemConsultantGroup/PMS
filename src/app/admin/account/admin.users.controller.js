(function () {
  angular
    .module('pms')
    .controller('AdminUsersController', ['$log', '$http', '$window', '$sessionStorage', '$state', AdminUsersController]);

  // admin/users 컨트롤러
  function AdminUsersController($log, $http, $window, $sessionStorage, $state) {
    const vm = this;

    vm.log = $log.log;
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

    $http.get('/rest/admin/users').then((res) => {
      vm.users = res.data;
    });
    vm.delete = (uid) => {
      const cf = window.confirm('Are you sure you want to delete?');
      if (cf) {
        $http.delete(`/rest/admin/user/${uid}`);
        alert('The user has been deleted.');
      }
      $state.go('adminUsers', {}, { reload: true });
    };
  }
}());
