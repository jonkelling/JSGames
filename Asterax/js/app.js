var app = {
		showPolygons: false,
		backgroundSpeed: 0.005,
		defaultMaxLiveBullets: 6,
		defaultFireRate: 50,
		defaultBulletLifespan: 1000,
		defaultBulletSpeed: 200,
		rockSize: {SMALL: 1, MEDIUM: 2, LARGE: 3},
		PIOver2: Math.PI/2
};
var game = {};


var maxSpeed = 250;
var turnSpeed = 200;
var decay = 1;
var acceleration = 400;
var bullets;
var rocks;
var AsteraxSprite;
var loadoutX = 0;

requirejs.config({
  baseUrl: 'js',
  paths: {
	Phaser:   'lib/phaser',
	//preload:  'inc/preload',
	//create:   'inc/create',
	//update:   'inc/update',
	jq:       'lib/jquery-2.0.3.min',
	//main:     'game/main',
	phaserExtensions: 'game/phaserExtensions',
	preload:  'game/preload',
	create:   'game/create',
	update:   'game/update',
	loadout:  'game/loadout',
	destroyable: 'game/destroyable',
	AsteraxSprite: 'game/asteraxSprite',
	AutoDestroySprite: 'game/autoDestroySprite',
	player:   'game/player',
	ship:     'game/ship',
	shield:   'game/shield',
	rock:     'game/rock',
	bullets:  'game/bullets',
	bullet:   'game/bullet',
	rockGroupController: 'game/rockGroupController',
	weapon:     'game/weapon',
	peaShooter: 'game/weapons/peaShooter',
	twinShot:   'game/weapons/twinShot',
	tripleShot: 'game/weapons/tripleShot',
	homingShot: 'game/weapons/homingShot',
	explodingShot: 'game/weapons/explodingShot',
	debug:    'game/debug'
  }
});

require(['create', 'jq', 'Phaser', 'phaserExtensions', 'preload', 'update', 'debug'],


function( create ) {
	
	app.debug = require('debug');
	jQuery.getJSON('./assets/config.json', function(data) {
		var width = data.game.width;
		var height = data.game.height;
		game = new Phaser.Game(width, height, Phaser.AUTO, 'Asterax', {preload: require('preload'), create: create.run, update: require('update'), render: render});
	});
	
});


function render() {
	// if (app.render && app.renderContext)
	// {
	// 	app.render.call(app.renderContext);
	// }
}


String.prototype.padZero= function(len, c){
	var s= this, c= c || '0';
	while(s.length< len) s= c+ s;
	return s;
}

app.velocityFromRotation = function (rotation, speed, point)
{
	if (typeof speed === 'undefined') { speed = 60; }
	point = point || new Phaser.Point();
	
	return point.setTo((Math.cos(rotation) * speed), (Math.sin(rotation) * speed));
}
