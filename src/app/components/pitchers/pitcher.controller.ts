module mlbHackathon {
  'use strict';

  export class PitcherController {
    public pitcher:any = {};
    public loading = true;
    public avgHitsPerInning = [];
    public margin = { top: 50, right: 80, bottom: 30, left: 60 };

    /* @ngInject */
    constructor(private $stateParams: any, private DataInputService: any) {
      this.DataInputService.getIndividualPitcher(this.$stateParams.pitcherId).then((result) => {
        this.pitcher = result;
        this.loading = false;
        for (var key in this.pitcher.avgHitsPerInning) {
          this.avgHitsPerInning.push({
            inning: key,
            avgHits: this.pitcher.avgHitsPerInning[key]
          });
        }

      });
    }
  }
}
