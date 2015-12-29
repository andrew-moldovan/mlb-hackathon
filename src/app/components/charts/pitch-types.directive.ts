module mlbHackathon {
  'use strict';

  /** @ngInject */
  export function pitchTypes(): ng.IDirective {

    return {
      restrict: 'E',
      scope: {
        data: '=',
        height: '=',
        margin: '=',
        title: '=',
      },
      controller: pitchTypesController,
      controllerAs: 'sp',
      link: (scope: any, ele: JQuery, attrs: ng.IAttributes) => {
        scope.sp.d3Service.d3().then(d3 => {
          console.log(scope.sp.data);

          var data = [];
          for (var key in scope.sp.data.pitchTypes) {
            data.push({
              pitchType: key,
              value: scope.sp.data.pitchTypes[key],
              radius: (Math.sqrt(scope.sp.data.pitchTypes[key].totalPitches / Math.PI)*7)
            })
          };
          console.log(data);
          var width = ele.parent().width() - scope.sp.margin.left - scope.sp.margin.right;

          var svg = d3.select(ele[0]).append("svg")
              .attr("width", width + scope.sp.margin.left + scope.sp.margin.right)
              .attr("height", scope.sp.height + scope.sp.margin.top + scope.sp.margin.bottom)
            .append("g")
              .attr("transform", "translate(" + scope.sp.margin.left + "," + scope.sp.margin.top + ")");

          scope.$on('$destroy', () => {
            scope.sp.d3HelperService.removeSVGOnDestroy(svg, d3);
          });

          var circles = svg.selectAll("circle")
            .data(data, function(d) {
              return d.pitchType;
            })
            .enter()
            .append("circle");

          var largestRadius = d3.max(data, function(d) { return d.radius; });
          var xLine = 10;
          var xLine2 = 10;
          var lastRadius = 0;
          var firstOnSecondLine = false;

          var circleAttributes = circles
            .attr("cx", function (d, i) {
              if (i == 0) {
                xLine = xLine + d.radius;
              } else {
                xLine = xLine + lastRadius + 40 + d.radius;
              }

              if (xLine > width - 50) {
                d.secondLine = true;
                if (!firstOnSecondLine) {
                  firstOnSecondLine = true;
                  xLine2 = xLine2 + d.radius;
                } else {
                  xLine2 = xLine2 + lastRadius + 40 + d.radius;
                }
                lastRadius = d.radius;
                return xLine2;
              }
              lastRadius = d.radius;
              return xLine;
            })
            .attr("cy", function (d, i) {
              if (d.secondLine) {
                return largestRadius * 3;
              }
              return largestRadius;
            })
            .attr("r", function (d) {
              return d.radius;
            })
            .style("fill", "steelblue" );

        });
      },
      bindToController: true
    };
  }

  /** @ngInject */
  class pitchTypesController {

    constructor(private d3Service: any, private d3HelperService: any) {
    }
  }
}
