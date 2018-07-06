(function () {
  angular
    .module('pms')
    .controller('AdminProjectController', AdminProjectController);

  // admin/project 컨트롤러
  function AdminProjectController(
    $log, $http, $scope, $window, $location,
    $sessionStorage, $stateParams, $state
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

    $http.get('/rest/session').then((result) => {
      vm.uid = result.data.uid;
    });

    $http.get('/rest/admin/users').then((res) => {
      vm.restusers = [];
      vm.pmSelect = [];
      vm.totalusers = res.data;
      $http.get(`/rest/admin/project/${vm.stateParams.pid}`).then((proj) => {
        vm.project = proj.data;
        for (let i = 0; vm.totalusers[i] != null; i += 1) {
          if (vm.project.uid === vm.totalusers[i].uid) {
            vm.pm = vm.totalusers[i];
            break;
          }
        }      
        if(vm.pm == null)
          vm.pmSelected = vm.totalusers[0].name;
        else
          vm.pmSelected = vm.pm.name;
        for (let i = 0; vm.totalusers[i] != null; i += 1) {
          vm.pmSelect.push(vm.totalusers[i].name);
        }
      });
      $http.get(`/rest/project/pmuid/${vm.stateParams.pid}`).then((result) => {
        vm.users = result.data;
        vm.uidlist = [];
        for (i in vm.users) {
          vm.uidlist.push(vm.users[i].uid);
        };
        for (x in vm.totalusers) {
          if (!vm.uidlist.includes(vm.totalusers[x].uid)) {
            vm.restusers.push(vm.totalusers[x]);
          }
        }
      });
    });
    vm.initProject = () => {
      vm.pid = vm.stateParams.pid;
      $http.get(`/rest/project/pmpid/${vm.stateParams.pid}`).then((result) => {
        vm.todoes = result.data;
        console.log(result.data);
      });
    };
    vm.initView = () => {
      const pid = vm.stateParams.pid;
      $http.get(`/rest/admin/project/${pid}`).then((result) => {
        vm.project = result.data;
      });
    };
    vm.initSelect = () => {
      
    };
    $http.get('/rest/session').then((result) => {
      if (result.data.auth === 1) { vm.user = 'admin'; } else if (result.data.auth === 0 && result.data.auth > 1) { vm.user = 'user'; }
    });

    $http.get('/rest/session').then(successCallback, errorCallback);
    function successCallback(response) {
      // vm.$log.log(response);
      if (response.data.auth === 1) vm.state = 'admin';
      else if (response.data.auth === 0 && response.data.auth > 1) vm.state = 'user';
    }

    function errorCallback(error) {
      vm.log(error, 'can not get data.');
    }

    // 글 목록 가져오기
    $http.get('/rest/admin/project').then((response) => {
      vm.projects = response.data;
    });

    vm.add = () => {
      for (let i = 0; vm.totalusers[i] != null; i += 1) {
        if (vm.pmSelected === vm.totalusers[i].name) {
          vm.uidSelected = vm.totalusers[i].uid;
          break;
        }
      }
      $http.post('/rest/admin/project', {
        uid: vm.uidSelected,
        name: vm.name,
        startdate: vm.startdate,
        duedate: vm.duedate,
        done: null,
      });
      $state.go('adminProject');
    };

    vm.initModify = () => {
      const pid = vm.stateParams.pid;
      $http.get(`/rest/admin/project/${pid}`).then((result) => {
        vm.projectt = result.data;
      });
    };
    // 프로젝트 수정
    vm.modify = () => {
      $http.put(`/rest/admin/project/${vm.stateParams.pid}`, {
        uid: vm.project.pmSelected,
        name: vm.project.name,
        startdate: vm.project.startdate,
        duedate: vm.project.duedate,
        done: vm.project.done,
      });
      $state.go('adminProject');
    };
    vm.deleteUser = (uid) => {
      const pid = vm.stateParams.pid;
      const cf = window.confirm('Delete?');
      if (cf) {
        $http.delete(`/rest/project/user/${pid}/${uid}`);
        alert('Deleted.');
        $window.location.reload();
      }
    };
    vm.delete = (pid) => {
      const cf = window.confirm('Delete?');
      if (cf) {
        $http.delete(`/rest/project/${vm.uid}/${pid}`);
        alert('Deleted.');
        $state.go('adminProject');
      }
    };

    vm.useradd = (uid, pid, name) => {
      $http.post(`/rest/project/${uid}/${pid}`, {
        role: 'joined'
      });
      alert(`${name} joined`);
      $window.location.reload();
    };
  }
}());
