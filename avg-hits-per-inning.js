var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://Andrews-MacBook-Pro.local:27017/mlb2';
MongoClient.connect(url, function(err, db) {
  // find all pitchers
  var pitchers = db.collection('pitchers_ws').find( );

  pitchers.each(function(err, pitcher) {

    if (pitcher && pitcher._id) {
      // we have a pitcher Id, let's go and find all the pitches for this guy
      var pitches = db.collection('pitches_ws').find( { "_id" : pitcher._id });
      pitches.each(function(err, pitch) {
        if (pitch) {
          console.log(pitcher.name);
          // all the pitches for a pitcher are in the pitch.pitch array
          // anything in here is per pitcher
          var hitsPerInning = {};
          for (var i = 0; i < pitch.pitch.length; i++) {
            if (pitch.pitch[i]) {
              var currentPitch = pitch.pitch[i];
              var inning = currentPitch.inning;
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
          console.log(hitsPerInning);
        }
      })
    }

  });
  // db.close();
});