module mlbHackathon {
  'use strict';

  export class PitcherController {

    /* @ngInject */
    constructor(private $stateParams: any) {
      console.log(this.$stateParams.pitcherId);
    }
  }
}
