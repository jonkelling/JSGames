
define(['weapon', 'bullet'], function(Weapon) {

    var spiralRadius = 8;
    var spiralSpeed = 40;

	var module = function(parent)
	{
		Weapon.call(this, parent, "peaShooter");
	};
	
	module.prototype = Object.create(Weapon.prototype);
	module.prototype.constructor = module;
	
	// module.prototype.getBulletClass = function()
	// {
	// 	return Bullet;
	// }

    module.prototype.setupNextBullet = function(b)
    {
        Weapon.prototype.setupNextBullet.call(this, b);

        b.originalWidth = b.originalWidth || b.width;
        b.originalHeight = b.originalHeight || b.height;
    };

    module.prototype.aliveBulletUpdate = function(b)
    {
        var prevMove = Math.sin(getPreviousDistanceTraveled.call(b)/spiralSpeed) * spiralRadius;
        var currentMove = Math.sin(getDistanceTraveled.call(b)/spiralSpeed) * spiralRadius;
        var currentMove2 = Math.sin(getDistanceTraveled.call(b)/spiralSpeed/2) * spiralRadius;
        var actualMove = currentMove - prevMove;

        var movePoint = new Phaser.Point().rotate(0, 0, b.rotation, false, actualMove);
        b.body.x += movePoint.x;
        b.body.y += movePoint.y;

        b.width = 1 + ((currentMove2/6) * b.originalWidth);
//        b.height = 1 + ((currentMove2/4) * b.originalHeight);
    };

	return module;

    function getPreviousDistanceTraveled()
    {
        return this.firePosition.distance(this.previousPosition);
    }

    function getDistanceTraveled()
    {
        return this.firePosition.distance(this.position);
    }
	
});