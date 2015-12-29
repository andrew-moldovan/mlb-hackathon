/// <reference path="../../.tmp/typings/tsd.d.ts" />


/// <reference path="index.route.ts" />
/// <reference path="index.config.ts" />
/// <reference path="index.run.ts" />
/// <reference path="main/main.controller.ts" />
/// <reference path="../app/components/navbar/navbar.directive.ts" />
/// <reference path="../app/components/d3/d3.service.ts" />
/// <reference path="../app/components/d3/d3Helper.service.ts" />
/// <reference path="../app/components/pitchers/pitcher.controller.ts" />
/// <reference path="../app/components/pitchers/data-input.service.ts" />
/// <reference path="../app/components/charts/bar-chart.directive.ts" />
/// <reference path="../app/components/charts/pitch-types.directive.ts" />

module mlbHackathon {
  'use strict';

  angular.module('mlbHackathon', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'd3'])
      .config(Config)
      .config(RouterConfig)
      .run(RunBlock)
      .service('d3HelperService', d3HelperService)
      .service('DataInputService', DataInputService)
      .controller('MainController', MainController)
      .controller('PitcherController', PitcherController)
      .directive('navbar', navbar)
      .directive('barChart', barChart)
      .directive('pitchTypes', pitchTypes);
}
