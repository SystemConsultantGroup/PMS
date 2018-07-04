(function () {
  angular
    .module('pms')
    .controller('AdminProjectController', AdminProjectController);

  // admin/project 컨트롤러
  function AdminProjectController(
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

    vm.initProject = () => {}

    $http.get('/rest/session').then((result) => {
      vm.uid = result.data.uid;
    });

    $http.get('/rest/admin/users').then((res) => {
      vm.restusers = [];
      vm.totalusers = res.data;

      $http.get(`/rest/project/pmuid/${vm.stateParams.modify_id}`).then((result) => {
      vm.users = result.data;
      vm.uidlist = [];

      for (i in vm.users) {
        vm.uidlist.push(vm.users[i].uid)
      };


      for (x in vm.totalusers) {
        if (! vm.uidlist.includes(vm.totalusers[x].uid)) {
          vm.restusers.push(vm.totalusers[x]);
          console.log(vm.restusers)
        }
      };
    });
    });


    vm.initView = () => {
      const pid = vm.stateParams.view_id;
      $http.get(`/rest/admin/project/${pid}`).then((result) => {
        vm.project = result.data;
      });
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
      $http.post('/rest/admin/project', {
        uid: vm.uid,
        name: vm.name,
        startdate: vm.startdate,
        duedate: vm.duedate,
        done: null,
      });
      $window.location.assign('/admin/project');
    };

    vm.initModify = () => {
      const pid = vm.stateParams.modify_id;
      $http.get(`/rest/admin/project/${pid}`).then((result) => {
        vm.project = result.data;
      });
    };


    // 글 수정

    vm.modify = () => {
      $http.put(`/rest/admin/project/${vm.stateParams.modify_id}`, {
        name: vm.name,
        startdate: vm.startdate,
        duedate: vm.duedate,
        done: vm.done,
      });
      $location.path('/admin/project');
    };

    vm.delete = (pid) => {
      const cf = window.confirm('Delete?');
      if (cf) {
        $http.delete(`/rest/project/${vm.uid}/${pid}`);
        alert('Deleted.');
        $window.location.assign('/admin/project');
      }
    };

    vm.useradd = (uid, pid) => {
      $http.post(`/rest/project/${uid}/${pid}`, {
        role: 'joined'
      });
      alert(`${uid} joined`)
    };

  }
}());
