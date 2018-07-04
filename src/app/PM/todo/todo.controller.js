(function () {
  angular
    .module('pms')
    .controller('TodoController', TodoController);

  // admin/project 컨트롤러
  function TodoController(
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
      const tdid = vm.stateParams.tdid;
      $http.get(`/rest/project/todo/${tdid}`).then((result) => {
        vm.td = result.data;
        console.log(result.data);
      });
      console.log(tdid);
    };

    vm.initMain = () => {
      vm.pid = vm.stateParams.pid;
      $http.get(`/rest/project/pmpid/${vm.stateParams.pid}`).then((result) => {
        vm.todoes = result.data;
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

    vm.add = () => {
      $http.post('/rest/project/todo', {
        pid: vm.stateParams.pid,
        component: vm.component,
        duedate: vm.duedate,
        done: null,
      });
      $location.path(`/todo/${vm.stateParams.pid}`);
    };

    vm.initModify = () => {
      const tdid = vm.stateParams.tdid;
      $http.get(`/rest/project/todo/${tdid}`).then((result) => {
        vm.mtodo = result.data;
        console.log(result.data);
      });
    };


    // 글 수정

    vm.modify = () => {
      if(vm.name === null){
        vm.name = vm.mproject.name;
      }
      if(vm.duedate === null){
        vm.duedate = vm.mproject.duedate;
      }
      if(vm.startdate === null){
        vm.startdate = vm.mproject.startdate;
      }
      if(vm.done == null){
        vm.done = vm.mproject.done;
      }
      $http.put(`/rest/admin/project/${vm.stateParams.pid}`, {
        name: vm.name,
        startdate: vm.startdate,
        duedate: vm.duedate,
        done: vm.done,
      });
      $location.path(`/pm/project/${vm.stateParams.pid}`);
    };

    vm.delete = (tdid) => {
      const cf = window.confirm('Delete?');
      if (cf) {
        console.log(vm.pid,tdid);
        $http.delete(`/rest/project/todo/${vm.pid}/${tdid}`);
        alert('Deleted.');
        window.location.reload();
      }
    };
  }
}());
