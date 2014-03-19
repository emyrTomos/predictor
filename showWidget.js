var predictor= {};
jQuery.ajaxSetup({ cache: false });
Element.prototype.fetchTemplate = function() {
    if(this.tagName.toLowerCase() === "script" && this.getAttribute("type") == "text/html"){
	    this.parentElement.removeChild(this);
	    return this;
    }
    return false;
}
$(document).ready(function(){
	$.get( "predictor.json" , function(data){
		console.log("DATA IS: ", data);
		predictor.data = data.predictor;
		predictor.templates = {};
		predictor.templates.fixtureString = document.getElementById('predictor_fixture').fetchTemplate().innerHTML.replace(/(\r\n|\n|\r)/gm,"");
		predictor.templates.voteString = document.getElementById('predictor_play').fetchTemplate().innerHTML.replace(/(\r\n|\n|\r)/gm,"");
		predictor.templates.scoreString = document.getElementById('predictor_score').fetchTemplate().innerHTML.replace(/(\r\n|\n|\r)/gm,"");
		predictor.templates.formString = document.getElementById('predictor_form').fetchTemplate().innerHTML.replace(/(\r\n|\n|\r)/gm,"");
		predictor.templates.statsString = document.getElementById('predictor_stats').fetchTemplate().innerHTML.replace(/(\r\n|\n|\r)/gm,"");
		for (var fixtureId in predictor.data.fixtures){
			if(!predictor.data.myPredictions[fixtureId].voted){
				$('#predictor').append(predictor.createFixture(fixtureId));
				predictor.attachEvents(fixtureId);
			}
		}
	});
});

predictor.createFixture = function(fixtureId){
	
	var containerNode = $(document.createElement('div')).attr("id" , "predictor_"+fixtureId).attr("class" , "prediction");;
	var fixture = predictor.data.fixtures[fixtureId];
	console.log("FIXTURE: ",fixture);
	var homeStats = predictor.data.teamStats[fixture.home.id];
	var awayStats = predictor.data.teamStats[fixture.away.id];
	var fixtureString = eval(predictor.templates.fixtureString);
	var voteString = eval(predictor.templates.voteString);
	var statsString = eval(predictor.templates.statsString);
	return containerNode.append(fixtureString).append(voteString).append(statsString);
}
predictor.createScoreInvitation = function(fixtureId , chosen){
		var prediction = predictor.data.myPredictions[fixtureId];
		prediction.prediction.result = chosen;
		//var teamString = predictor.data.fixtures[fixtureId][chosen].id;
		var outgoing = $("#predictor div.play");
		var resultstring = (chosen === "draw")?"You predict a draw":predictor.data.teamStats[predictor.data.fixtures[fixtureId][chosen].id].fullName + " to win";
		var scoreString = eval(predictor.templates.scoreString);
		outgoing.parent().append(scoreString);
		var incoming = $("#predictor div.score");
		incoming.find("a.predictor-submit").click(function(event){
			//code to submit prediction here
			console.log("SKIPPEEE!!!");
			return false;
		});
		incoming.find("a.predict-score").click(function(event){
			//code to submit prediction here
			predictor.createScoreForm(fixtureId , chosen);
			console.log("Predicting ...");
			return false;
		});
		predictor.switchState(incoming , outgoing);
		return false;
}
predictor.createScoreForm = function(fixtureId , chosen){
		var outgoing = $("#predictor div.score");
		var fixture = predictor.data.fixtures[fixtureId];
		var formString = eval(predictor.templates.formString);
		outgoing.parent().append(formString);
		var incoming = $("#predictor div.selectScore");
		var homeSpinBox = new SpinBox('homeGoals', {'minimum':0 , 'maximum' : 20});
		var awaySpinBox = new SpinBox('awayGoals', {'minimum':0 , 'maximum' : 20});
		console.log("SPINBOXES: ",homeSpinBox.input , awaySpinBox);
		$(homeSpinBox.input).change(function(event){
			console.log(homeSpinBox.getValue());
			predictor.data.myPredictions[fixtureId].prediction.homeGoals = homeSpinBox.getValue();
			return false;
		})
		$(awaySpinBox.input).change(function(event){
			console.log(awaySpinBox.getValue());
			predictor.data.myPredictions[fixtureId].prediction.awayGoals = awaySpinBox.getValue();
			return false;
		})
		console.log("NODES:" , incoming , outgoing);
		predictor.switchState(incoming , outgoing);
		return false;
}
predictor.switchState = function(incoming,outgoing){
	outgoing.animate({left : -outgoing.parent().outerWidth(), opacity : 0});
	incoming.animate({left : 0 , opacity : 1});
}

predictor.attachEvents = function(fixtureId){
	$("#predictor a.statslink").click(function(fixtureId){
		$("#predictor .stats").slideToggle();
		return false;
	});
	$("#predictor div.play button").click(function(event){
		var chosen = event.target.attributes["id"].value.split("_")[0];
		return predictor.createScoreInvitation(fixtureId,chosen);
	});
}