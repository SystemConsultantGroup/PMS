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
      const cf = window.confirm('Delete?');
      if (cf) {
        $http.delete(`/rest/project/user/${vm.stateParams.pid}/${uid}`);
        alert('Deleted.');
        $window.location.reload();
      }
    };
    vm.initView = () => {
      vm.pid = vm.stateParams.pid;
      $http.get(`/rest/admin/project/${vm.stateParams.pid}`).then((result) => {
        vm.project = result.data;
        $http.get(`/rest/user/${result.data.uid}`).then((res) => {
          vm.pminf = res.data;
        });
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

    $http.get('/rest/session').then((result) => {
      vm.uid = result.data.uid;
    });

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
      $window.location.reload();
    };
    vm.initModify = () => {
      $http.get(`/rest/admin/project/${vm.stateParams.pid}`).then((result) => {
        vm.mproject = result.data;
        console.log(vm.mproject.name);
      });
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
      // console.log(vm.convert(new Date()));
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
    vm.modify = () => {
      if (vm.name === null) {
        vm.name = vm.mproject.name;
      }
      if (vm.duedate === null) {
        vm.duedate = new Date(vm.mproject.duedate);
      }
      if (vm.startdate === null) {
        vm.startdate = new Date(vm.mproject.startdate);
      }
      if (vm.done == null) {
        vm.done = new Date(vm.mproject.done);
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

    vm.cancleDone = () => {
      vm.mproject.done = undefined;
    };
  }
}());
