(function () {
  angular
    .module('pms')
    .controller('PMController', PMController);

  // admin/project 컨트롤러
  function PMController(
    $log, $http, $scope, $window, $location,
    $sessionStorage
  ) {
    const vm = this;
    vm.log = $log.log;
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
      $http.get('/rest/pm/project/{pid}').success((data) => {
        vm.project = data;
      });
    };

    vm.delete = (pid) => {
      const cf = window.confirm('삭제하시겠습니까?');
      if (cf) {
        vm.pid = pid;
        $http.delete('/rest/{vm.session.uid}/project/{pid}');
        alert('게시글이 삭제되었습니다.');
        vm.location.reload();
      }
    };


    $http.get('/rest/session').then((result) => {
      vm.session = result.data;
      if (vm.session.auth === 2) vm.user = 'pm';
      else if (vm.session.auth === 0 || vm.session.auth > 2) vm.user = 'user';
    });


    // 글 목록 가져오기
    $http.get('/rest/project/'.concat(vm.session.uid)).then((response) => {
      vm.projects = response.data;
    });

    vm.add = () => {
      $http.post('/rest/pm/project', {
        name: vm.name,
        startdate: vm.startdate,
        duedate: vm.duedate,
        done: vm.done,
      });
      $window.location.path('/pm/project');
    };

    vm.initModify = () => {
      if (vm.pid != null) {
        // 글 데이터 불러오기
        $http.get('/rest/pm/project/{vm.pid}').then((response) => {
          if (response.data.error) {
            alert('글이 존재하지 않습니다.');
          }
        });
      }
    };


    // 글 수정

    vm.modify = () => {
      $http.put('/rest/pm/project/{vm.pid}', {
        name: vm.name,
        startdate: vm.name,
        duedate: vm.duedate,
        done: vm.done,
      });
      $location.path('/pm/project');
    };
  }
}());
