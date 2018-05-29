(function () {
  angular
    .module('pms')
    .controller('AdminUsersController', AdminUsersController);

  // admin/users 컨트롤러
  function AdminUsersController($log, $http, $window, $sessionStorage) {
    const vm = this;

    vm.log = $log.log;
    vm.session = $sessionStorage.getObject('session');
    vm.query = {
      order: 'pid',
      limit: 7,
      page: 1
    };
    // 더미 데이터베이스
    vm.datas =
    [
      {
        p_name: 'AngularJs',
        td_name: 'AngularJs 독서',
        u_name: '이창원',
        startdate: '5/21',
        duedate: '6/11',
        done: true,
      },
      {
        p_name: 'AngularJs',
        td_name: 'AngularJs 공부하기',
        u_name: '김윤지',
        startdate: '5/23',
        duedate: '6/14',
        done: true,
      },
      {
        p_name: 'AngularJs',
        td_name: 'AngularJs 게시판 만들기',
        u_name: '조건희',
        startdate: '5/28',
        duedate: '6/2',
        done: false,
      },
      {
        p_name: 'project A',
        td_name: 'REST DOCUMENT 작성하기',
        u_name: '고현수',
        startdate: '5/29',
        duedate: '6/12',
        done: false,
      },
      {
        p_name: 'project A',
        td_name: 'DB 스키마 만들기',
        u_name: '김병남',
        startdate: '5/21',
        duedate: '6/11',
        done: true,
      },
      {
        p_name: 'project B',
        td_name: '레이아웃 작업하기',
        u_name: '류민재',
        startdate: '5/21',
        duedate: '6/11',
        done: true,
      },
      {
        p_name: 'project B',
        td_name: 'Config 파일 작성',
        u_name: '오영환',
        startdate: '5/21',
        duedate: '6/11',
        done: false,
      },
    ];

    vm.delete = (pid) => {
      const cf = window.confirm('삭제하시겠습니까?');
      if (cf) {
        vm.pid = pid;
        $http.delete('/{vm.session.uid}/project/{pid}');
        alert('게시글이 삭제되었습니다.');
        vm.location.reload();
      }
    };


    // 사용자 구분
    /* $http.get('/session').then(successCallback, errorCallback);
    function successCallback(response){
      //vm.$log.log(response);
      if(response.data.auth===10) vm.state = "admin";
      else if(response.data.auth<10 && response.data.auth >= 0) vm.state = "user";
    }
    function errorCallback(error) {
      vm.$log.log(error, 'can not get data.');
    }

    // 글 목록 가져오기
    $http.get('/main/1/main_post').then(function(response) {
      for(var i=0; i<response.data.length; i++) {
        response.data[i].updatedAt = response.data[i].updatedAt.split("T")[0];
      }
      vm.datas = response.data;
    }); */

    function remainingTodos() {
      const count = vm.datas.reduce((accumulator, currentValue) => {
        if (currentValue.done === false) return accumulator + 1;
        return accumulator;
      }, 0);

      return count;
    }

    vm.remainingTodos = remainingTodos();
  }
}());
