console.log('Hello World');
var Firebase = require("firebase");

// var myFirebaseRef = new Firebase("https://amoldov-mlbHackathon.firebaseio.com/");
var fileName = __dirname + '/src/assets/data/2015-WS.json';

// load in the json file
var fs = require("fs");
var Combo = require("stream-json/Combo");

var pipeline = fs.createReadStream(fileName).pipe(new Combo({packKeys: true, packStrings: false, packNumbers: false}));

var data = [];
var current = [];
var currentNumber = '';
var start = false;
pipeline.on("data", function(chunk) {
  if (chunk.value && chunk.value === 'atbatDesc') {
    start = true;
  }
  if (start) {
    if (chunk.name === 'startArray') {
      current = [];
    } else if (chunk.name === 'endArray') {
      data.push(current);
      current = [];
    } else {
      // check for the number chunks since it's all combined
      if (chunk.name === 'startNumber') {
        currentNumber = '';
      } else if (chunk.name === 'numberChunk') {
        currentNumber += chunk.value;
      } else if (chunk.name === 'endNumber') {
        current.push(parseFloat(currentNumber));
        currentNumber = '';
      } else {
        if (chunk.value) {
          current.push(chunk.value);
        }
      }
    }
  }

});

pipeline.on("end", function() {
  data = data.splice(1);
  console.log(data);
	console.log("finished");
});
