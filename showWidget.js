var predictor = {"predictor" : {	
	"fixtures" :{
		"STO_MNU" : {
			"home" : {"id" : "STO" , "displayString" : "STO"},
			"away" : {"id" : "MNU" , "displayString" : "MNU"},
			"percentages" : {
				"home": "25%",
				"away":"25%",
				"draw":"25%"
			}
		}
	},
	"teams" : {
		"STO" :
			{
				"fullName" : "Stoke City",
				"league": "premier",
				"position": "3",
				"form": "wwddww",
				"homeForm" : "wdwww",
				"awayForm" : "wdllw",
				"avgHomeGoals":"1.4",
				"avgAwayGoals" :"0.8",
				"avgHomeConceded":"0.2",
				"avgAwayConceded": "1.6"
			},
		"MNU" :
			{
				"fullName" : "Manchester United",
				"league": "premier",
				"position": "7",
				"form": "LDWWL",
				"homeForm" : "DWDWL",
				"awayForm" : "LWLLL",
				"avgHomeGoals":"1.6",
				"avgAwayGoals" :"0.6",
				"avgHomeConceded":"0.8",
				"avgAwayConceded": "1.6"
			}
	},
	"predictions" : {
		"STO_MNU" : {
			"voted" : false,
			"prediction" : {
				"result" : null,
				"homeGoals" : null,
				"awayGoals" : null
			}
		}
	}
}
};
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
		if(!predictor.data.predictions[fixtureId].voted){
			return fixtureId;
		}
	}
}

predictor.createFixture = function(fixtureId){
	var containerNode = $(document.createElement('div')).attr("id" , "predictor_"+fixtureId).attr("class" , "prediction");;
	var fixture = predictor.data.fixtures[fixtureId];
	var resultstring = "No result yet";
	var homeStats = predictor.data.teams[fixture.home.id];
	var awayStats = predictor.data.teams[fixture.away.id];
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
		predictor.data.predictions[fixtureId].prediction.homeGoals = homeSpinBox.getValue();
		return false;
	})
	$(awaySpinBox.input).change(function(event){
		console.log("AWAY EVENT: " , event);
		predictor.data.predictions[fixtureId].prediction.awayGoals = awaySpinBox.getValue();
		return false;
	})
	return containerNode;
}
predictor.createScoreInvitation = function(fixtureId , chosen){
		var prediction = predictor.data.predictions[fixtureId];
		prediction.prediction.result = chosen;
		var resultstring = (chosen === "draw")?"You predict a draw":predictor.data.teams[predictor.data.fixtures[fixtureId][chosen].id].fullName + " to win";
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