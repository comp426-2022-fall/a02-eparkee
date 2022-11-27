#!/usr/bin/env node

//importing in the libraries
import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

//Setting the variables that will be used for the javascript
const timezone = moment.tz.guess();
const args = minimist(process.arv.slice(2));

//setting the default variables
let latitude = 35.92;
let longitude = 79.05;
let days = 1; //starting with the current days

//switching to help if contained in args
if (args.h){
	help_show();
}

//take in the number of days
if(args.d){
	days = args.d;
}

//taki in the coordinates
if(args.n){
	latitude = args.n;
}
else{
	if(args.s){
		latitude = -args.s;
	}
	else{
		console.log("Latitude is not valid.")
		process.exit(0);
	}
}
//setting longitude
if(args.e){
	longitude = args.e;
}
if(args.w){
	longitude = -args.w;
}
//setting the timezone
if(args.z){
	timezone = args.z;
}
if(args.t){
	timezone = args.t;
}

//pulling the data from the API
const response_pull = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=" + timezone);
const data = await response.json();

//Printing out the data if requested
if(args.j){
	console.log(data)
	//leaving the program
	process.exit(0)
}

//printing the day given by user
if (days == 0){
	console.log("today.");
}else if (days > 1){
	console.log("in" + " " + days + "days.");
}
else{
	console.log("tomorrrow.");
}

//Printing if the user will need their galoshes
if(data.daily.precipitation_hours[days] != 0){
	console.log("You might need your galoshes.");
}
else if(data.daily.precipitation_hours[days] == 0){
		console.log("You will not need your galoshes!");
	}

//This shows help
function help_show() {
	console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE")
	console.log("\n")
	console.log("  -h\t\tShow this help message and exit.")
	console.log("  -n, -s\tLatitude: N positive; S negative.")
	console.log("  -e, -w\tLongitude: E positive; W negative.")
	console.log("  -z\t\tTime zone: uses tz.guess() from moment-timezone by default.")
	console.log( "  -d 0-6\tDay to retrieve weather: 0 is today; defaults to 1.")
	console.log( "  -j\t\tEcho pretty JSON from open-meteo API and exit.")
	process.exit(0);
}
