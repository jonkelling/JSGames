
define(['require', 'AsteraxSprite', 'shield', 'loadout', 'peaShooter', 'twinShot', 'tripleShot', 'homingShot', 'explodingShot', 'scatterBomb'], function(require, AsteraxSprite, Shield, Loadout) {
	
	var killCount = 0;
	var turningShipRight = false;
	var turningShipLeft = false;
	var leftPointerStart = 0;
	var wherePointer1Was = null;
	var wherePointer2Was = null;
	var turningSensitivity = 5;
	
	var module = function(aName)
	{
		AsteraxSprite.call(this, game, game.width/2, game.height/2, 'ship');
		
		this.name = aName ? aName : "A-Ship";
		this.events.onAddedToGroup.addOnce(this.create, this);
	};
	
	module.prototype = Object.create(AsteraxSprite.prototype);
	module.prototype.constructor = module;
	
	module.prototype.create = function()
	{
		this.loadConfig(3);
		
		this.body.data.immuneToRocks = [];
		
		this.frame = 0;
		this.body.damping = 0;
		this.body.angularDamping = 0;
		
		this.outOfBoundsKill = false;
		
		this.body.clearShapes();
		this.body.addPhaserPolygon('ship', 'ship_00');
		
		this.body.setCollisionGroup(app.shipCollisionGroup);
		this.body.collides([app.rocksCollisionGroup]);
		this.body.onBeginContact.add(hitRock, this);
		
		this.speed = 0;
		this.prevVelocity = new Phaser.Point();
		
		var weaponClass = require(this.loadout.weapon1.moduleName);
		this.bullets = new weaponClass(this.parent);
//		this.bullets.ship = this;
		
		this.bullets.loadWeaponMods(this.loadout.weaponModIds);

        app.fireButton.onDown.add(fireBullet, this); //fire button
		// this.game.input.tapRate = 150;
		// this.game.input.onTap.add(fireBullet, this);
	};
	
	module.prototype.loadConfig = function(id) {
		this.loadout = Loadout.getShip(id);
		this.health = this.loadout.shield.health;
	};
	
	function stoppedTouchingScreen()
	{
	    /*if (this.game.input.pointer1.isUp && (wherePointer1Was < (this.game.width / 2)))
	    {
	        leftPointerStart = 0;
	        turningShipRight = false;
	        turningShipLeft = false;
	    }
	    if (this.game.input.pointer2.isUp && (wherePointer2Was < (this.game.width / 2)))
	    {
	        leftPointerStart = 0;
	        turningShipRight = false;
	        turningShipLeft = false;
	    }*/
	    turningShipLeft = false;
	    turningShipRight = false;
	    leftPointerStart = 0;
	}
	
	module.prototype.update = function()
	{
        if (!this.exists)
        {
            return;
        }

        AsteraxSprite.prototype.update.apply(this, arguments);

        if (app.fireButton.isDown && this.bullets.automatic == true)
		{
			fireBullet.call(this);
		}
		else
		{
			// this won't work the way the code runs now.
			// i'm just leaving this here to remind me that I had this idea.
			// this.bullets.skipOneShot = false;
		}
	    
	    //if lifted finger
        this.game.input.onUp.add(stoppedTouchingScreen, this);
	   
	    //definitions of pointers touching parts of the screen
    	var p1Right = this.game.input.pointer1.x > (this.game.width / 2);
    	var p1Left = this.game.input.pointer1.x < (this.game.width / 2);
    	var p1Down = this.game.input.pointer1.y > (this.game.height / 2);
    	var p1Up = this.game.input.pointer1.y < (this.game.height / 2);
    	var p2Right = this.game.input.pointer2.x > (this.game.width / 2);
    	var p2Left = this.game.input.pointer2.x < (this.game.width / 2);
    	var p2Down = this.game.input.pointer2.y > (this.game.height / 2);
    	var p2Up = this.game.input.pointer2.y < (this.game.height / 2);
    	wherePointer1Was = this.game.input.pointer1.x;
    	wherePointer2Was = this.game.input.pointer2.x;
    	
		//turning the ship
		if (this.game.input.pointer1.isDown && p1Left)
		{
		    if (leftPointerStart == 0)
		    {
		        leftPointerStart = this.game.input.pointer1.x;
		    }
		    if (leftPointerStart != 0 && (this.game.input.pointer1.x >= (leftPointerStart + turningSensitivity)))
		    {
		        turningShipRight = true;
		        turningShipLeft = false;
		    }
		    if (leftPointerStart != 0 && (this.game.input.pointer1.x <= (leftPointerStart - turningSensitivity)))
		    {
		        turningShipLeft = true;
		        turningShipRight = false;
		    }
		}
		if (this.game.input.pointer2.isDown && p2Left)
		{
		    if (leftPointerStart == null)
		    {
		        leftPointerStart = this.game.input.pointer2.x;
		    }
		    if (leftPointerStart != null && (this.game.input.pointer2.x >= (leftPointerStart + turningSensitivity)))
		    {
		        turningShipRight = true;
		        turningShipLeft = false;
		    }
		    if (leftPointerStart != null && (this.game.input.pointer2.x <= (leftPointerStart - turningSensitivity)))
		    {
		        turningShipLeft = true;
		        turningShipRight = false;
		    }
		}
		
		var isTurning = 
			app.cursors.left.isDown ||
			app.cursors.right.isDown;
		
		app.cursors.left.isDown  ?	this.body.rotateLeft(70) :
		app.cursors.right.isDown ?	this.body.rotateRight(70) :
		//(this.game.input.pointer1.isDown && (this.game.input.pointer1.x < (this.game.width / 3))) ? this.body.rotateLeft(70) :
		//(this.game.input.pointer2.isDown && (this.game.input.pointer2.x < (this.game.width / 3))) ? this.body.rotateLeft(70) :
		turningShipLeft == true ? this.body.rotateLeft(70) :
		turningShipRight == true ? this.body.rotateRight(70) :
									this.body.setZeroRotation();
	
		//activating thrust if touching bottom-right side of screen on iPhone
		var touchingLowerRight = false;
    	if ( (this.game.input.pointer1.isDown && p1Right && p1Down) || (this.game.input.pointer2.isDown && p2Right && p2Down) )
    	{
		   touchingLowerRight = true; 
		}
		if ( (this.game.input.pointer1.isDown && p1Right && p1Up) || (this.game.input.pointer2.isDown && p2Right && p2Up) )
		{
		    fireBullet.call(this);
		}
		
// 		app.debug.writeDebug3(this.touchingLowerRight);
// 		app.debug.writeDebug4(this.touchingLeftScreen);
        // app.debug.writeDebug3(this.game.input.pointer1.x + ", " + this.game.input.pointer1.y + ", " + this.game.input.pointer1.isDown);
        // app.debug.writeDebug4(this.game.input.pointer2.x + ", " + this.game.input.pointer2.y + ", " + this.game.input.pointer2.isDown);
		
		setShipFrame(this);
		
		if (app.cursors.up.isDown || touchingLowerRight)
		{
			if (this.speed > this.loadout.engine.topSpeed)
			{
				var angleFromVelocity = new Phaser.Point().angle(new Phaser.Point(this.body.velocity.x, this.body.velocity.y).rperp(), true);
				if (Math.abs(this.body.angle - angleFromVelocity) > 2.5)
				{
					thrust.call(this, this.loadout.engine.acceleration);
				}
				else if (!isTurning)
				{
				}
				
				var newVelocity = this.rawVelocity.clone().setMagnitude(this.loadout.engine.topSpeed);
				this.body.data.velocity[0] = newVelocity.x;
				this.body.data.velocity[1] = newVelocity.y;
				
				// app.debug.writeDebug([
				// 		this.loadout.engine.topSpeed,
				// 		this.speed,
				// 		this.rawVelocity.getMagnitude(),
				// 		"angle:  " + this.body.angle,
				// 		"angle2: " + new Phaser.Point().angle(new Phaser.Point(this.body.velocity.x, this.body.velocity.y).rperp(), true),
				// 	]);
			}
			else
			{
				thrust.call(this, this.loadout.engine.acceleration);
			}
		}
		
		this.bullets.update();
		
		//app.debug.writeDebug(
		//		[
		//			"speed:           " + Math.round(this.body.speed),
		//			"velocity:        " + roundPoint(this.body.velocity),
		//			"max velocity:    " + roundPoint(this.body.maxVelocity),
		//			"correct max vel: " + roundPoint(v2),
		//			"drag:            " + roundPoint(this.body.drag),
		//			"new velocity:    " + roundPoint(this.body.newVelocity),
		//		]);
	};
	
	return module;
	
	function thrust(acceleration)
	{
		// if (!(this.prevVelocity.equals(this.body.velocity)))
		// 	this.speed = new Phaser.Point().distance(this.body.velocity);
		
		// app.debug.writeDebug2([
		// 	["prev vel: " + [Math.round(this.prevVelocity.x, 2), Math.round(this.prevVelocity.y, 2)]],
		// 	["velocity: " + [Math.round(this.body.velocity.x, 2), Math.round(this.body.velocity.y, 2)]],
		// 	["speed:    " + this.speed]
		// ]);
		
		//if (this.loadout.engine.topSpeed > this.speed)
		{
			this.body.thrust(acceleration);
		}
	}

	function setShipFrame(ship) {
		var angle = ship.angle < 0 ? ship.angle + 360 : ship.angle;
		while (angle >= 360)
			angle -= 360;
		
		var nextFrame = Math.round(angle / 6);
		if (nextFrame >= 60)
			nextFrame = 0;
		
		if (ship.frame != nextFrame) {
			ship.frame = nextFrame;
			ship.body.clearShapes();
			ship.body.addPhaserPolygon('ship', 'ship_' + (ship.frame).toString().padZero(2));
			ship.body.setCollisionGroup(app.shipCollisionGroup);
		}
	}
	
	function hitRock(rock) {
		if (rock.sprite.canHitShip)
		{
			rock.sprite.canHitShip = false;
			killCount++;
			
			if (!this.player.invincible)
			{
				this.damage(1);
				rock.sprite.kill();
			}
			
			if (this.exists)
			{
				startShieldHitAnimation.call(this);
			}
			else
			{
				
			}

            this.game.time.events.add(Phaser.Timer.HALF, resetRockHit, this, rock.sprite);
		}
	}
	
	function resetRockHit(rock)
	{
		rock.canHitShip = true;
	}
	
	function fireBullet()
	{
		if (this.exists)
		{
		    this.bullets.fire();
		}
	}
	
	function startShieldHitAnimation()
	{
		var shieldSprite = this.game.add.sprite(this.x, this.y, 'shield');
		var shieldSprite2 = this.game.add.sprite(this.x, this.y, 'shield');
		var t = this.game.add.tween(shieldSprite);
		var t2 = this.game.add.tween(shieldSprite2);

		shieldSprite.alpha = 0;
		shieldSprite.anchor.setTo(0.5);
		shieldSprite2.anchor.setTo(0.5);
		shieldSprite2.alpha = 0.7;
		shieldSprite2.position = this.position;
		
		t2.to( { alpha: 0 }, 500, Phaser.Easing.Quadratic.In, true, 0, 0, false);
		
		// (properties, duration, ease, autoStart, delay, repeat, yoyo)
        this.game.time.events.add(50, function() {
			shieldSprite.alpha = 0.3;
			var p = new Phaser.Point(this.body.velocity.x, this.body.velocity.y);
			p.x *= 10;
			p.y *= 10;
			t.to( {  alpha: 0
					,x: shieldSprite.x - p.x
					,y: shieldSprite.y - p.y
					,width: 1.4 * shieldSprite.width
					,height: 1.4 * shieldSprite.height
				  }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
		}, this);
		
	}
	
});
