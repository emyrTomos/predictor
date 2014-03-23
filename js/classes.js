
//prototype extensions of built in interfaces
var predictor = {
	constants : {
		"VIEW_FIXTURE_TEMPLATE_ID" : "predictor_fixture",
		"PREDICTOR_VIEWPORT_ID" : "predictor",
		"HOME_WIN_RESULT_VALUE" : "home",
		"AWAY_WIN_RESULT_VALUE" : "away",
		"DRAW_RESULT_VALUE" : "draw"
	},
	utilities : {
		attachTemplate : function(id , parent){
			console.log("NEVER MIND" , id, parent);
			console.trace();
			parent.innerHTML = parent.removeChild(document.getElementById(id)).innerHTML;
		}
	},
	widget : new Widget()
}
$.get( "oo_predictor.json" , function(data){
	console.log("FETCHING JSON");
	predictor.data = data.predictor;
	predictor.widget.setupFixtures(data.predictor.fixtures);
	predictor.widget.setupTeams(data.predictor.teams);
	predictor.widget.setupPredictions(data.predictor.predictions);
	predictor.widget.start();
});
$(document).ready(function(){
	predictor.widget.ready();
	predictor.widget.start();
	console.log(predictor);
});

//constants
//Model

function Widget(){
	var fixtures;
	var teams;
	var predictions;
	var controller = new Controller();
	console.log("PREDICTOR OBJ: " , predictor);
	this.initialised = function(){
		return (fixtures && fixtures.initialised() && controller && controller.initialised());
	}
	this.setupFixtures = function(data){
		if(!fixtures){
			fixtures = new Fixtures();
		}
		if(!fixtures.initialised()){
			fixtures.initialise(data);
		}
		if(teams && teams.initialised()){
			fixtures.initialiseFixturesWithTeams(teams);
		}
		if(predictions && predictions.initialised()){
			fixture.initialiseFixturesWithPredictions(predictions);
		}
		console.log("FIXTURES" , fixtures);
	}
	this.setupTeams = function(data){
		if(!teams){
			teams = new Teams();
		}
		if(!teams.initialised()){
			teams.initialise(data);
		}
		if(fixtures.fixturesready){
			fixtures.initialiseFixturesWithTeams(teams);
		}
		console.log("TEAMS" , teams);
	}
	this.setupPredictions = function(data){
		console.log(predictions);
		if(!predictions){
			predictions = new Predictions();
		}
		if(!predictions.initialised()){
			predictions.initialise(data);
		}
		if(fixtures.fixturesready){
			fixtures.initialiseFixturesWithPredictions(predictions);
		}
		console.log("PREDICTIONS: " , predictions);
	}
	this.ready = function(){
		controller.initialise();
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
		if(this.initialised()){
			console.log("STARTED THE WIDGET WITH " , fixtures , teams , predictions);

		}else{
			console.log("WIDGET NOT READY " , fixtures , teams , predictions);
		}
	}
}



function Fixtures(){
	var fixturesready = false;
	var teamsready = false;
	var predictionsready = false;
	this.initialised = function(){
		return (fixturesready && teamsready && predictionsready);
	}
	this.fixturesready = function(){
		return fixturesready;
	}
	this.teamsready = function(){
		return teamsready;
	}
	this.predictionsready = function(){
		return predictionsready;
	}
	var fixtures = {};
	var fixturelist = []; //array of fixture ids so that any editorial peference order is preserved. 
	this.getFixtureById = function(fixtureId){
		return fixtures[fixtureId];
	}
	this.initialise = function(initObj){
		for (var fixtureId in initObj){
			fixtures[fixtureId] = new Fixture(initObj[fixtureId].home.id, initObj[fixtureId].away.id);
		}
		fixturesready = true;
	}
	this.initialiseFixturesWithTeams = function(teams){
		for (var fixtureId in fixtures){
			var fixture = this.getFixtureById(fixtureId);
			var homeTeam = teams.getTeamById(fixture.getHomeTeamId())
			var awayTeam = teams.getTeamById(fixture.getAwayTeamId())
			if(homeTeam && awayTeam){
				fixture.initialise(homeTeam , awayTeam);
				fixturelist.push(fixtureId);
			}
		}
		teamsready = true;
		if(fixturesready && teamsready && predictionsready) {initialised = true;};
	}
	this.initialiseFixturesWithPredictions = function(predictions){
		for (var fixtureId in fixtures){
			var fixture = this.getFixtureById(fixtureId);
			//TODO:
			//add to the predictions object if it doesn't exist
			var prediction = predictions.getPredictionById(fixtureId)||predictions.addPrediction(fixtureId , new Prediction());
			console.log("PREDICTION" , prediction);
			fixture.addPrediction(prediction);
		}
		predictionsready = true; 
		if(fixturesready && teamsready && predictionsready) {initialised = true;};
	}
}


function Fixture(homeTeamId , awayTeamId){ // two team id references
	var teamsready = false;
	var predictionready = false;
	this.homeTeamId = homeTeamId;
	this.awayTeamId = awayTeamId;
	var teams = {};
	this.initialised = function(){return (teamsready && predictionready);}
	this.initialise = function(homeTeam , awayTeam){
		if(homeTeam.typeOf !== "Team" || awayTeam.typeOf !== "Team"){
			return false;
		}
		teams[this.homeTeamId] = homeTeam;
		teams[this.awayTeamId] = awayTeam;
		teamsready = true;
		return true;
	}
	this.addPrediction = function(prediction){
		this.prediction = prediction;
		predictionready = true;
	}
	this.getHomeTeamId = function(){
		return this.homeTeamId;
	}
	this.getAwayTeamId = function(){
		return this.homeTeamId;
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
		for(var teamId in initObj){
			teams[teamId] = new Team(teamId);
			teams[teamId].initialise(initObj[teamId]);
		}
		initialised = true;
	}
	this.getTeamById = function(teamId){
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
		for(var fixtureId in initObj){
			predictions[fixtureId] = new Prediction(fixtureId);
			predictions[fixtureId].initialise(initObj[fixtureId]);
		}
		initialised = true;
		predictor.widget.start();
	}
	this.getPredictionById = function(id){
		return predictions[id];
	}
	this.addPrediction = function(fixtureId , prediction){
		predictions[fixtureId] = prediction;
		return prediction;
	}
}

function Prediction(fixtureId){
	//this is the main editable object
	//create the text nodes that will be replaced into the template when this fixture is in focus
	var fixtureId = fixtureId;
	var voted = false;
	var prediction = {"result" : null,"homeGoals":null,"awayGoals":null};
	this.initialise = function(initObj){
		prediction.result = initObj.result;
		prediction.homeGoals = initObj.homeGoals;
		prediction.awayGoals = initObj.awayGoals;
	}
	this.setResultAwayWin = function(){
		prediction.result = predictor.constants["AWAY_WIN_RESULT_VALUE"];
	}
	this.setResultHomeWin = function(){
		prediction.result = predictor.constants["HOME_WIN_RESULT_VALUE"];
	}
	this.setResultDraw = function(){
		prediction.result = predictor.constants["DRAW_RESULT_VALUE"];
	}
	this.setAwayGoals = function(awayGoals){
		prediction.awayGoals = awayGoals;
	}
	this.setHomeGoals = function(homeGoals){
		prediction.homeGoals = homeGoals;
	}
	this.incrementHomeGoals = function(){
		if(prediction.homeGoals < MAX_GOALS){prediction.homeGoals++}
	}
	this.incrementHomeGoals = function(){
		if(prediction.homeGoals < MAX_GOALS){
			prediction.homeGoals++
		}
	}
}

//Controller
function Controller(){
	var initialised = false;
	this.initialised = function(){
		return initialised;
	}
	var viewport;
	this.initialise = function(){
		var templateId = predictor.constants["VIEW_FIXTURE_TEMPLATE_ID"];
		var parentId = predictor.constants["PREDICTOR_VIEWPORT_ID"];
		viewport = document.getElementById(parentId);

		console.log("TEMPLATE INITIALISING WITH " , this , parentId , viewport , this.template)
		this.template = new Template(templateId , viewport);

		this.template.initialise();
		console.log("INITIALISED WITH TEMPLATE: " , this.template)

		initialised = true;
	}
	//method to hide the template
	//method to populate it with a fixture
	//method to show the template
	this.main = function(){
		console.log("controller has started")
	}
}


//View
function Template(templateId , parent){
	var templateId = templateId;
	this.parent = parent;
	this.initialise = function(){
		this.fixtureTemplate = predictor.utilities.attachTemplate(templateId , this.parent);
	}
	//get panel nodes and give them to panel objects
	//get data nodes and work out what they want
}
function Panel(panelNode , parent){
	var datanodes = panelNode.getElementsByTagName('data');
}
