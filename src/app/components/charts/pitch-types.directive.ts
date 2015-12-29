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
          var width = ele.parent().width() - scope.sp.margin.left - scope.sp.margin.right;
          var svg = d3.select(ele[0]).append("svg")
              .attr("width", width + scope.sp.margin.left + scope.sp.margin.right)
              .attr("height", scope.sp.height + scope.sp.margin.top + scope.sp.margin.bottom)
            .append("g")
              .attr("transform", "translate(" + scope.sp.margin.left + "," + scope.sp.margin.top + ")");
          scope.$on('$destroy', () => {
            scope.sp.d3HelperService.removeSVGOnDestroy(svg, d3);
          });

          var data = [];
          for (var key in scope.sp.data.pitchTypes) {
            // let's get rid of the really tiny ones that don't matter
            if (scope.sp.data.pitchTypes[key].totalPitches > 10) {
              data.push({
                pitchType: key,
                value: scope.sp.data.pitchTypes[key],
                radius: (Math.sqrt(scope.sp.data.pitchTypes[key].totalPitches / Math.PI)*7)
              })
            }
          };

          var circles = svg.selectAll("circle")
            .data(data, function(d) {
              return d.pitchType;
            })
            .enter()
            .append("circle");

          var grads = svg.append("defs").selectAll("radialGradient")
              .data(data)
            .enter()
              .append("radialGradient")
              .attr("gradientUnits", "objectBoundingBox")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", "100%")
              .attr("id", function(d, i) { return "grad" + i; });

          grads.append("stop")
              .attr("offset", function(d) {
                return ((d.value.positive / d.value.totalPitches) * 100) + "%";
              })
              .style("stop-color", "rgb(233,237,230)");

          grads.append("stop")
              .attr("offset", "50%")
              .style("stop-color", "rgb(122,158,110)");

          var tooltip = d3.select(ele[0]).append("div")
            .style("position", "absolute")
            .style("right", 0)
            .style("bottom", '10px')
            .attr("opacity", 0)
            .attr("class", "tooltip");

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
                d.centerX = xLine2;
                return xLine2;
              }
              lastRadius = d.radius;
              d.centerX = xLine;
              return xLine;
            })
            .attr("cy", function (d, i) {
              if (d.secondLine) {
                d.centerY = largestRadius * 3;
                return largestRadius * 3;
              }
              d.centerY = largestRadius;
              return largestRadius;
            })
            .attr("r", function (d) {
              return d.radius;
            })
            .style("fill", function(d, i) {
              return "url(#grad" + i + ")";
            })
            .on("mouseover", function(d) {
              var pitchResultsString = '';
              for (var pr in d.value.pitchResults) {
                pitchResultsString += pr + ': ' + d.value.pitchResults[pr] + "<br/>";
              }
              tooltip.html("<b>Pitch Type: </b>"+d.pitchType+"<br/><b>Total Pitches: </b>" + d.value.totalPitches
                + "<br/><b>Positives: </b>" + d.value.positive
                + "<br/><b>Negatives: </b>" + d.value.negative
                + "<br/><b>Neutrals: </b>" + d.value.neutral
                + "<br/><span class='pitch-results'>Pitch Result Counts</span><br/>" + pitchResultsString)
                .style("opacity", .9);
            })
            .on("mouseout", function(d) {
              tooltip.style("opacity", 0);
            });

            svg.selectAll("text")
              .data(data, function(d) {
                return d.pitchType;
              })
              .enter()
              .append("text")
              .attr("x", function(d) {
                return d.centerX - 7;
              })
              .attr("y", function(d) {
                return d.centerY + 5;
              })
              .attr("fill", "white")
              .text(function(d) {
                return d.pitchType;
              });

              svg.append("text")
                .attr("x", (width / 2))
                .attr("y", -20)
                .attr("text-anchor", "middle")
                .style("font-size", "2rem")
                .text(scope.sp.title);
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
