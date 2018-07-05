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
      const tdid = vm.stateParams.tdid;
      const pid = vm.stateParams.pid;
      $http.get(`/rest/project/todo/${tdid}`).then((result) => {
        vm.td = result.data;
      });
    };
    vm.initProject = () => {
      vm.tdid = vm.stateParams.tdid;
      vm.pid = vm.stateParams.pid;
      console.log(vm.stateParams.pid);
      $http.get(`/rest/project/pmuid/${vm.pid}`).then((res) => {
        vm.restusers = [];
        vm.totalusers = res.data;
        $http.get(`/rest/project/todo/${vm.stateParams.tdid}`).then((result) => {
            vm.users = result.data.userlist;
            vm.uidlist = [];
            console.log(result.data.userlist);
            for (i in vm.users) {
              vm.uidlist.push(vm.users[i].uid);
              console.log(vm.uidlist);
            };
            for (x in vm.totalusers) {
              if (! vm.uidlist.includes(vm.totalusers[x].uid)) {
                vm.restusers.push(vm.totalusers[x]);
              }
            };
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
      $location.path(`/todo/${vm.stateParams.pid}`);
    };
    vm.useradd = (uid, tdid, name) => {
      $http.post(`/rest/project/todo/${uid}/${tdid}`, {
        uid: uid,
        tdid: tdid
      });
      alert(`${name} joined`);
      $window.location.reload();
    };
    vm.initModify = () => {
      const tdid = vm.stateParams.tdid;
      $http.get(`/rest/project/todo/${vm.stateParams.tdid}`).then((result) => {
        vm.mtodo = result.data;
      });
    };
    vm.deleteUser = (uid) => {
      const tdid = vm.stateParams.tdid;
      const cf = window.confirm('Delete?');
      if (cf) {
        $http.delete(`/rest/project/todo/user/${tdid}/${uid}`);
        alert('Deleted.');
        $window.location.reload();
      }
    }

    // 글 수정

    vm.modify = () => {
      if(vm.component === null){
        vm.compoent = vm.mtodo.todo.component;
      }
      if(vm.duedate === null){
        vm.duedate = vm.mtodo.todo.duedate;
      }
      $http.put(`/rest/project/todo/${vm.mtodo.todo.tdid}`, {
        tdid: vm.mtodo.todo.tdid,
        pid: vm.mtodo.todo.pid,
        component: vm.component,
        duedate: vm.duedate,
        done: vm.mtodo.todo.done,
      });
      $location.path(`/todo/${vm.mtodo.todo.pid}`);
      console.log(vm.component,vm.duedate,vm.mtodo.todo.done,vm.mtodo.todo);
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
    }
    vm.cancleDone = () => {
      vm.mtodo.todo.done = null;
    }
    vm.delete = (tdid) => {
      const cf = window.confirm('Delete?');
      if (cf) {
        $http.delete(`/rest/project/todo/${vm.pid}/${tdid}`);
        alert('Deleted.');
        $window.location.reload();
      }
    };
    vm.convert = (date) => {
      const newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

      const offset = date.getTimezoneOffset() / 60;
      const hours = date.getHours();

      newDate.setHours(hours - offset);

      return newDate;   
    }
  }
}());
