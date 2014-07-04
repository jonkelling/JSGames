
define(function() {
	
	var module = function()
	{
		
	};
	
	module.prototype.func = function()
	{
	}
	
	Object.defineProperty(module.prototype, "prop", {
		get: function() { return null; },
		set: function(value) { }
	})
	
	return module;
});