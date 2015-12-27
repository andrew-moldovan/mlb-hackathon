# TMN Project
 On the main page, the user can select a batter and view some stats about them for the 2014 season. I show the important overall numbers in a table at the top and a couple of visualizations below to better understand the batter. 
 
I created an extra json file called batters.json which lists the 3 batters with their id, name and image thumbnail. This allows the main page to simply call this json file (very small, as opposed to the individual batter json files which have lots of data in them) and to show the batters found in the file. I took this liberty with the project as none of the other solutions would be very scalable. Creating this batters.json file using a small script would be pretty easy if the given dataset didn't include it.

##Seed
I used the [gulp angular yo generator](https://github.com/Swiip/generator-gulp-angular) to get started.

##Setup
##### Install required tools `gulp` and `bower`:
```
npm install -g gulp bower
```
##### Clone this repo
##### Run the `bower` and `npm` installs
```
npm install
bower install
```
##### To start the application 
```
gulp serve
```
##### Then navigate to `localhost:3000`

##### To run unit tests
```
karma start
```

##Visualization Explanation
### Batting Average Over Time
This is a pretty standard scatter plot of the cumulative batting average of the batter at each point in time. Basically it shows what the batting average was at any one point in time. It's interesting to see how the batting average has changed over the season.
### Cumulative RBIs Over Time
Another standard scatter plot showing the total number of RBIs the batter had up to that point in the season for each game. It's interesting to note how batters have slumps or streaks and this makes it pretty easy to see.

##Why typescript
I chose to use typescript for a number of reasons, first and foremost that angular 2.0 is being written in typescript and looking at a lot of what has come out of the latest ng-conf conferences, a lot of people are using typescript to write their angular apps to ease migration. The syntax is very similar (it's just a superset of javascript), and offers a few syntactic goodies (types, lambda syntax for functions, etc...) that may be used if it helps.