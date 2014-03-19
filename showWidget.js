Element.prototype.fetchTemplate = function() {
    if(this.tagName.toLowerCase() === "script" && this.getAttribute("type") == "text/html"){
	    this.parentElement.removeChild(this);
	    return this;
    }
    return false;
}
$(document).ready(function(){
	$.get( "predictor.json" , function(data){
		predictor.fixtureString = document.getElementById('predictor_fixture').fetchTemplate().innerHTML.replace(/(\r\n|\n|\r)/gm,"");
		predictor.voteString = document.getElementById('predictor_play').fetchTemplate().innerHTML.replace(/(\r\n|\n|\r)/gm,"");
		predictor.scoreString = document.getElementById('predictor_score').fetchTemplate().innerHTML.replace(/(\r\n|\n|\r)/gm,"");
		predictor.statsString = document.getElementById('predictor_stats').fetchTemplate().innerHTML.replace(/(\r\n|\n|\r)/gm,"");
		for (var fixtureId in predictor.fixtures){
			if(!predictor.myPredictions[fixtureId].voted){
				$('#predictor').append(predictor.createFixture(fixtureId));
				predictor.attachEvents(fixtureId);
			}
		}
	});
});

predictor.createFixture = function(fixtureId){
	
	var containerNode = $(document.createElement('div')).attr("id" , "predictor_"+fixtureId).attr("class" , "prediction");;
	var fixture = predictor.fixtures[fixtureId];
	var homeStats = predictor.teamStats[fixture.home.id];
	var awayStats = predictor.teamStats[fixture.away.id];
	var fixtureString = eval(predictor.fixtureString);
	var voteString = eval(predictor.voteString);
	var statsString = eval(predictor.statsString);
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
		//code to work out which button was clicked and make ajax POST with vote and fixtureId.
		//amend myPredictions to reflect that user has voted on fixtureId
		var prediction = predictor.myPredictions[fixtureId];
		console.log("PREDICTION: ", prediction);
		var chosen = event.target.attributes["id"].value;
		prediction.voted = true;
		prediction.prediction = chosen;
		var outgoing = $("#predictor div.play");
		var resultstring = "TESTING";
		var scoreString = eval(predictor.scoreString);
		outgoing.parent().append(scoreString);
		var incoming = $("#predictor div.score");
		outgoing.animate({left : -outgoing.parent().outerWidth(), opacity : 0});
		incoming.animate({left : 0 , opacity : 1});
		return false;
	});
}