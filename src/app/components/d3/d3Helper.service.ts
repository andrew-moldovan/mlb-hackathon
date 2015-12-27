module mlbHackathon {
  'use strict';

  export class d3HelperService {

    /** @ngInject */
    constructor(private $http: any) {}

    public removeSVGOnDestroy(svg: any, d3: any) {
      svg.selectAll("*").remove();
      d3.select("svg").remove();
    }

  }
}
