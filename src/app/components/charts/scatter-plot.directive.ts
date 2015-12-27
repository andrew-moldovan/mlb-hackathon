module mlbHackathon {
  'use strict';

  /** @ngInject */
  export function scatterPlot(): ng.IDirective {

    return {
      restrict: 'E',
      scope: {
        data: '=',
        parseDate: '=',
        height: '=',
        margin: '=',
        title: '=',
        yProp: '='
      },
      controller: scatterPlotController,
      controllerAs: 'sp',
      link: (scope: any, ele: JQuery, attrs: ng.IAttributes) => {
        scope.sp.d3Service.d3().then(d3 => {

          var width = ele.parent().width() - scope.sp.margin.left - scope.sp.margin.right;

          var parseDate = d3.time.format(scope.sp.parseDate).parse;
          scope.sp.d3ScatterPlotChartHelperService.createScatterPlot(scope, d3, width, scope.sp.height, scope.sp.margin, scope.sp.data, ele, 'scatter-plot', parseDate, scope.sp.title, scope.sp.yProp);
        });
      },
      bindToController: true
    };
  }

  /** @ngInject */
  class scatterPlotController {

    constructor(private d3Service: any, private d3ScatterPlotChartHelperService: any, private d3HelperService: any) {
    }
  }
}
