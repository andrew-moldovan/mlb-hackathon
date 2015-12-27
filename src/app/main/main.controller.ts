module mlbHackathon {
  'use strict';

  export class MainController {
    public pitchersData = [];

    /* @ngInject */
    constructor () {
      this.pitchersData.push({name: "test", id: "2343"});
      console.log("main");
    }

  }
}
