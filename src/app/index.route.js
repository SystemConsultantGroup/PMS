(function () {
  angular
    .module('pms')
    .config(routeConfig);

  function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
      .state('pms', {
        views: {
          header: { templateUrl: 'app/layout/header.html' },
          sidebar: { templateUrl: 'app/layout/sidebar/sidebar.html' },
          content: { template: '<ui-view />' },
          footer: { templateUrl: 'app/layout/footer.html' }
        }
      })
      .state('prof', {
        parent: 'pms',
        params: { user: 'prof' }
      })
      .state('admin', {
        views: {
          header: { templateUrl: 'app/layout/header.html' },
          sidebar: { templateUrl: 'app/layout/sidebar/admin.sidebar.html' },
          content: { template: '<ui-view />' },
          footer: { templateUrl: 'app/layout/footer.html' },
        },
        params: { user: 'admin' }
      })
      .state('main', {
        parent: 'pms',
        url: '/main',
        templateUrl: 'app/main/main.html',
        controllerAs: 'MainController',
        params: { title: '메인 페이지' }
      })
      .state('login', {
        url: '/login',
        views: {
          content: { templateUrl: 'app/layout/login.html' }
        }
      })
      .state('loginRegister', {
        url: '/loginRegister',
        views: {
          content: { templateUrl: 'app/layout/loginRegister.html' }
        }
      })
      .state('adminProject', {
        parent: 'admin',
        url: '/admin/project',
        templateUrl: 'app/admin/admin.project.html',
        controllerAs: 'AdminProjectController',
        params: { title: '관리자 페이지' }
      })
      .state('adminProjectView', {
        parent: 'admin',
        url: '/admin/project/:pid',
        templateUrl: 'app/admin/admin.project.view.html',
        controllerAs: 'AdminProjectController',
        params: { title: '프로젝트 페이지' }
      })
      .state('adminProjectWrite', {
        parent: 'admin',
        url: '/admin/project/write',
        templateUrl: 'app/admin/admin.project.write.html',
        controllerAs: 'AdminProjectController',
        params: { title: '프로젝트 추가' }
      })
      .state('adminProjectModify', {
        parent: 'admin',
        url: '/admin/project/modify/:pid',
        templateUrl: 'app/admin/admin.project.modify.html',
        controllerAs: 'AdminProjectController',
        params: { title: '프로젝트 수정' }
      })
      .state('adminUsers', {
        parent: 'admin',
        url: '/admin/users',
        templateUrl: 'app/admin/admin.users.html',
        controllerAs: 'AdminUsersController',
        params: { title: '유저 목록' }
      })
      .state('/project', {
        parent: 'pms',
        url: '/main',
        templateUrl: 'app/main/main.html',
        controllerAs: 'MainController',
        params: { title: '메인 페이지' }
      });

    // $urlRouterProvider.otherwise('/login');
  }
}());
