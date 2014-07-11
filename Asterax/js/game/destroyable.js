
define(function() {
	
	var module = function()
	{
		this.data = {};
		this.data.destroyables = [];
	};
	
	module.prototype.destroy = function()
	{
		for (var i = 0; i < this.data.destroyables.length; i++)
		{
			this.data.destroyables[i].destroy();
		}
	};
	
	Object.defineProperty(module.prototype, "destroyables", {
		get: function() { return this.data.destroyables; }
	});
	
	return module;
});