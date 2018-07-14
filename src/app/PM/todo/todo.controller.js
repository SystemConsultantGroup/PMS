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
      order: 'tdid',
      limit: 10,
      page: 1
    };

    vm.initView = () => {
      $http.get(`/rest/project/todo/${vm.stateParams.tdid}`).then((result) => {
        vm.td = result.data;
      });
    };
    vm.initProject = () => {
      vm.tdid = vm.stateParams.tdid;
      vm.pid = vm.stateParams.pid;
      $http.get(`/rest/project/pmuid/${vm.pid}`).then((res) => {
        vm.restusers = [];
        vm.totalusers = res.data;
        $http.get(`/rest/project/todo/${vm.stateParams.tdid}`).then((result) => {
          vm.users = result.data.userlist;
          vm.uidlist = [];
          console.log(result.data.userlist);
          for (let i = 0; i !== vm.users.length; i += 1) {
            vm.uidlist.push(vm.users[i].uid);
            console.log(vm.uidlist);
          }
          for (let x = 0; x !== vm.totalusers.length; x += 1) {
            if (!vm.uidlist.includes(vm.totalusers[x].uid)) {
              vm.restusers.push(vm.totalusers[x]);
            }
          }
        });
      });
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
      $window.location.assign(`/todo/${vm.stateParams.pid}`);
    };
    vm.useradd = (uid, tdid, name) => {
      $http.post(`/rest/project/todo/${uid}/${tdid}`, {
        uid,
        tdid
      });
      alert(`${name} joined`);
      $window.location.reload();
    };
    vm.initModify = () => {
      $http.get(`/rest/project/todo/${vm.stateParams.tdid}`).then((result) => {
        vm.mtodo = result.data;
      });
    };
    vm.deleteUser = (uid) => {
      const cf = window.confirm('Delete?');
      if (cf) {
        $http.delete(`/rest/project/todo/user/${vm.stateParams.tdid}/${uid}`);
        alert('Deleted.');
        $window.location.reload();
      }
    };

    // 글 수정

    vm.modify = () => {
      if (vm.component === null) {
        vm.compoent = vm.mtodo.todo.component;
      }
      if (vm.duedate === null) {
        vm.duedate = new Date(vm.mtodo.todo.duedate);
      }
      $http.put(`/rest/project/todo/${vm.mtodo.todo.tdid}`, {
        tdid: vm.mtodo.todo.tdid,
        pid: vm.mtodo.todo.pid,
        component: vm.component,
        duedate: vm.duedate,
        done: vm.mtodo.todo.done,
      });
      $window.location.assign(`/todo/${vm.mtodo.todo.pid}`);
    };
    vm.todoDone = (td) => {
      $http.put(`/rest/project/todo/done/${td.body.tdid}`, {
        tdid: td.body.tdid,
        pid: td.body.pid,
        component: td.body.component,
        duedate: td.body.duedate,
        done: new Date(),
      });
      $window.location.reload();
      // console.log(vm.convert(new Date()));
    };
    vm.cancleDone = () => {
      vm.mtodo.todo.done = undefined;
    };
    vm.delete = (tdid) => {
      const cf = window.confirm('Delete?');
      if (cf) {
        $http.delete(`/rest/project/todo/${vm.pid}/${tdid}`);
        alert('Deleted.');
        $window.location.reload();
      }
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
