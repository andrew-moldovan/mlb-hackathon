var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://Andrews-MacBook-Pro.local:27017/mlb2';
MongoClient.connect(url, function(err, db) {
  // find all pitchers
  var pitchers = db.collection('pitchers_2013').find( );

  pitchers.each(function(err, pitcher) {

    if (pitcher && pitcher._id) {
      var id = parseFloat(pitcher._id);
      if (id === id) {
        // then we know it's a number so no weird stuff happened
        // we have a pitcher Id, let's go and find all the pitches for this guy
        var pitches = db.collection('pitches_2013').find( { "_id" : pitcher._id });
        pitches.each(function(err, allPitches) {
          if (allPitches) {
            console.log(pitcher.name);
            // all the pitches for a pitcher are in the allPitches.pitch array
            // anything in here is per pitcher
            var hitsPerInning = {};
            var timesPitchedInInning = {};
            var currentInning = -1;
            console.log(allPitches.pitch.length);
            for (var i = 0; i < allPitches.pitch.length; i++) {
              if (allPitches.pitch[i]) {
                var currentPitch = allPitches.pitch[i];
                var inning = currentPitch.inning;

                if (currentInning !== currentPitch.inning) {
                  // this is a new game
                  if (timesPitchedInInning[inning]) {
                    timesPitchedInInning[inning]++;
                  } else {
                    timesPitchedInInning[inning] = 1;
                  }
                  currentInning = currentPitch.inning;
                }

                if (currentPitch.pitchResult === 'IP' &&
                  (currentPitch.paResult == 'S'
                  || currentPitch.paResult == 'D'
                  || currentPitch.paResult == 'T'
                  || currentPitch.paResult == 'HR'
                )) {
                  // if it's a hit, we record it for this inning
                  if (hitsPerInning[inning]) {
                    hitsPerInning[inning]++;
                  } else {
                    hitsPerInning[inning] = 1;
                  }
                }
              }
            }
            // once we've gone throught the for loop of all pitches let's see how many hits per inning
            var avgHitsPerInning = {};
            // find the avg hits per inning
            for (times in timesPitchedInInning) {
              if (hitsPerInning[times]) {
                avgHitsPerInning[times] = hitsPerInning[times] / timesPitchedInInning[times];
              } else {
                avgHitsPerInning[times] = 0;
              }
            }
            db.collection("pitchers_2013").update(
              { "_id" : pitcher._id },
              { $set:
                {
                  "avgHitsPerInning" : avgHitsPerInning,
                  "timesPitchedInInning" : timesPitchedInInning,
                  "hitsPerInning" : hitsPerInning
                }
              }
            );
            console.log(avgHitsPerInning);
          }
        })
      }

    }

  });
  // db.close();
});
