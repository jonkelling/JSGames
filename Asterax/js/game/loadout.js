
define(function() {
	
	var module = function()
	{
	};
	
	module.prototype.getShip = function(id) {
		var shipData = getData.call(this, "ships", id);
		
		var shipDataWrapper = {
			id: shipData.id,
			name: shipData.name,
			weapon1: this.getWeapon(shipData.weapon1),
			weaponMods: [],
			shield: this.getShield(shipData.shield),
			engine: this.getEngine(shipData.engine)
		};
		
		for (var i = 0; i < shipData.weaponMods.length; i++) {
			shipDataWrapper.weaponMods.push(this.getWeaponMod(shipData.weaponMods[i]));
		}
		
		return shipDataWrapper;
	};
	
	module.prototype.getShield = function(id) {
		return getData.call(this, "shields", id);
	};
	
	module.prototype.getEngine = function(id) {
		return getData.call(this, "engines", id);
	};
	
	module.prototype.getWeapon = function(id) {
		return getData.call(this, "weapons", id);
	};
	
	module.prototype.getWeaponMod = function(id) {
		return getData.call(this, "weaponMods", id);
	};
	
	return new module();
	
	function getData(key, id)
	{
		if (!this.data)
			this.data = game.cache.getJSON("config");
		var entry = this.data[key];
		for (var i = 0; i < entry.length; i++)
			if (entry[i].id == id)
				return entry[i];
		return null;
	}
})