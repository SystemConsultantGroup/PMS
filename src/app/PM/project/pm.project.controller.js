(function () {
  angular
    .module('pms')
    .controller('PMController', PMController);

  // admin/project 컨트롤러
  function PMController(
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
    vm.deleteUser = (uid) => {
      const pid = vm.stateParams.pid;
      const cf = window.confirm('Delete?');
      if (cf) {
        $http.delete(`/rest/project/user/${pid}/${uid}`);
        alert('Deleted.');
        $window.location.reload();
      }
    }
    vm.initView = () => {
      vm.pid = vm.stateParams.pid;
      $http.get(`/rest/admin/project/${vm.stateParams.pid}`).then((result) => {
        vm.project = result.data;
      });
      $http.get(`/rest/project/pmpid/${vm.stateParams.pid}`).then((result) => {
        vm.todoes = result.data;
      });
      $http.get(`/rest/project/pmuid/${vm.stateParams.pid}`).then((result) => {
        vm.users = result.data;
      });
    };

    vm.initMain = () => {
      $http.get('/rest/session').then((result) => {
        $http.get(`/rest/project/pm/${result.data.uid}`).then((res) => {
          vm.projects = res.data;
        });
      });
    };
    vm.initProject = () => {
      vm.pid = vm.stateParams.pid;
      $http.get('/rest/admin/users').then((res) => {
        vm.restusers = [];
        vm.totalusers = res.data;

        $http.get(`/rest/project/pmuid/${vm.stateParams.pid}`).then((result) => {
            vm.users = result.data;
            vm.uidlist = [];

            for (i in vm.users) {
              vm.uidlist.push(vm.users[i].uid)
            };


            for (x in vm.totalusers) {
              if (! vm.uidlist.includes(vm.totalusers[x].uid)) {
                vm.restusers.push(vm.totalusers[x]);
              }
            };
          });
        });
      console.log(vm.restusers);
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
    vm.getpid = async () => {
      $http.get('/rest/session').then((result) => {
        vm.uid = result.data.uid;
      });
    };
    vm.add = () => {
      $http.post('/rest/admin/project', {
        uid: vm.uid,
        name: vm.name,
        startdate: vm.startdate,
        duedate: vm.duedate,
        done: null,
      });
      $window.location.assign('/pm/project');
    };
    vm.useradd = (uid, pid, name) => {
      $http.post(`/rest/project/${uid}/${pid}`, {
        role: 'joined'
      });
      alert(`${name} joined`);
      $window.location.reload()
    };
    vm.initModify = () => {
      const pid = vm.stateParams.pid;
      $http.get(`/rest/admin/project/${pid}`).then((result) => {
        vm.mproject = result.data;
        console.log(vm.mproject.name);
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

    vm.delete = (pid) => {
      const cf = window.confirm('Delete?');
      if (cf) {
        $http.delete(`/rest/project/${vm.uid}/${pid}`);
        alert('Deleted.');
        $window.location.reload();
      }
    };
  }
}());
