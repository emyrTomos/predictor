$(document).ready(function(){
	var widget = new predictor.Widget();
	widget.init();
	$.get( "predictor.json" , function(data){
		console.log("GOT DATA" , data);
		widget.loadData(data.predictor);
		widget.start();
	}).fail(function(){alert("oops");});
});
