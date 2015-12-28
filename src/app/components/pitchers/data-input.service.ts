module mlbHackathon {
  'use strict';

  export class DataInputService {

    /** @ngInject */
    constructor(private $http: ng.IHttpService) {

    }

    getAllData() {
      return this.$http.get('/assets/data/2015-WS.json');
    }
  }
}
