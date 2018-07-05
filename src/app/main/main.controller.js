(function () {
  angular
    .module('pms')
    .controller('MainController', MainController);

  // 메인 컨트롤러
  function MainController($log, $http, $location, $sessionStorage) {
    const vm = this;
    vm.lists = [];

    // /////// 소속 프로젝트 불러오기 //////////

    $http.get('/rest/session').then((result) => {
      vm.uid = result.data.uid;
      $http.get(`/rest/project/${vm.uid}`).then((res) => {
        vm.datas = res.data;
      });
    });

    vm.log = $log.log;
    vm.session = $sessionStorage.getObject('session');
    vm.query = {
      order: 'pid',
      limit: 7,
      page: 1
    };
  }
}());
