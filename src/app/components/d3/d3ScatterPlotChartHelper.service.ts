module mlbHackathon {
  'use strict';

  export class d3ScatterPlotChartHelperService{

    /** @ngInject */
    constructor(public d3HelperService: any) { }

    public createScatterPlot(scope, d3, width, height, margin, data, ele, cssClass, parseDate, title, yProp) {
      var x = d3.time.scale().range([0, width]);

      var y = d3.scale.linear()
        .range([height, 0]);

      var color = d3.scale.category10();

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      var svg = d3.select(ele[0]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", cssClass)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      scope.$on('$destroy', () => {
        this.d3HelperService.removeSVGOnDestroy(svg, d3);
      });

      data.forEach(function(d) {
        d.oldDate = d.date;
        d.date = parseDate(d.date);
      });

      x.domain(d3.extent(data, function(d) { return d.date; })).nice();
      y.domain(d3.extent(data, function(d) { return d[yProp]; })).nice();

      var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      //x axis
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Date");

      //y axis
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Batting Average");

      svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5.5)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d[yProp]); })
        .style("fill", "green")
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "orange");
          tooltip.transition()
            .duration(100)
            .style("opacity", .9);
          tooltip.html("Date: " + d.oldDate + "<br/>Value: " + (d[yProp]))
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
          d3.select(this).style("fill", "green");
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });

      svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 20 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "2rem")
        .text(title);

    }

  }
}
