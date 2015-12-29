module mlbHackathon {
  'use strict';

  /** @ngInject */
  export function barChart(): ng.IDirective {

    return {
      restrict: 'E',
      scope: {
        data: '=',
        height: '=',
        margin: '=',
        title: '=',
      },
      controller: barChartController,
      controllerAs: 'sp',
      link: (scope: any, ele: JQuery, attrs: ng.IAttributes) => {
        scope.sp.d3Service.d3().then(d3 => {
          var width = ele.parent().width() - scope.sp.margin.left - scope.sp.margin.right;

          var x = d3.scale.ordinal()
              .rangeRoundBands([0, width], .1);

          var y = d3.scale.linear()
              .range([scope.sp.height, 0]);

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");

          var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

          var svg = d3.select(ele[0]).append("svg")
              .attr("width", width + scope.sp.margin.left + scope.sp.margin.right)
              .attr("height", scope.sp.height + scope.sp.margin.top + scope.sp.margin.bottom)
            .append("g")
              .attr("transform", "translate(" + scope.sp.margin.left + "," + scope.sp.margin.top + ")");

          scope.$on('$destroy', () => {
            scope.sp.d3HelperService.removeSVGOnDestroy(svg, d3);
          });

          x.domain(scope.sp.data.map(function(d) { return d.inning; }));
          y.domain([0, d3.max(scope.sp.data, function(d) { return d.avgHits; })]);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(10," + scope.sp.height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Avg hits per inning");

          svg.append("g")
            .attr("transform", "translate(10,0)")
            .selectAll(".bar")
              .data(scope.sp.data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.inning); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.avgHits); })
              .attr("height", function(d) { return scope.sp.height - y(d.avgHits); });

          svg.selectAll(".bartext")
            .data(scope.sp.data)
            .enter()
            .append("text")
            .attr("class", "bartext")
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr("x", function(d,i) {
              if (d.avgHits != 0) {
                return (x(d.inning)+x.rangeBand()/2)+10;
              }
            })
            .attr("y", function(d,i) {
              return y(d.avgHits) + 20;
            })
            .text(function(d){
              return d.avgHits.toFixed(2);
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
  class barChartController {

    constructor(private d3Service: any, private d3HelperService: any) {
    }
  }
}
