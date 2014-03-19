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
predictor.createScoreInvitation = function(resultstring){
	return 
}
predictor.attachEvents = function(fixtureId){
	$("#predictor a.statslink").click(function(fixtureId){
		$("#predictor .stats").slideToggle();
		return false;
	});
	$("#predictor div.play button").click(function(event){
		var prediction = predictor.data.myPredictions[fixtureId];
		console.log("PREDICTION: ", prediction);
		var chosen = event.target.attributes["id"].value.split("_")[0];
		console.log("CHOSEN IS: " , chosen);
		prediction.voted = true;
		prediction.prediction = chosen;
		var teamString = predictor.data.fixtures[fixtureId][chosen].id;
		console.log("TEAM ID: ", predictor.data.teamStats[teamString]);

		var outgoing = $("#predictor div.play");
		var resultstring = (chosen === "draw")?"You predict a draw":predictor.data.teamStats[teamString].fullName + " to win";
		var scoreString = eval(predictor.templates.scoreString);
		outgoing.parent().append(scoreString);
		var incoming = $("#predictor div.score");
		outgoing.animate({left : -outgoing.parent().outerWidth(), opacity : 0});
		incoming.animate({left : 0 , opacity : 1});
		return false;
	});
}