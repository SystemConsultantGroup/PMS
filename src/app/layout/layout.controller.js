(function () {
  angular
    .module('pms')
    .controller('LayoutController', LayoutController);

  /** @ngInject */
  function LayoutController($state, $stateParams) {
    const vm = this;
    /* 교수 정보 */
    vm.state = $state;
    vm.stateParams = $stateParams;

    vm.toggleLeft = function () {
      $mdSidenav('left').toggle();
    };

    vm.close = function () {
      $mdSidenav('left').close();
    };

    // link에 state이름, title에 사이드바에 띄우는 항목명
    vm.admin = [{
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
    }, {
      link: 'user_manage',
      title: '사용자',
      icon: 'face'
    }, {
      link: 'timemodel_list',
      title: '수업모형',
      icon: 'event'
    }, {
      link: 'system',
      title: '시스템',
      icon: 'data_usage'
    }];
  }
}());
