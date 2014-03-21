var VIEW_FIXTURE_TEMPLATE_ID = "predictor_fixture";
var VIEW_PREDICTION_TEMPLATE_IDS = ["predictor_play","predictor_score","predictor_form"];
var VIEW_STATS_TEMPLATE_ID = "predictor_stats";
var HOME_WIN_RESULT_VALUE = "home";
var AWAY_WIN_RESULT_VALUE = "away";
var DRAW_RESULT_VALUE = "draw";

//prototype extensions of built in interfaces
Element.prototype.fetchTemplate = function() {
    if(this.tagName.toLowerCase() === "script" && this.getAttribute("type") === "text/html"){
	    this.parentElement.removeChild(this);
	    return this;
    }
    return false;
}

var predictor = {
	this.widget = new Widget();
}();
$.get( "oo_predictor.json" , function(data){
	predictor.data = data.predictor;
	predictor.widget.setupFixtures(data.predictor.fixtures);
	predictor.widget.setupTeams(data.predictor.teams);
	predictor.widget.setupPredictions(data.predictor.predictions);
	predictor.widget.start();
});
$(document).ready(function(){
	predictor.widget.setupTemplates();
	predictor.widget.start();
});

//constants
//Model

function Widget(){
	var fixtures;
	var teams;
	var predictions;
	this.controller = new Controller();
	this.setupFixtures = function(data){
		if(!fixtures){fixtures = new Fixtures();}
		if(!fixtures.initialised()){
			fixtures.initialise(data);
		}
		if(teams && teams.initialised()){
			fixtures.initialiseFixturesWithTeams(teams);
		}
	}
	this.setupTeams = function(data){
		if(!teams){teams = new Teams();}
		if(!teams.initialised()){
			teams.initialise(data);
		}
		if(fixtures.)
	}
	this.setupPredictions = function(data){
		if(!predictions){predicitions = new Predictions();}
		if(!predictions.initialised()){
			predictions.initialise(data);
		}
	}
	this.getFixtures = function(){
		return fixtures;
	}
	this.getTeams = function(){
		return teams;
	}
	this.getPredictions = function(){
		return predictions;
	}
	this.start = function(){
		if(fixtures && fixtures.initialised() && teams && teams.initialised() && predictions() && prediction.initialised()){
			console.log("STARTED THE WIDGET WITH " , fixtures , teams , predictions);

		}else{
			console.log(("WIDGET NOT READY " , fixtures , teams , predictions))
		}
	}
}



function Fixtures(){
	var initialised = false;
	var fixturesready = false;
	var teamsready = false;
	var predictionsready = false;
	var fixtures = {};
	var fixturelist = []; //array of fixture ids so that any editorial peference order is preserved. 
	this.initialised = function(){
		return (fixturesready && teamsready && predictionsready);
	}
	this.fixturesready = function(){return fixturesready};
	this.initialise = function(initObj){
		for (var fixtureId in initObj){
			fixtures[fixtureId] = new Fixture(data[fixtureId].home.id, data[fixtureId].away.id);
		}
		fixturesready = true;
		if(fixturesready && teamsready && predictionsready) {initialised = true;};
	}
	this.initialiseFixturesWithTeams = function(teams){
		for (var fixtureId in fixtures){
			var fixture = this.getFixtureById(fixtureId);
			var homeTeam = teams.getTeamById(fixture.getHomeTeamId())
			var awayTeam = teams.getTeamById(fixture.getAwayTeamId())
			if(fixture.initialise(homeTeam , awayTeam)){
				fixturelist.push(fixtureId);
			}
		}
		teamsready = true;
		if(fixturesready && teamsready && predictionsready) {initialised = true;};
	}
	this.initialsiFixturesWithPredictions = function(predictions){
		for (var fixtureId in fixtures){
			var fixture = this.getFixtureById(fixtureId);
			//TODO:
			//add to the predictions object if it doesn't exist
			var prediction = prediction.getPredictionById(fixtureId)||new Prediction();
			console.log("PREDICTION" , prediction);
			fixture.addPrediction(prediction);
		}
		predictionsready = true; 
		if(fixturesready && teamsready && predictionsready) {initialised = true;};
	}
}
function Fixture(homeTeamId , awayTeamId){ // two team id references
	var initialised = false;
	var teamsready = false;
	var predictionsready = false;
	this.homeTeamId = homeTeamId;
	this.awayTeamId = awayTeamId;
	var teams = {};
	this.initialised = function(){return initialised;}
	this.initialise = function(homeTeam , awayTeam){
		if(homeTeam === null || awayTeam === null){
			return false;
		}
		teams[this.homeTeamId] = homeTeam;
		teams[this.awayTeamId] = awayTeam;
		teamsready = true;
		if(teamsready && predictionsready){
			initialised = true;
		}
		return true;
	}
	//maybe switch this to the view?
	this.addPercentageVotes = function(percentageVotes){
		//for when call has been made and votesd are in
	}
	this.updatePercentageVotes = function(homeWin , awayWin , draw){
		//update the percentage votes object
	}
}
function Teams(){
	var initialised = false;
	var teams = {};
	this.initialised = function(){return initialised;}
	this.initialise = function(initObj){
		//perform initialisation
		for(var teamId in initObj){
			teams[teamId] = new Team(teamId);
			teams[teamId].initialise(initObj[teamId]);
		}
		initialised = true;
	}
	this.getTeamForId = function(teamId){
		return teams[teamId] || false;
	}
}
function Team(teamId){
	//this will need a lot more work once we see the shape of the data
	this.teamId = teamId;
	var initialised = false;
	var team , stats , badge;
	this.initialised = function(){return initialised;}
	this.initialise = function(initObj){
		team = initObj;
		stats = initObj;
		initialised = true;
	}
	this.getStats = function(){
		return stats;
	}
	this.getFullName = function(){
		return stats.fullName;
	}
	this.getBadge = function(){
		return badge;//badge will probably be something munged from constant+team id.
	}
}

function Predictions(){
	var initialised = false;
	var predictions = {};
	this.initialised = function(){return initialised;}
	this.initialise = function(initObj){
		//perform initialisation
		for(var fixtureId in initObj){

		}
		//then let the widget know
		initialised = true;
		predictor.widget.start();
	}
	this.getPredictionForId = function(id){
		return predictions[id];
	}
}

function Prediction(fixtureId){
	//this is the main editable object
	//create the text nodes that will be replaced into the template
	this.id = id;
	var voted = false;
	var prediction = {"result" : null,"homeGoals":null,"awayGoals":null};
	this.setResultAwayWin = function(){
		prediction.result = AWAY_WIN_RESULT_VALUE;
	}
	this.setResultHomeWin = function(){
		prediction.result = HOME_WIN_RESULT_VALUE;
	}
	this.draw = function(){
		prediction.result = DRAW_RESULT_VALUE;
	}
	this.setAwayGoals = function(awayGoals){
		prediction.awayGoals = awayGoals;
	}
	this.setHomeGoals = function(homeGoals){
		prediction.homeGoals = homeGoals;
	}

}
//View