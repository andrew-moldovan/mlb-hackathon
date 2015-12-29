module mlbHackathon {
  'use strict';

  export class DataInputService {
    public pitchers = {};

    /** @ngInject */
    constructor(private $http: ng.IHttpService, private $q: ng.IQService) {

    }

    getIndividualPitcher(id) {
      var deferred = this.$q.defer();

      if (this.pitchers[id]) {
        deferred.resolve(this.pitchers[id]);
      } else {
        // we don't have it cached so fetch it from the main one
        this.getAllData().then((result: any) => {
          deferred.resolve(this.pitchers[id]);
        }).catch((failure) => {
          console.log("error", failure);
        });
      }
      return deferred.promise;
    }

    getAllData() {
      var deferred = this.$q.defer();

      this.$http.get('/assets/dataToServe/pitchers2013.json').then((result: any) => {
        for (var i = 0; i < result.data.length; i++) {
          this.pitchers[result.data[i]._id] = result.data[i];
        }
        deferred.resolve(result.data);
      }).catch((failure) => {
        console.log("error", failure);
        deferred.reject("No data");
      });
      return deferred.promise;
    }
  }
}
