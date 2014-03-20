var predictor = predictor || {};
Element.prototype.fetchTemplate = function() {
    if(this.tagName.toLowerCase() === "script" && this.getAttribute("type") === "text/html"){
	    this.parentElement.removeChild(this);
	    return this;
    }
    return false;
}
$(document).ready(function(){
	$.get( "predictor.json" , function(data){
		predictor.data = data.predictor;
		predictor.templates = {};
		predictor.templates.fixtureString = document.getElementById('predictor_fixture').fetchTemplate().innerHTML.replace(/(\r\n|\n|\r)/gm,"");
		predictor.templates.voteString = document.getElementById('predictor_play').fetchTemplate().innerHTML.replace(/(\r\n|\n|\r)/gm,"");
		predictor.templates.scoreString = document.getElementById('predictor_score').fetchTemplate().innerHTML.replace(/(\r\n|\n|\r)/gm,"");
		predictor.templates.formString = document.getElementById('predictor_form').fetchTemplate().innerHTML.replace(/(\r\n|\n|\r)/gm,"");
		predictor.templates.statsString = document.getElementById('predictor_stats').fetchTemplate().innerHTML.replace(/(\r\n|\n|\r)/gm,"");
		var fixtureId = predictor.chooseFixture();
		$('#predictor').append(predictor.createFixture(fixtureId));
		predictor.attachEvents(fixtureId);
	});
});
/* Pick the next fixture the user hasn't yet made a prediction on */
predictor.chooseFixture = function(){
	for (var fixtureId in predictor.data.fixtures){
		if(!predictor.data.myPredictions[fixtureId].voted){
			return fixtureId;
		}
	}
}

predictor.createFixture = function(fixtureId){
	var containerNode = $(document.createElement('div')).attr("id" , "predictor_"+fixtureId).attr("class" , "prediction");;
	var fixture = predictor.data.fixtures[fixtureId];
	var resultstring = "No result yet";
	var homeStats = predictor.data.teamStats[fixture.home.id];
	var awayStats = predictor.data.teamStats[fixture.away.id];
	var fixtureString = eval(predictor.templates.fixtureString);
	var voteString = eval(predictor.templates.voteString);
	var scoreString = eval(predictor.templates.scoreString);
	var formString = eval(predictor.templates.formString);
	var statsString = eval(predictor.templates.statsString);
	containerNode.append(fixtureString).append(voteString).append(statsString);
	containerNode.find('#play_container').append(scoreString).append(formString);
	var homeSpinBox = new SpinBox(containerNode.find('#homeGoals')[0], {'minimum':0 , 'maximum' : 20});
	var awaySpinBox = new SpinBox(containerNode.find('#awayGoals')[0], {'minimum':0 , 'maximum' : 20});
	$(homeSpinBox.input).change(function(event){
		console.log("HOME EVENT: " , event);
		predictor.data.myPredictions[fixtureId].prediction.homeGoals = homeSpinBox.getValue();
		return false;
	})
	$(awaySpinBox.input).change(function(event){
		console.log("AWAY EVENT: " , event);
		predictor.data.myPredictions[fixtureId].prediction.awayGoals = awaySpinBox.getValue();
		return false;
	})
	return containerNode;
}
predictor.createScoreInvitation = function(fixtureId , chosen){
		var prediction = predictor.data.myPredictions[fixtureId];
		prediction.prediction.result = chosen;
		var resultstring = (chosen === "draw")?"You predict a draw":predictor.data.teamStats[predictor.data.fixtures[fixtureId][chosen].id].fullName + " to win";
		var outgoing = $("#predictor div.play");
		var incoming = $("#predictor div.score");
		incoming.find('#resultsDisplay').html(resultstring);
		predictor.switchState(incoming , outgoing);
		return false;
}
predictor.createScoreForm = function(fixtureId){
		var outgoing = $("#predictor div.score");
		var fixture = predictor.data.fixtures[fixtureId];
		var incoming = $("#predictor div.selectScore");
		predictor.switchState(incoming , outgoing);
		return false;
}
predictor.submitPrediction = function(fixtureId){
	//AJAX POST
	//Create new fixture node
	//
	//Clear out old fixture node
	//Move in new one
	console.log("SUBMIT PREDICTION");
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
	$("#predictor button.predictor-submit").click(function(event){
		console.log("Invoking submit");
		return predictor.submitPrediction(fixtureId);
	});
	$("#predictor button.predict-score").click(function(event){
		return predictor.createScoreForm(fixtureId);
	});

}