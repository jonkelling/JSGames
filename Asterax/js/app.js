var app = {};
var game = {};

requirejs.config({
  baseUrl: 'js',
  paths: {
	Phaser:   'lib/phaser.min',
	//preload:  'inc/preload',
	//create:   'inc/create',
	//update:   'inc/update',
	jq:       'lib/jquery-2.0.3.min',
	main:     'game/main',
	preload:  'game/preload',
	create:   'game/create',
	update:   'game/update',
	player:   'game/player',
	ship:     'game/ship'
  },
});

require(['jq', 'Phaser', 'create', 'player', 'ship', 'main', 'preload', 'update'], 


function( jq, Phaser, create, player, ship2 ) {
	
	game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create.run, update: update});

	alert(ship2);	
	alert(player.example2);
	
});