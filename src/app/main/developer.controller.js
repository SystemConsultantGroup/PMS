(function () {
  angular
    .module('pms')
    .controller('developerController', developerController);

  // user/project 컨트롤러
  function developerController(
    $log, $http, $scope, $window, $location,
    $sessionStorage, $stateParams
  ) {
    const vm = this;
    vm.log = $log.log;
    vm.stateParams = $stateParams;
    vm.session = $sessionStorage.getObject('session');
    vm.query = {
      order: 'pid',
      limit: 10,
      page: 1
    };

    vm.initView = () => {
      const pid = vm.stateParams.pid;
      $http.get(`/rest/project/${uid}/${pid}`).then((result) => {
        vm.project = result.data;
      });
    };
    vm.initMain = () => {
      $http.get('/rest/session').then((result) => {
        const pid = vm.stateParams.pid;
        const uid = result.data.uid;
        $http.get(`/rest/project/${uid}/${pid}`).then((res) => {
          vm.project = res.data[0];
        });
        $http.get(`/rest/project/pmpid/${pid}`).then((result) => {
          vm.todoess = result.data;
        });
        $http.get(`/rest/project/todo/${uid}/${pid}`).then((res) => {
          vm.todoes = res.data;
        });
      });
    };
    $http.get('/rest/session').then(successCallback, errorCallback);
    function successCallback(response) {
      if (response.data.auth === 1) vm.state = 'admin';
      else if (response.data.auth === 0 && response.data.auth > 1) vm.state = 'user';
    }
    function errorCallback(error) {
      vm.log(error, 'can not get data.');
    }
  }
}());
