(function () {
  angular
    .module('pms')
    .controller('AccountController', AccountController);

  // admin/users 컨트롤러
  function AccountController($log, $sha, $http, $window, $sessionStorage, $location, $stateParams) {
    const vm = this;

    vm.log = $log.log;
    vm.stateParams = $stateParams;
    vm.session = $sessionStorage.getObject('session');
    vm.query = {
      order: 'pid',
      limit: 7,
      page: 1
    };
    vm.pwshow = "none";
    vm.npw = "";
    vm.changePW = () => {
      console.log(vm.pwshow);
      if(vm.pwshow==="none"){
        vm.pwshow="display";
      }
      else{
        vm.pwshow="none";
      }
    }
    function errorCallback(error) {
      vm.log(error, 'can not get data.');
    }
    vm.initModify = () =>{
      $http.get('/rest/session').then((response) => {
        if (response.data.error) {
          alert('해당 유저가 존재하지 않습니다.');
        }
        $http.get(`/rest/user/${response.data.uid}`).then((res) => {
        if (res.data.error) {
          alert('해당 유저가 존재하지 않습니다.');
        }
        vm.user = res.data;
        console.log(vm.user);
      });
        });
    }
    // 유저 수정
    vm.modify = () => {
      console.log(vm.npw);
      if(vm.npw === ""){
        $http.put(`/rest/user/${vm.user.uid}`, {
          uid: vm.user.uid,
          name: vm.user.name,
          auth: vm.user.auth,
          email: vm.user.email,
          ph: vm.user.ph,
          pw: vm.user.pw
        });
      }
      else {
        $http.put(`/rest/user/${vm.user.uid}`, {
          uid: vm.user.uid,
          name: vm.user.name,
          auth: vm.user.auth,
          email: vm.user.email,
          ph: vm.user.ph,
          pw: $sha.hash(vm.npw)
        });
      }
      $window.location.reload();
    };
  }
}());
