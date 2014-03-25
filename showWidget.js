var predictor = predictor || {
	Widget : function(){
		var templates = {};
		var data = {};
		var status = {
			"fixtureId" : null,
			"fixtureNode" : null
		}
		this.init = function(){
			templates.fixtureString = fetchTemplate(document.getElementById('predictor_fixture'));
			templates.voteString = fetchTemplate(document.getElementById('predictor_play'));
			templates.scoreString = fetchTemplate(document.getElementById('predictor_score'));
			templates.formString = fetchTemplate(document.getElementById('predictor_form'));
			templates.statsString = fetchTemplate(document.getElementById('predictor_stats'));
		}
		this.loadData = function(initData){
			data = initData;
			predictor.data = initData;
			console.log("GOT DATA " , data);
		}
		this.start = function(){
			console.log("STARTING WIDGIE POO");
			var fixtureId = chooseFixture();
			status.fixtureId = fixtureId;
			var fixtureNode = createFixture(fixtureId);
			$('#predictor').append(fixtureNode);
			status.fixtureNode = fixtureNode;
			attachEvents(status.fixtureId , status.fixtureNode);
		}
		var chooseFixture = function(){
			for (var fixtureId in data.fixtures){
				if(!data.predictions[fixtureId]){
					data.predictions[fixtureId] = {
						"voted" : false,
						"prediction" : {
							"result" : null,
							"homeGoals" : null,
							"awayGoals" : null
						}
					}
				}
				console.log("PREDICTION" , data.predictions[fixtureId]);
				if(!data.predictions[fixtureId].voted){
					if(status && (status.fixtureId !== fixtureId)){
						return fixtureId;
					}
				}
			}
			return false;
		}
		var fetchTemplate = function(templateNode){
			var templateString = templateNode.parentElement.removeChild(templateNode).innerHTML.trim().replace(/(\r\n|\n|\r)/gm,"");
			return templateString;
		}
		var createFixture = function(fixtureId){
			var containerNode = $(document.createElement('div')).attr("id" , "predictor_"+fixtureId).attr("class" , "prediction");
			var fixture = data.fixtures[fixtureId];
			var resultstring = "No result yet";
			var homeStats = data.teams[fixture.home.id];
			var awayStats = data.teams[fixture.away.id];
			console.log("Percentages for " , fixtureId , " from " , data.percentages);
			fixture.percentages = data.percentages[fixtureId];
			fixture.odds = data.odds[fixtureId];
			var fixtureString = eval(templates.fixtureString);
			console.log("BEFORE voteString");
			var voteString = eval(templates.voteString);
			console.log("BEFORE voteString");
			var scoreString = eval(templates.scoreString);
			var formString = eval(templates.formString);
			var statsString = eval(templates.statsString);
			containerNode.append(fixtureString).append(voteString).append(statsString);
			containerNode.find('#play_container').append(scoreString).append(formString);
			var homeSpinBox = new SpinBox(containerNode.find('#homeGoals')[0], {'minimum':0 , 'maximum' : 20});
			var awaySpinBox = new SpinBox(containerNode.find('#awayGoals')[0], {'minimum':0 , 'maximum' : 20});
			$(homeSpinBox.input).change(function(event){
				console.log("HOME EVENT: " , event);
				data.predictions[fixtureId].prediction.homeGoals = homeSpinBox.getValue();
				return false;
			})
			$(awaySpinBox.input).change(function(event){
				console.log("AWAY EVENT: " , event);
				data.predictions[fixtureId].prediction.awayGoals = awaySpinBox.getValue();
				return false;
			})
			return containerNode;
		}
		var createScoreInvitation = function(fixtureId , chosen){
				var prediction = data.predictions[fixtureId];
				prediction.prediction.result = chosen;
				var resultstring = (chosen === "draw")?"You predict a draw":data.teams[data.fixtures[fixtureId][chosen].id].fullName + " to win";
				var outgoing = $("#predictor div.play");
				var incoming = $("#predictor div.score");
				incoming.find('#resultsDisplay').html(resultstring);
				switchState(incoming , outgoing);
				return false;
		}
		var createScoreForm = function(fixtureId){
				var outgoing = $("#predictor div.score");
				var fixture = data.fixtures[fixtureId];
				var incoming = $("#predictor div.selectScore");
				switchState(incoming , outgoing);
				return false;
		}
		var submitPrediction = function(fixtureId){
			data.predictions[fixtureId].voted = true;
			/*
			TODO: AJAX POST
			*/
			console.log("SUBMIT PREDICTION");
			var fixtureId = chooseFixture();
			if(!fixtureId){
				fixturesCompleted();
				return false;
			}
			status.fixtureId = fixtureId;
			console.log("FIXTURE ID, ", fixtureId);
			var fixtureNode = createFixture(fixtureId);
			attachEvents(fixtureId , fixtureNode);
			status.fixtureNode.replaceWith(fixtureNode);
			status.fixtureNode = fixtureNode;
			return false;
		}
		var fixturesCompleted = function(){
			alert("ALL OUTTA GAMES");
		}
		var switchState = function(incoming,outgoing){
			outgoing.animate({left : -outgoing.parent().outerWidth(), opacity : 0});
			incoming.animate({left : 0 , opacity : 1});
		}

		var attachEvents = function(fixtureId , fixtureNode){
			fixtureNode.find("input[type='radio']").click(function(event){
				console.log("CLICK TOGGLE ", event , fixtureId);
				fixtureNode.find("div.play div").toggleClass("outside");
			});
			fixtureNode.find("a.statslink").click(function(fixtureId){
				$(".stats").slideToggle();
				return false;
			});
			fixtureNode.find("div.play button").click(function(event){
				var chosen = event.target.attributes["id"].value.split("_")[0];
				return createScoreInvitation(fixtureId,chosen);
			});
			fixtureNode.find("button.predictor-submit").click(function(event){
				console.log("Invoking submit");
				return submitPrediction(fixtureId);
			});
			fixtureNode.find("button.predict-score").click(function(event){
				return createScoreForm(fixtureId);
			});

		}		
	}

};
