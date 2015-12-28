module mlbHackathon {
  'use strict';

  export class MainController {
    public pitchersData = [];

    /* @ngInject */
    constructor (private DataInputService: any) {
      this.pitchersData.push({name: "test", id: "2343"});
      this.getAllData();
    }

    public getAllData() {
      this.DataInputService.getAllData().then((result: any) => {
        console.log(result.data);
      }).catch((failure) => {
        console.log("error", failure);
      });
    }

  }
}
