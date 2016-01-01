/*
NOTE: Classification of positive/negative/neutral pitch results -- as a non-analyst this is just a first pass
---------
POSITIVE:
---------
SS
SL
F
FT
FB
MB
AS
IP_OUT
K
FC
DP
TP
BI
---------
NEGATIVE:
---------
B
BID
HBP
AB
CI
S
D
T
HR
BB
HBP
SH
SF
ROE
SH_ROE
SF_ROE
CI
FI
---------
NEUTRAL
---------
IB
PO
IBB
NO_PLAY
*/

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
            var playerPitches = {};
            playerPitches.totalPitches = allPitches.pitch.length;
            playerPitches.pitchTypes = {};

            for (var i = 0; i < allPitches.pitch.length; i++) {
              if (allPitches.pitch[i]) {
                var currentPitch = allPitches.pitch[i];

                if (playerPitches.pitchTypes[currentPitch.pitchType]) {
                  playerPitches.pitchTypes[currentPitch.pitchType].totalPitches++;
                } else {
                  playerPitches.pitchTypes[currentPitch.pitchType] = {
                    totalPitches: 1,
                    positive: 0,
                    neutral: 0,
                    negative: 0,
                    pitchResults: {}
                  }
                }

                if (currentPitch.pitchResult !== 'IP') {
                  if (playerPitches.pitchTypes[currentPitch.pitchType].pitchResults[currentPitch.pitchResult]) {
                    playerPitches.pitchTypes[currentPitch.pitchType].pitchResults[currentPitch.pitchResult]++;
                  } else {
                    playerPitches.pitchTypes[currentPitch.pitchType].pitchResults[currentPitch.pitchResult] = 1;
                  }
                } else {
                  // let's see what the paResult was here
                  if (playerPitches.pitchTypes[currentPitch.pitchType].pitchResults[currentPitch.paResult]) {
                    playerPitches.pitchTypes[currentPitch.pitchType].pitchResults[currentPitch.paResult]++;
                  } else {
                    playerPitches.pitchTypes[currentPitch.pitchType].pitchResults[currentPitch.paResult] = 1;
                  }
                }

                // lastly we need to figure out if this pitch was a positive, neutral or negative result
                if (currentPitch.pitchResult === 'SS'
                  || currentPitch.pitchResult === 'SL'
                  || currentPitch.pitchResult === 'F'
                  || currentPitch.pitchResult === 'FT'
                  || currentPitch.pitchResult === 'FB'
                  || currentPitch.pitchResult === 'MB'
                  || currentPitch.pitchResult === 'AS'
                ) {
                  playerPitches.pitchTypes[currentPitch.pitchType].positive++;
                }
                if (currentPitch.pitchResult === 'B'
                  || currentPitch.pitchResult === 'BID'
                  || currentPitch.pitchResult === 'HBP'
                  || currentPitch.pitchResult === 'AB'
                  || currentPitch.pitchResult === 'CI'
                ) {
                  playerPitches.pitchTypes[currentPitch.pitchType].negative++;
                }
                if (currentPitch.pitchResult === 'IB'
                  || currentPitch.pitchResult === 'PO'
                ) {
                  playerPitches.pitchTypes[currentPitch.pitchType].neutral++;
                }
                // lastly if it was an IP then we need to check the paResult as well
                if (currentPitch.pitchResult === 'IP') {
                  if (currentPitch.paResult === 'IP_OUT'
                    || currentPitch.paResult === 'K'
                    || currentPitch.paResult === 'FC'
                    || currentPitch.paResult === 'DP'
                    || currentPitch.paResult === 'TP'
                    || currentPitch.paResult === 'BI'
                  ) {
                    playerPitches.pitchTypes[currentPitch.pitchType].positive++;
                  }
                  if (currentPitch.paResult === 'S'
                    || currentPitch.paResult === 'D'
                    || currentPitch.paResult === 'T'
                    || currentPitch.paResult === 'HR'
                    || currentPitch.paResult === 'BB'
                    || currentPitch.paResult === 'HBP'
                    || currentPitch.paResult === 'SH'
                    || currentPitch.paResult === 'SF'
                    || currentPitch.paResult === 'ROE'
                    || currentPitch.paResult === 'SH_ROE'
                    || currentPitch.paResult === 'SF_ROE'
                    || currentPitch.paResult === 'CI'
                    || currentPitch.paResult === 'FI'
                  ) {
                    playerPitches.pitchTypes[currentPitch.pitchType].negative++;
                  }
                  if (currentPitch.paResult === 'IBB'
                    || currentPitch.paResult === 'NO_PLAY'
                  ) {
                    playerPitches.pitchTypes[currentPitch.pitchType].neutral++;
                  }
                }
              }
            }

            console.log(playerPitches);
            for (key in playerPitches.pitchTypes) {
              console.log(key);
              console.log(playerPitches.pitchTypes[key]);
            }
            db.collection("pitchers_2013").update(
              { "_id" : pitcher._id },
              { $set:
                {
                  "playerPitches": playerPitches
                }
              }
            );
          }
        })
      }

    }

  });
  // db.close();
});
