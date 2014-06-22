var app = {
		showPolygons: false,
		backgroundSpeed: 0.005,
		defaultMaxLiveBullets: 6,
		defaultFireRate: 50,
		defaultBulletLifespan: 1000,
		defaultBulletSpeed: 200,
		rockSize: {SMALL: 1, MEDIUM: 2, LARGE: 3}
};
var game = {};


var maxSpeed = 250;
var turnSpeed = 200;
var decay = 1;
var acceleration = 400;
var bullets;
var rocks;
var AsteraxSprite;

requirejs.config({
  baseUrl: 'js',
  paths: {
	Phaser:   'lib/phaser.min',
	//preload:  'inc/preload',
	//create:   'inc/create',
	//update:   'inc/update',
	jq:       'lib/jquery-2.0.3.min',
	//main:     'game/main',
	preload:  'game/preload',
	create:   'game/create',
	update:   'game/update',
	AsteraxSprite: 'game/asteraxSprite',
	player:   'game/player',
	ship:     'game/ship',
	rock:     'game/rock',
	bullets:  'game/bullets',
	bullet:   'game/bullet',
	rockGroupController: 'game/rockGroupController'
  },
});

require(['jq', 'Phaser', 'create', 'preload', 'update', 'AsteraxSprite'],


function( jq, Phaser, create ) {
	
	game = new Phaser.Game(800, 600, Phaser.HEADLESS, 'Asterax', {preload: preload, create: create.run, update: update, render: render});
	
});


function render() {
	
}


String.prototype.padZero= function(len, c){
	var s= this, c= c || '0';
	while(s.length< len) s= c+ s;
	return s;
}