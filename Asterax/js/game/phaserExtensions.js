define(['Phaser'], function(){

	Object.defineProperty(Phaser.Point.prototype, "rotation90", {
		get: function() {
			return new Phaser.Point().angle(this) - (Math.PI/2);
		}
	});
	
	Object.defineProperty(Phaser.Point.prototype, "angle90", {
		get: function() {
			return new Phaser.Point().angle(this, true) - 90;
		}
	});
	
	Phaser.Point.prototype.toStringFixed = function()
	{
		return "[" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + "]";
	}
	
});