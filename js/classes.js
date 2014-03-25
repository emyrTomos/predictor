
//prototype extensions of built in interfaces
var predictor = {
	constants : {
		VIEW_FIXTURE_TEMPLATE_ID : "predictor_fixture",
		PREDICTOR_VIEWPORT_ID : "predictor",
		HOME_WIN_RESULT_VALUE : "home",
		AWAY_WIN_RESULT_VALUE : "away",
		DRAW_RESULT_VALUE : "draw"
	},
	model : {
		Fixtures :function(model){
			var model = model;
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
					fixtures[fixtureId] = new model.Fixture(model , initObj[fixtureId].home.id , initObj[fixtureId].away.id);
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
					var prediction = predictions.getPredictionById(fixtureId)||predictions.addPrediction(fixtureId , new model.Prediction());
					fixture.addPrediction(prediction);
				}
				predictionsready = true; 
				if(fixturesready && teamsready && predictionsready) {initialised = true;};
			}
		},
		Fixture:function(model , homeTeamId , awayTeamId){ // two team id references
			var teamsready = false;
			var predictionready = false;
			this.homeTeamId = homeTeamId;
			this.awfunctionayTeamId = awayTeamId;
			var teams = {};
			this.initialised = function(){return (teamsready && predictionready);}
			this.initialise = function(homeTeam , awayTeam){
				if(homeTeam instanceof model.Team && awayTeam instanceof model.Team){
					teams[this.homeTeamId] = homeTeam;
					teams[this.awayTeamId] = awayTeam;
					teamsready = true;
					return true;
				}else{
					return false;
				}
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
		},
		Teams:function(model){
			var model = model;
			var initialised = false;
			var teams = {};
			this.initialised = function(){return initialised;}
			this.initialise = function(initObj){
				for(var teamId in initObj){
					teams[teamId] = new model.Team(teamId);
					teams[teamId].initialise(initObj[teamId]);
				}
				initialised = true;
			}
			this.getTeamById = function(teamId){
				return teams[teamId] || false;
			}
		},
		Team : function(teamId){
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
		},
		Predictions : function(model){
			var model = model;
			var initialised = false;
			var predictions = {};
			this.initialised = function(){return initialised;}
			this.initialise = function(initObj){
				for(var fixtureId in initObj){
					predictions[fixtureId] = new model.Prediction(fixtureId);
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
		},
		Prediction : function(fixtureId){
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
	},
	view : {
		Template : function(templateId , node){
			var templateId = templateId;
			this.node = node;
			this.initialise = function(){
				this.attachNode(templateId , this.node);
			}
			this.getPanelNodes = function(){
				return this.node.getElementsByTagName("panel");
			}
			this.attachNode = function(templateId , viewport){
				viewport.innerHTML = viewport.removeChild(document.getElementById(templateId)).innerHTML.trim().replace(/(\r\n|\n|\r\t)/gm,"");
			}
		},
		Panel : function(panelNode , className , state){
			var panelNode = panelNode;
			var displayNode = document.createElement("div");
			if(state){
				displayNode.setAttribute("class" , state);
			}else{
				displayNode.setAttribute("class" , className);
			}
			this.getHtmlNode = function(){
				displayNode.innerHTML = panelNode.innerHTML;
				return displayNode;
			}
			this.replaceDataNodeWithHtml = function(htmlNode){
				panelNode.parentNode.replaceChild(htmlNode , panelNode);
			}
			this.getDataNodes = function(){
				return panelNode.getElementsByTagName('data');
			}
			this.displayNode = function(){
				return displayNode;
			}
		}

	},
	application : {
		Widget : function(classbase){
			var classbase 	= classbase;
			var model 		= classbase.model,
				application = classbase.application,
				view 		= classbase.view;

			var fixtures;
			var teams;
			var predictions;
			var controller = new application.Controller(view,application);
			$.get( "oo_predictor.json" , function(data){
				classbase.widget.setupFixtures(data.predictor.fixtures);
				classbase.widget.setupTeams(data.predictor.teams);
				classbase.widget.setupPredictions(data.predictor.predictions);
				classbase.widget.start();
			});
			$(document).ready(function(){
				classbase.widget.ready();
				classbase.widget.start();
			});
			this.initialised = function(){
				return (fixtures && fixtures.initialised() && controller && controller.initialised());
			}
			this.setupFixtures = function(data){
				if(!fixtures){
					fixtures = new model.Fixtures(model);
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
			}
			this.setupTeams = function(data){
				if(!teams){
					teams = new model.Teams(model);
				}
				if(!teams.initialised()){
					teams.initialise(data);
				}
				if(fixtures.fixturesready){
					fixtures.initialiseFixturesWithTeams(teams);
				}
			}
			this.setupPredictions = function(data){
				if(!predictions){
					predictions = new model.Predictions(model);
				}
				if(!predictions.initialised()){
					predictions.initialise(data);
				}
				if(fixtures.fixturesready){
					fixtures.initialiseFixturesWithPredictions(predictions);
				}
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
		},
		Controller : function(view , application){
			var initialised = false;
			this.initialised = function(){
				return initialised;
			}
			this.template;
			var viewport,	datanodes,	events;
			var panels = {};
			this.initialise = function(){
				var templateId = predictor.constants["VIEW_FIXTURE_TEMPLATE_ID"];
				var parentId = predictor.constants["PREDICTOR_VIEWPORT_ID"];
				viewport = document.getElementById(parentId);
				this.template = new view.Template(templateId , viewport);
				this.template.initialise();
				this.setupPanelNodes(this.template.getPanelNodes());
				this.setupPanelViews(panels);
				events = new application.Events(panels);
				events.init();
				initialised = true;
			}
			this.setupPanelNodes = function(panelNodes){
				for(var i=0 ; i<panelNodes.length ; i++){
					var panelNode = panelNodes.item(i);
					var panelClass = panelNode.getAttribute("class");
					var panelState = panelNode.getAttribute("state");
					var panelObj = new view.Panel(panelNode , panelClass , panelState);
					if(!panels[panelClass] && panelState === null){
						panels[panelClass] = {"panel" : panelObj};
					}
					else if(!panels[panelClass] && panelState !== null){
						panels[panelClass] = {"states" : {}};
						panels[panelClass].state[panelState] = {"panel" : panelObj};
					}
					else if(panels[panelClass] && panelState !== null){
						if(!panels[panelClass].states){
							panels[panelClass].states = {};
						}
						panels[panelClass].states[panelState] = {"panel" : panelObj};
					}
					else if(panels[panelClass] && panelState === null){
						panels[panelClass].panel = panelObj;
					}
				}
			}
			this.setupPanelViews = function(panels){
				for(var panel in panels){
					if(panels[panel].states){
						var states = panels[panel].states; 
						for (var state in states){
							var statePanel = states[state].panel;
							statePanel.replaceDataNodeWithHtml(statePanel.getHtmlNode());
						}
					}
					var topPanel = panels[panel].panel;
					topPanel.replaceDataNodeWithHtml(topPanel.getHtmlNode());
				}
			}
			this.setupEvents = function(panels){
			}
			//method to hide the template
			//method to populate it with a fixture
			//method to show the template
			this.main = function(){
				console.log("controller has started");
			}
		},
		Events : function(panels){
			this.init = function(){
				$("#predictor a.stats").click(function(fixtureId){
					$("#predictor .stats").slideToggle();
					console.log("CLICK " ,$("#predictor .stats") );
					return false;
				});
				$("#predictor div.prediction button").click(function(event){
					var chosen = event.target.attributes["id"].value.split("_")[0];
					return predictor.createScoreInvitation(fixtureId,chosen);
				});
				$("#predictor button.predictor-submit").click(function(event){
					console.log("Invoking submit");
					return predictor.submitPrediction(fixtureId);
				});
				$("#predictor button.predict-score").click(function(event){
					return predictor.createScoreForm(fixtureId);
				});
			}
		}
	}
}
predictor.widget = new predictor.application.Widget(predictor);
