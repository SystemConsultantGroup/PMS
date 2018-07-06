(function () {
  angular
    .module('pms')
    .controller('developerController', developerController);

  // user/project 컨트롤러
  function developerController(
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

    vm.initView = () => {
      const pid = vm.stateParams.pid;
      $http.get(`/rest/project/${uid}/${pid}`).then((result) => {
        vm.project = result.data;
      });
    };
    vm.initMain = () => {
      $http.get('/rest/session').then((result) => {
        const pid = vm.stateParams.pid;
        const uid = result.data.uid;
        $http.get(`/rest/project/${uid}/${pid}`).then((res) => {
          vm.project = res.data[0];
        });
        $http.get(`/rest/user/${result.data.uid}`).then((res) => {
          vm.pminf = res.data;
        });
        $http.get(`/rest/project/pmpid/${pid}`).then((result) => {
          vm.todoess = result.data;
        });
        $http.get(`/rest/project/todo/${uid}/${pid}`).then((res) => {
          vm.todoes = res.data;
        });
        $http.get(`/rest/project/pmuid/${vm.stateParams.pid}`).then((result) => {
        vm.users = result.data;
        });
      });
    };
    vm.strconvert = (strdate) => {
      const date = new Date(strdate);
      return date.format();   
    };
    Date.prototype.format = function() {
      const mm = this.getMonth() + 1; // getMonth() is zero-based
      const dd = this.getDate();
      const hh = this.getHours();
      const m = this.getMinutes();
      const ss = this.getSeconds();
      return [this.getFullYear(),
              (mm>9 ? '' : '0') + mm,
              (dd>9 ? '' : '0') + dd
             ].join('-')+"/"+[
              (hh>9 ? '' : '0') + hh,
              (m>9 ? '' : '0') + m,
              (ss>9 ? '' : '0') + ss
             ].join(":");
    };
    $http.get('/rest/session').then(successCallback, errorCallback);
    function successCallback(response) {
      if (response.data.auth === 1) vm.state = 'admin';
      else if (response.data.auth === 0 && response.data.auth > 1) vm.state = 'user';
    }
    function errorCallback(error) {
      vm.log(error, 'can not get data.');
    }
  }
}());
