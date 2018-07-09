(function () {
  angular
    .module('pms')
    .controller('AdminProjectController', ['$log', '$http', '$scope', '$window', '$location',
      '$sessionStorage', '$stateParams', '$state', AdminProjectController]);

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
        for (let i = 0; i !== vm.totalusers.length; i += 1) {
          if (vm.project.uid === vm.totalusers[i].uid) {
            vm.pm = vm.totalusers[i];
            break;
          }
        }
        if (vm.pm == null) {
          vm.pmSelected = vm.totalusers[0].name;
        } else {
          vm.pmSelected = vm.pm.name;
        }
        for (let i = 0; i !== vm.totalusers.length; i += 1) {
          vm.pmSelect.push(vm.totalusers[i].name);
        }
      });
      $http.get(`/rest/project/pmuid/${vm.stateParams.pid}`).then((result) => {
        vm.users = result.data;
        vm.uidlist = [];
        for (let i = 0; i !== vm.users.length; i += 1) {
          vm.uidlist.push(vm.users[i].uid);
        }
        for (let x = 0; x !== vm.totalusers.length; x += 1) {
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
      });
    };

    vm.initView = () => {
      $http.get(`/rest/admin/project/${vm.stateParams.pid}`).then((result) => {
        vm.project = result.data;
      });
    };

    vm.initSelect = () => {

    };

    $http.get('/rest/session').then((result) => {
      if (result.data.auth === 1) {
        vm.user = 'admin';
      } else if (result.data.auth === 0 && result.data.auth > 1) {
        vm.user = 'user';
      }
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

    vm.pminf = (uid) => {
      for (let i = 0; i !== vm.totalusers.length; i += 1) {
        if (vm.totalusers[i].uid === uid) {
          vm.pmname = vm.totalusers[i].name;
        }
      }
      return vm.pmname;
    };

    vm.add = () => {
      for (let i = 0; i !== vm.totalusers.length; i += 1) {
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
      $state.go('adminProject', {}, { reload: true });
    };

    // 프로젝트 수정
    vm.modify = () => {
      for (let i = 0; i !== vm.totalusers.length; i += 1) {
        if (vm.pmSelected === vm.totalusers[i].name) {
          vm.uidSelected = vm.totalusers[i].uid;
          break;
        }
      }
      $http.put(`/rest/admin/project/${vm.stateParams.pid}`, {
        uid: vm.uidSelected,
        name: vm.project.name,
        startdate: vm.project.startdate,
        duedate: vm.project.duedate,
        done: vm.project.done,
      });
      $state.go('adminProject', {}, { reload: true });
    };
    vm.projectDone = (p) => {
      $http.put(`/rest/admin/project/${p.body.pid}`, {
        pid: p.body.pid,
        uid: p.body.uid,
        name: p.body.name,
        duedate: p.body.duedate,
        done: new Date(),
      });
      $window.location.reload();
    };
    vm.deleteUser = (uid) => {
      const cf = window.confirm('Delete?');
      if (cf) {
        $http.delete(`/rest/project/user/${vm.stateParams.pid}/${uid}`);
        alert('Deleted.');
        $window.location.reload();
      }
    };
    vm.delete = (pid) => {
      const cf = window.confirm('Delete?');
      if (cf) {
        $http.delete(`/rest/project/${vm.uid}/${pid}`);
        alert('Deleted.');
        $state.go('adminProject', {}, { reload: true });
      }
    };

    vm.useradd = (uid, pid, name) => {
      $http.post(`/rest/project/${uid}/${pid}`, {
        role: 'joined'
      });
      alert(`${name} joined`);
      $state.reload();
    };
    vm.strconvert = (strdate) => {
      const date = new Date(strdate);
      return date.format();
    };
    Date.prototype.format = function () {
      const mm = this.getMonth() + 1; // getMonth() is zero-based
      const dd = this.getDate();
      const hh = this.getHours();
      const m = this.getMinutes();
      const ss = this.getSeconds();
      return `${[this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
      ].join('-')}/${[
        (hh > 9 ? '' : '0') + hh,
        (m > 9 ? '' : '0') + m,
        (ss > 9 ? '' : '0') + ss
      ].join(':')}`;
    };
  }
}());
