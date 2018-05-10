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
          sidebar: { templateUrl: 'app/layout/sidebar.html' },
          content: { template: '<ui-view />' },
          footer: { templateUrl: 'app/layout/footer.html' }
        }
      })
      .state('prof', {
        parent: 'pms',
        params: { user: 'prof' }
      })
      .state('admin', {
        parent: 'pms',
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
          content: { templateUrl: 'app/layout/login.html' },
          footer: { templateUrl: 'app/layout/footer.html' }
        }
      });

    // $urlRouterProvider.otherwise('/login');
  }
}());
