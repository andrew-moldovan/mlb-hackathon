module mlbHackathon {
  'use strict';

  export class RouterConfig {
    /** @ngInject */
    constructor($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'app/main/main.html',
          controller: 'MainController',
          controllerAs: 'main'
        })
        .state('individualPitcher', {
          url: '/pitcher/:pitcherId',
          templateUrl: 'app/components/pitchers/pitcher.html',
          controller: 'PitcherController',
          controllerAs: 'pitcher'
        });

      $urlRouterProvider.otherwise('/');
    }

  }
}
