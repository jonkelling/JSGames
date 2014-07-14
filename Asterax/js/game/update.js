
define(['Phaser'], function () {
	
	return function()
	{
		app.player.update();
		app.rockGroupController.update();
		
		if (!app.renderForOldDevice)
		{
			//  Scroll the background
			//app.background.tilePosition.x += app.backgroundSpeed;
		}
		
		/*
		var bullet = app.player.ship.bullets.group.getFirstAlive();
		
		if (bullet)
		{
			var v = bullet.rawVelocity.clone().subtract(app.player.ship.rawVelocity.x, app.player.ship.rawVelocity.y);
			
			app.debug.writeDebug3(bullet.speed.toFixed(2));
			app.debug.writeDebug4((v.getMagnitude()).toFixed(2) + "<br/>" + bullet.weapon.pxm);
		}
		else
		{
			// app.debug.writeDebug3("");
			// app.debug.writeDebug4("");
		}
		*/
	};
});
