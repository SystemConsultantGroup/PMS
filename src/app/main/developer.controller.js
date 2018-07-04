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
      vm.log(pid);
      $http.get(`/rest/project/${uid}/${pid}`).then((result) => {
        vm.project = result.data;
        vm.log(vm.project.project);
        vm.log(vm.project.todo);
        vm.log('asdfsadf');
        vm.log(vm.project);
      });
    };
    vm.initMain = () => {
      $http.get('/rest/session').then((result) => {
        const pid = vm.stateParams.pid;
        const uid = result.data.uid;
        vm.log(pid);
        vm.log(uid);
        $http.get(`/rest/project/${uid}/${pid}`).then((res) => {
          vm.project = res.data[0];
          vm.log(vm.project);
        });
        $http.get(`/rest/project/pmpid/${pid}`).then((result) => {
        vm.todoess = result.data;
        vm.log("adsfadsf");
        vm.log(vm.todoess);
      });
        $http.get(`/rest/project/todo/${uid}/${pid}`).then((res) => {
          vm.todoes = res.data;
          vm.log(vm.todoes);
          vm.log('todo');
        });
      });
    };
    $http.get('/rest/session').then(successCallback, errorCallback);
    function successCallback(response) {
      // vm.$log.log(response);
      if (response.data.auth === 1) vm.state = 'admin';
      else if (response.data.auth === 0 && response.data.auth > 1) vm.state = 'user';
    }
    function errorCallback(error) {
      vm.log(error, 'can not get data.');
    }
  }
}());
