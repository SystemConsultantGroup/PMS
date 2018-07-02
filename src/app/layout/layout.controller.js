(function () {
  angular
    .module('pms')
    .controller('LayoutController', LayoutController);

  /** @ngInject */
  function LayoutController($log, $state, $stateParams, $mdSidenav, $http, $sessionStorage) {
    const vm = this;
    /* 교수 정보 */
    vm.state = $state;
    vm.stateParams = $stateParams;
    vm.log = $log.log;
    vm.act = 'none';
    vm.toggleLeft = () => {
      $mdSidenav('left').toggle();
    };
    vm.close = () => {
      $mdSidenav('left').close();
    };

    vm.change = () => {
      if (vm.act === 'none') vm.act = 'block';
      else if (vm.act === 'block') vm.act = 'none';
    };
    vm.init = () => {
      $http.get('/rest/session').then((result) => {
      
      vm.auth = result.data.auth;
      vm.name = result.data.name;
      vm.uid = result.data.uid;
      vm.log(result.data);
      vm.log(result.data.auth);
      $http.get(`/rest/project/${vm.uid}`).then((result)=> {
        //vm.log(result.data);
        vm.projects = result.data;
        vm.log(result.data);
        if(vm.auth == 1){
        vm.log("asdfasdf");
      vm.side = [{
        link: 'adminUsers',
        title: 'User List',
        icon: 'face'
      }, {
        link: 'adminProject',
        title: 'PM page',
        icon: 'event'
      }, {
        link: 'adminUserApprove',
        title: 'User Approve',
        icon: 'dns'
      },
      ];
    } else{
      let i = 0;
      vm.side = new Array;
      while(vm.projects != null){
        vm.side.push({
          link: vm.projects[i].name,
          title: vm.projects[i].name,
          icon: 'project'
        });
        i++;
      }
    }
      });
    });

    };
    vm.init2 = (uid) => {
      vm.log(uid);
      $http.get(`/rest/project/${uid}`).then((result)=> {
        //vm.log(result.data);
        vm.projects = result.data;
        vm.log(result.data);
      });
      vm.log(vm.projects);
    };
    
    // link에 state이름, title에 사이드바에 띄우는 항목명
    vm.sidevar = (auth) => {
      if(auth == 1){
        vm.side = [{
        link: 'adminUsers',
        title: 'User List',
        icon: 'face'
      }, {
        link: 'adminProject',
        title: 'PM page',
        icon: 'event'
      }, {
        link: 'adminUserApprove',
        title: 'User Approve',
        icon: 'dns'
      },
      ];
    } else{
      let i = 0;
      vm.side = new Array;
      //projects[0];
      while(vm.projects != null){
        vm.side.push({
          link: vm.projects[i].name,
          title: vm.projects[i].name,
          icon: 'project'
        });
        i++;
      }
    }
  };
  }
}());
