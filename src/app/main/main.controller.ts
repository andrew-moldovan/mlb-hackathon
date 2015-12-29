module mlbHackathon {
  'use strict';

  export class MainController {
    public pitchersData = [];
    public toShow = 10;
    public searchText = "";

    /* @ngInject */
    constructor (private DataInputService: any) {
      this.getAllData();
    }

    public getAllData() {
      this.DataInputService.getAllData().then((result: any) => {
        this.pitchersData = result;
      }).catch((failure) => {
        console.log("error", failure);
      });
    }

    public showMore() {
      this.toShow += 10;
    }

  }
}
