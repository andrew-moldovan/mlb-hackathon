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
        var str = "";
        for (var i = 0; i < result.data.header.length; i++) {
          str += "'" + result.data.header[i].label+ "',\n";
          console.log(result.data.header[i].label);
        }
        console.log(str);
      }).catch((failure) => {
        console.log("error", failure);
      });
    }

  }
}
