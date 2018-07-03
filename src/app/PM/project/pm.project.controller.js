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

    // 더미 데이터베이스
    /* vm.projects =
    [
      {
        pid: 1,
        name: 'AngularJs 독서',
        startdate: '5/21',
        duedate: '6/11',
        done: true,
      },
      {
        pid: 2,
        name: 'AngularJs 공부하기',
        startdate: '5/23',
        duedate: '6/14',
        done: true,
      },
      {
        pid: 3,
        name: 'AngularJs 게시판 만들기',
        startdate: '5/28',
        duedate: '6/2',
        done: false,
      },
      {
        pid: 4,
        name: 'REST DOCUMENT 작성하기',
        startdate: '5/29',
        duedate: '6/12',
        done: false,
      },
      {
        pid: 5,
        name: 'DB 스키마 만들기',
        startdate: '5/21',
        duedate: '6/11',
        done: true,
      },
      {
        pid: 6,
        name: '레이아웃 작업하기',
        startdate: '5/21',
        duedate: '6/11',
        done: true,
      },
      {
        pid: 7,
        name: 'Config 파일 작성',
        startdate: '5/21',
        duedate: '6/11',
        done: false,
      },
    ]; */

    

    vm.initView = () => {
      const pid = vm.stateParams.pid;
      $http.get(`/rest/admin/project/${pid}`).then((result) => {
        vm.project = result.data;
      });
      $http.get(`/rest/project/pmid/${pid}`).then((result) => {
        vm.todoes = result.data.todo;
      });
      $http.get(`/rest/project/pmuid/${pid}`).then((result) => {
        vm.users = result.data;
        console.log(result.data);
      });
    };
    vm.initMain = () => {
      $http.get('/rest/session').then((result) => {
        $http.get(`/rest/project/pm/${result.data.uid}`).then((res) => {
          vm.projects = res.data;
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
        [vm.project] = result.data;
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
  }
}());
