define(function() {
	var Ship = function() {
		this.name = "theJon";
	}
	
	Ship.prototype.SayMyName = function() {
		alert(this.name);
	}
	
	return Ship;
});