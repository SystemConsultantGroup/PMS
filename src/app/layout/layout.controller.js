(function () {
  angular
    .module('pms')
    .controller('LayoutController', LayoutController);

  /** @ngInject */
  function LayoutController($log, $state, $stateParams, $mdSidenav) {
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
    // link에 state이름, title에 사이드바에 띄우는 항목명
    vm.admin = [/*{
      link: 'notice',
      title: '공지사항',
      icon: 'announcement'
    }, {
      link: 'subject_manage',
      title: '과목',
      icon: 'assignment'
    }, {
      link: 'request_list',
      title: '신청 관리',
      icon: 'settings'
    }, {
      link: 'approveList',
      title: '최종 확정 내역',
      icon: 'dns'
    }, */{
      link: '/admin/users',
      title: 'Users List',
      icon: 'face'
    }, {
      link: '/admin/project',
      title: 'PM page',
      icon: 'event'
    }, /*{
      link: 'system',
      title: '시스템',
      icon: 'data_usage'
    }*/];
  }
}());
