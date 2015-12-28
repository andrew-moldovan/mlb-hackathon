var keys = [
  'seasonYear',
  'gameString',
  'gameDate',
  'gameType',
  'visitor',
  'home',
  'visitingTeamFinalRuns',
  'homeTeamFinalRuns',
  'inning',
  'side',
  'batterId',
  'batter',
  'batterHand',
  'pitcherId',
  'pitcher',
  'pitcherHand',
  'catcherId',
  'catcher',
  'timesFaced',
  'batterPosition',
  'balls',
  'strikes',
  'outs',
  'manOnFirst',
  'manOnSecond',
  'manOnThird',
  'endManOnFirst',
  'endManOnSecond',
  'endManOnThird',
  'visitingTeamCurrentRuns',
  'homeTeamCurrentRuns',
  'pitchResult',
  'pitchType',
  'releaseVelocity',
  'spinRate',
  'spinDir',
  'px',
  'pz',
  'szt',
  'szb',
  'x0',
  'y0',
  'z0',
  'vx0',
  'vy0',
  'vz0',
  'ax',
  'ay',
  'az',
  'paResult',
  'runsHome',
  'battedBallType',
  'battedBallAngle',
  'battedBallDistance',
  'atbatDesc'
];

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://Andrews-MacBook-Pro.local:27017/mlb2';
MongoClient.connect(url, function(err, db) {

  var fileName = __dirname + '/src/assets/data/2015-WS.json';

  // db.collection('restaurants').insertOne( {
  //
  //  }, function(err, result) {
  //   db.close();
  // });

  // load in the json file
  var fs = require("fs");
  var Combo = require("stream-json/Combo");

  var pipeline = fs.createReadStream(fileName).pipe(new Combo({packKeys: true, packStrings: false, packNumbers: false}));

  var current = {};
  var currentNumber = '';
  var start = false;
  var counter = 0;
  var propCounter = 0;

  pipeline.on("data", function(chunk) {
    if (chunk.value && chunk.value === 'atbatDesc') {
      start = true;
    }
    if (start) {
      if (chunk.name === 'startArray') {
        current = {};
        propCounter = 0;
      } else if (chunk.name === 'endArray') {
        if (counter < 5 && counter >= 1) {
          // this means that we have a whole row. Let's add it to the db
          // db.collection('allPitchData').insert(current);
        }
        counter++;
        console.log(current);
        console.log("--------");
        current = {};
        propCounter = 0;
      } else {
        // check for the number chunks since it's all combined
        if (chunk.name === 'startNumber') {
          currentNumber = '';
        } else if (chunk.name === 'numberChunk') {
          currentNumber += chunk.value;
        } else if (chunk.name === 'endNumber') {
          current[keys[propCounter]] = parseFloat(currentNumber);
          currentNumber = '';
          propCounter++;
        } else {
          if (chunk.name === "falseValue" || chunk.name === 'trueValue' || chunk.name === 'nullValue') {
            current[keys[propCounter]] = chunk.value;
            propCounter++;
          } else if (chunk.value) {
            current[keys[propCounter]] = chunk.value;
            propCounter++;
          }
        }
      }
    }

  });

  pipeline.on("end", function() {
  	console.log("finished");
    db.close();
  });

});
