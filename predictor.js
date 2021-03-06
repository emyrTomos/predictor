
var predictor = {};
predictor.fixtures = {
	'STO_MNU' : {
		'home' : {'id' : 'STO' , 'displayString' : 'STO'},
		'away' : {'id' : 'MNU' , 'displayString' : 'MNU'},
		'percentages' : {
			'home': '25%',
			'away':'25%',
			'draw':'25%'
		}
	}
}
predictor.teamStats = {
	'STO' :
		{
			'league': 'premier',
			'position': '3',
			'form': 'wwddww',
			'homeForm' : 'wdwww',
			'awayForm' : 'wdllw',
			'avgHomeGoals':'1.4',
			'avgAwayGoals' :'0.8',
			'avgHomeConceded':'0.2',
			'avgAwayConceded': '1.6'
		},
	'MNU' :
		{
			'league': 'premier',
			'position': '7',
			'form': 'LDWWL',
			'homeForm' : 'DWDWL',
			'awayForm' : 'LWLLL',
			'avgHomeGoals':'1.6',
			'avgAwayGoals' :'0.6',
			'avgHomeConceded':'0.8',
			'avgAwayConceded': '1.6'
		}
}
predictor.myPredictions = {
	STO_MNU : {
		'voted' : false,
		'prediction' : null
	}
}
