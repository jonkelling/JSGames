var app = {};
var game = {};


var player;
var cursors;
var maxSpeed = 250;
var turnSpeed = 200;
var decay = 1;
var acceleration = 400;
var bullets;
var rocks;

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
	ship:     'game/ship',
	rock:     'game/rock',
	rockGroupController: 'game/rockGroupController'
  },
});

require(['jq', 'Phaser', 'create', 'main', 'preload', 'update'],


function( jq, Phaser, create ) {
	
	game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create.run, update: update});
	
});

