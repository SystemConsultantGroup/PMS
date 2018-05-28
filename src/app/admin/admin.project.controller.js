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

    vm.scope = $scope;

    vm.session = $sessionStorage.getObject('session');
    vm.query = {
      order: 'pid',
      limit: 7,
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

    vm.initView = function () {
      $http.get('/admin/project/{pid}').success((data) => {
        console.log(data);
        $scope.project = data;
      });
    };

    vm.delete = (pid) => {
      const cf = window.confirm('삭제하시겠습니까?');
      if (cf) {
        vm.pid = pid;
        $http.delete('/{vm.session.uid}/project/{pid}');
        alert('게시글이 삭제되었습니다.');
        vm.location.reload();
      }
    };


    $http.get('/session').then((result) => {
      if (result.data.auth === 1) { vm.user = 'admin'; } else if (result.data.auth === 0 && result.data.auth > 1) { vm.user = 'user'; }
    });

    $http.get('/session').then(successCallback, errorCallback);
    function successCallback(response) {
      // vm.$log.log(response);
      if (response.data.auth === 1) vm.state = 'admin';
      else if (response.data.auth === 0 && response.data.auth > 1) vm.state = 'user';
    }

    function errorCallback(error) {
      vm.$log.log(error, 'can not get data.');
    }

    // 글 목록 가져오기
    $http.get('/admin/project').then((response) => {
      vm.projects = response.data;
    });

    vm.add = () => {
      $http.post('/admin/project', {
        pid: vm.pid,
        name: vm.name,
        startdate: vm.startdate,
        duedate: vm.duedate,
        done: vm.done,
      });
      $window.location.path('/admin/project');
    };

    vm.initModify = function () {
      if (vm.pid != null) {
        // 글 데이터 불러오기
        $http.get('/admin/project/{vm.pid}').then((response) => {
          if (response.data.error) {
            alert('글이 존재하지 않습니다.');
          }
        });
      }
    };


    // 글 수정

    $scope.modify = function () {
      $http.put('/admin/project/{vm.pid}', {
        name: vm.name,
        startdate: vm.name,
        duedate: vm.duedate,
        doen: vm.done,
      });
      $location.path('/admin/project');
    };
  }
}());
