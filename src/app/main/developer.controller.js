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


    vm.todoDone = (td) => {
      $http.put(`/rest/project/todo/done/${td.body.tdid}`, {
        tdid: td.body.tdid,
        pid: td.body.pid,
        component: td.body.component,
        duedate: td.body.duedate,
        done: vm.convert(new Date()),
      });
      $window.location.reload();
      //console.log(vm.convert(new Date()));
    };

    vm.convert = (date) => {
      const newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

      const offset = date.getTimezoneOffset() / 60;
      const hours = date.getHours();

      newDate.setHours(hours - offset);

      return newDate;   
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
